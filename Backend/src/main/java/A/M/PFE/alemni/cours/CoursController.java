package A.M.PFE.alemni.cours;

import A.M.PFE.alemni.cours.category.Category;
import A.M.PFE.alemni.cours.category.CategoryService;
import A.M.PFE.alemni.cours.video.Video;
import A.M.PFE.alemni.cours.video.VideoRepository;
import A.M.PFE.alemni.cours.video.VideoService;
import A.M.PFE.alemni.user.UserRepository;
import A.M.PFE.alemni.user.UserService;
import A.M.PFE.alemni.user.model.PurchasedCourse;
import A.M.PFE.alemni.user.model.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/Courses")
public class CoursController {

    @Autowired
    private CoursService coursService;
    @Autowired
    private CoursRepository coursRepository;
    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PaymentService paymentService;
    @Autowired
    private UserService userService;
    @Autowired
    private VideoService videoService;
    @Autowired
    private VideoRepository videoRepository;
    @Autowired
    private CategoryService categoryService;

    // Get all courses
    @GetMapping
    public ResponseEntity<List<Cours>> getAllCourses() {
        List<Cours> courses = coursService.allCourses();
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }

    // Get single course
    @GetMapping("/{courseId}")
    public ResponseEntity<Cours> getCourseById(@PathVariable String courseId) {
        Optional<Cours> course = coursRepository.findById(courseId);
        if (course.isPresent()) {
            return new ResponseEntity<>(course.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Search courses
    @GetMapping("/search")
    public List<Cours> searchCourses(@RequestParam String keyword) {
        return coursRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Cours>> getCoursesByCategory(@PathVariable String categoryId) {
        List<Cours> courses = coursService.getCoursesByCategoryId(categoryId);
        if (courses.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }

    // Get courses uploaded by a specific educator
    @GetMapping("/educator/{educatorId}")
    public ResponseEntity<List<Cours>> getCoursesByEducator(@PathVariable String educatorId) {
        try {
            String id = new String(educatorId);
            List<Cours> courses = coursService.getCoursesByEducatorId(id);
            if (courses.isEmpty()) {
                System.out.println("No courses found for educator ID: " + educatorId);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(courses, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            System.out.println("Invalid educator ID format: " + educatorId);
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    // Create a course
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Map<String, Object>> createCours(
            @RequestParam("file") MultipartFile file,
            @ModelAttribute Cours cours,
            @RequestParam User educator,
            @RequestParam CourseMediaType type,
            @RequestParam List<String> categoryIds) { // Include category IDs
        try {
            if (!educator.isEducator()) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
            String fileUrl = coursService.handleFileUpload(file, type);
            cours.setCourseImage(fileUrl);
            cours.setEducatorName(educator.getFirstName() + " " + educator.getLastName());

            // Set categories
            List<Category> categories = categoryService.getCategoriesByIds(categoryIds);
            cours.setCategories(categories);

            Map<String, Object> response = coursService.addCours(cours, educator, file, type);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (UnauthorizedException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // Delete media
    @DeleteMapping("/{courseId}/delete-file")
    public ResponseEntity<String> deleteFile(@PathVariable String courseId, @RequestParam("fileUrl") String fileUrl) {
        try {
            fileStorageService.delete(fileUrl);
            coursService.deleteMediaFromCourse(courseId, fileUrl);
            return new ResponseEntity<>("File deleted successfully", HttpStatus.OK);
        } catch (IOException e) {
            System.err.println("IOException occurred during file deletion: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Failed to delete file due to I/O error", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            System.err.println("Exception occurred during file deletion: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Failed to delete file", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update a course
    @PutMapping
    public ResponseEntity<Map<String, Object>> modifyCours(
            @RequestParam("cours") String coursJson,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("educator") String educatorId,
            @RequestParam("categoryIds") List<String> categoryIds) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Cours cours = objectMapper.readValue(coursJson, Cours.class);
            Optional<User> educatorOptional = userRepository.findById(educatorId);
            if (educatorOptional.isEmpty() || !educatorOptional.get().isEducator()) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }
            User educator = educatorOptional.get();

            // Fetch and set the categories
            List<Category> categories = categoryService.getCategoriesByIds(categoryIds);
            cours.setCategories(categories);

            Map<String, Object> response = coursService.updateCours(cours, educator, file);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            if (e instanceof UnauthorizedException) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            } else if (e instanceof NotFoundException) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            } else {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }


    // Delete a course
    @DeleteMapping("/{coursId}")
    public ResponseEntity<Map<String, String>> deleteCours(@PathVariable String coursId, @RequestParam User educator) {
        try {
            Optional<Cours> courseOptional = coursRepository.findById(coursId);
            if (!courseOptional.isPresent()) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
            Cours course = courseOptional.get();
            if (!course.getEducatorId().equals(educator.getId())) {
                return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
            }
            coursService.deleteCours(coursId, educator);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Course and related quizzes deleted successfully.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Add a quiz to a course
    @PostMapping("/{courseId}/quizzes")
    public ResponseEntity<Map<String, Object>> addQuizToCourse(@PathVariable String courseId, @RequestParam String quizId, @RequestParam User educator) {
        try {
            Map<String, Object> response = coursService.addQuizToCourse(courseId, quizId, educator);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (UnauthorizedException e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Upload files
    @PostMapping("/{courseId}/upload-file")
    public ResponseEntity<String> uploadFile(
            @PathVariable String courseId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") String type,
            @RequestParam User educator,
            @RequestParam("description") String description,
            @RequestParam("title") String title
    ) {
        try {
            CourseMediaType mediaType;
            switch (type.toUpperCase()) {
                case "MP4":
                case "VIDEO":
                    mediaType = CourseMediaType.VIDEO;
                    break;
                case "PDF":
                    mediaType = CourseMediaType.PDF;
                    break;
                case "IMAGE":
                    mediaType = CourseMediaType.IMAGE;
                    break;
                default:
                    return new ResponseEntity<>("Invalid media type provided", HttpStatus.BAD_REQUEST);
            }
            String fileUrl = fileStorageService.store(file, mediaType);
            System.out.println("File stored at URL: " + fileUrl);
            coursService.addMediaToCourse(courseId, fileUrl, mediaType, educator, title, description);
            return new ResponseEntity<>("File uploaded successfully", HttpStatus.OK);
        } catch (IOException e) {
            System.err.println("IOException occurred during file upload: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Failed to upload file due to I/O error", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            System.err.println("Exception occurred during file upload: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Failed to upload file", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    // Get files for Educator
    @GetMapping("/{courseId}/files")
    public ResponseEntity<Map<String, List<Media>>> getFilesByCourseId(@PathVariable String courseId, @RequestParam("educatorId") String educatorId) {
        Optional<Cours> courseOptional = coursRepository.findById(courseId);
        if (!courseOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Cours course = courseOptional.get();
        if (!course.getEducatorId().equals(educatorId)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        // Group other media files
        Map<String, List<Media>> groupedMediaFiles = course.getMedia().stream()
                .collect(Collectors.groupingBy(media -> media.getType().name()));

        // Fetch videos for the course
        List<Video> videos = videoRepository.findByCourseId(courseId);

        // Convert videos to Media format with likes
        List<Media> videoMedia = videos.stream().map(video -> {
            Media media = new Media();
            media.setId(video.getId());
            media.setUrl(video.getUrl());
            media.setType(CourseMediaType.VIDEO);
            media.setTitle(video.getTitle());
            media.setDescription(video.getDescription());
            media.setViews(video.getViews());
            media.setLikes(video.getLikes()); // Ensure likes are included
            return media;
        }).collect(Collectors.toList());

        // Add videos to the grouped media files
        groupedMediaFiles.put("VIDEO", videoMedia);

        return new ResponseEntity<>(groupedMediaFiles, HttpStatus.OK);
    }
    // For User
    @GetMapping("/{courseId}/details")
    public ResponseEntity<Map<String, List<Media>>> getFilesForUser(@PathVariable String courseId, @RequestParam("userId") String userId) {
        Optional<Cours> courseOptional = coursRepository.findById(courseId);
        if (!courseOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Cours course = courseOptional.get();
        List<Video> videos = videoService.getVideosByCourseId(courseId);
        Map<String, List<Media>> groupedMediaFiles = course.getMedia().stream().collect(Collectors.groupingBy(media -> media.getType().name()));
        groupedMediaFiles.put("VIDEO", videos.stream().map(video -> {
            Media media = new Media();
            media.setId(video.getId());
            media.setUrl(video.getUrl());
            media.setType(CourseMediaType.VIDEO);
            media.setTitle(video.getTitle());
            media.setDescription(video.getDescription());
            return media;
        }).collect(Collectors.toList()));
        return new ResponseEntity<>(groupedMediaFiles, HttpStatus.OK);
    }

    // Payment
    @PostMapping("/{courseId}/purchase")
    public ResponseEntity<?> purchaseCourse(@PathVariable String courseId, @RequestParam("userId") String userId) {
        try {
            User user = userRepository.findById(userId).orElseThrow(() -> new Exception("User not found"));
            Cours course = coursRepository.findById(courseId).orElseThrow(() -> new Exception("Course not found"));

            // Check if the course has already been purchased
            if (user.getPurchasedCourses().stream().anyMatch(pc -> pc.getCourseId().equals(courseId))) {
                return ResponseEntity.badRequest().body("Course already purchased");
            }

            // Verify credit card information
            boolean hasCardInfo = userService.hasCardInformation(userId);
            if (!hasCardInfo) {
                return ResponseEntity.badRequest().body("No credit card information found. Please add card details to proceed.");
            }

            double coursePrice = course.getPrice();
            String paymentIntent = paymentService.createPaymentIntent(userId, coursePrice);

            PurchasedCourse purchasedCourse = new PurchasedCourse(courseId, LocalDateTime.now());
            user.getPurchasedCourses().add(purchasedCourse);
            userRepository.save(user);

            // Increment the purchase count
            coursService.incrementPurchaseCount(courseId);

            return ResponseEntity.ok(Map.of("clientSecret", paymentIntent, "message", "Purchase initiated successfully. Complete the payment."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/my-courses")
    public ResponseEntity<List<Cours>> getPurchasedCourses(@RequestParam("userId") String userId) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (!userOptional.isPresent()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            User user = userOptional.get();
            List<String> purchasedCourseIds = user.getPurchasedCourses().stream().map(PurchasedCourse::getCourseId).collect(Collectors.toList());
            List<Cours> purchasedCourses = coursRepository.findAllById(purchasedCourseIds);
            return new ResponseEntity<>(purchasedCourses, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/purchase-history")
    public ResponseEntity<List<Map<String, Object>>> getPurchaseHistory(@RequestParam("userId") String userId) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (!userOptional.isPresent()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            User user = userOptional.get();
            List<PurchasedCourse> purchaseHistory = user.getPurchasedCourses();
            List<Map<String, Object>> response = purchaseHistory.stream().map(purchasedCourse -> {
                Map<String, Object> courseDetails = new HashMap<>();
                Optional<Cours> courseOptional = coursRepository.findById(purchasedCourse.getCourseId());
                if (courseOptional.isPresent()) {
                    Cours course = courseOptional.get();
                    courseDetails.put("courseId", course.getId());
                    courseDetails.put("title", course.getTitle());
                    courseDetails.put("description", course.getDescription());
                    courseDetails.put("courseImage", course.getCourseImage());
                    courseDetails.put("price", course.getPrice());
                    courseDetails.put("purchaseDate", purchasedCourse.getPurchaseDate());
                }
                return courseDetails;
            }).collect(Collectors.toList());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Increment visit count
    @PutMapping("/{courseId}/increment-visit")
    public ResponseEntity<Void> incrementVisitCount(@PathVariable String courseId) {
        try {
            coursService.incrementVisitCount(courseId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{courseId}/visit-count")
    public ResponseEntity<Integer> getVisitCount(@PathVariable String courseId) {
        Optional<Cours> courseOptional = coursService.getCourseById(courseId);
        if (courseOptional.isPresent()) {
            return ResponseEntity.ok(courseOptional.get().getVisitCount());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{courseId}/increment-purchase")
    public ResponseEntity<Void> incrementPurchaseCount(@PathVariable String courseId) {
        try {
            coursService.incrementPurchaseCount(courseId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (NotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint to get the purchase count
    @GetMapping("/{courseId}/purchase-count")
    public ResponseEntity<Integer> getPurchaseCount(@PathVariable String courseId) {
        Optional<Cours> courseOptional = coursService.getCourseById(courseId);
        if (courseOptional.isPresent()) {
            return ResponseEntity.ok(courseOptional.get().getPurchaseCount());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/{courseId}/check-purchase")
    public ResponseEntity<Map<String, Boolean>> checkCourseOwnership(@PathVariable String courseId, @RequestParam("userId") String userId) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (!userOptional.isPresent()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            User user = userOptional.get();
            boolean isPurchased = user.getPurchasedCourses().stream().anyMatch(pc -> pc.getCourseId().equals(courseId));
            Map<String, Boolean> response = new HashMap<>();
            response.put("isPurchased", isPurchased);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/most-bought-courses")
    public ResponseEntity<List<Cours>> getMostBoughtCourses() {
        List<Cours> courses = coursService.getMostBoughtCourses();
        return new ResponseEntity<>(courses, HttpStatus.OK);
    }

}
