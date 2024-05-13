package A.M.PFE.alemni.cours;

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
    CoursRepository coursRepository;
    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PaymentService paymentService;
    @Autowired
    private UserService userService;

    // Get all courses
    @GetMapping
    public ResponseEntity<List<Cours>> getAllCourses() {
        List<Cours> courses = coursService.allCourses();
        // Return the list of courses in the response
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
            @RequestParam CourseMediaType type) {
        try {
            // Check if the user is an educator
            if (!educator.isEducator()) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }

            // Handle file upload and get the file URL
            String fileUrl = coursService.handleFileUpload(file, type);
            cours.setCourseImage(fileUrl); // Set course image URL

            // Set educator's name
            cours.setEducatorName(educator.getFirstName() + " " + educator.getLastName());

            // Call addCours in CoursService and get response map
            Map<String, Object> response = coursService.addCours(cours, educator, file, type);

            // Return created status with the response map
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (UnauthorizedException e) {
            // Return forbidden status for unauthorized access
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (Exception e) {
            // Log the error for debugging
            e.printStackTrace();
            // Return internal server error status for other exceptions
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update a course
    @PutMapping
    public ResponseEntity<Map<String, Object>> modifyCours(
            @RequestParam("cours") String coursJson,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam User educator
    ) {
        try {
            // Parse the course JSON into a Cours object
            ObjectMapper objectMapper = new ObjectMapper();
            Cours cours = objectMapper.readValue(coursJson, Cours.class);

            // Check if the user is an educator
            if (!educator.isEducator()) {
                return new ResponseEntity<>(HttpStatus.FORBIDDEN);
            }

            // Call the service method to update the course
            Map<String, Object> response = coursService.updateCours(cours, educator, file);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            // Handle exceptions (unauthorized, not found, etc.)
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
            // Fetch the course
            Optional<Cours> courseOptional = coursRepository.findById(coursId);
            if (!courseOptional.isPresent()) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
            Cours course = courseOptional.get();

            // Check if the user is the creator of the course
            if (!course.getEducatorId().equals(educator.getId())) {
                return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
            }

            // Delete the course and related quizzes
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
            // Call the service method to add the quiz to the course and return the response
            Map<String, Object> response = coursService.addQuizToCourse(courseId, quizId, educator);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (UnauthorizedException e) {
            // Return forbidden status if there's an unauthorized exception
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        } catch (NotFoundException e) {
            // Return not found status if the course or quiz is not found
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //upload Files
    @PostMapping("/{courseId}/upload-file")
    public ResponseEntity<String> uploadFile(
            @PathVariable String courseId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") String type, // Changed to String
            @RequestParam User educator,
            @RequestParam("description") String description,
            @RequestParam("title") String title
    ) {
        try {
            // Convert the incoming `type` to `CourseMediaType`
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

            // Continue with your existing code and pass `mediaType` instead of `type`.
            // Store the file and get the file URL
            String fileUrl = fileStorageService.store(file, mediaType);
            System.out.println("File stored at URL: " + fileUrl);

            // Add media to course
            coursService.addMediaToCourse(courseId, fileUrl, mediaType, educator, title, description);

            return new ResponseEntity<>("File uploaded successfully", HttpStatus.OK);
        } catch (IOException e) {
            // Log specific exception information
            System.err.println("IOException occurred during file upload: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Failed to upload file due to I/O error", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            // Log other exception information
            System.err.println("Exception occurred during file upload: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>("Failed to upload file", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //Get files for Educator
    @GetMapping("/{courseId}/files")
    public ResponseEntity<Map<String, List<Media>>> getFilesByCourseId(@PathVariable String courseId, @RequestParam User educator) {
        Optional<Cours> courseOptional = coursRepository.findById(courseId);

        if (!courseOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Cours course = courseOptional.get();

        // Check if the current user is the course creator
        if (!course.getEducatorId().equals(educator.getId())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        // Retrieve media files and group them by type
        Map<String, List<Media>> groupedMediaFiles = course.getMedia()
                .stream()
                .collect(Collectors.groupingBy(media -> media.getType().name()));

        return new ResponseEntity<>(groupedMediaFiles, HttpStatus.OK);
    }
    //for User
    @GetMapping("/{courseId}/details")
    public ResponseEntity<Map<String, List<Media>>> getFilesForUser(@PathVariable String courseId) {
        Optional<Cours> courseOptional = coursRepository.findById(courseId);

        if (!courseOptional.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Cours course = courseOptional.get();

        // Retrieve media files and group them by type
        Map<String, List<Media>> groupedMediaFiles = course.getMedia()
                .stream()
                .collect(Collectors.groupingBy(media -> media.getType().name()));

        return new ResponseEntity<>(groupedMediaFiles, HttpStatus.OK);
    }


    //payment
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

            double coursePrice = course.getPrice(); // Assume getPrice() exists in your Cours model
            String paymentIntent = paymentService.createPaymentIntent(userId, coursePrice);

            PurchasedCourse purchasedCourse = new PurchasedCourse(courseId, LocalDateTime.now());
            user.getPurchasedCourses().add(purchasedCourse);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("clientSecret", paymentIntent, "message", "Purchase initiated successfully. Complete the payment."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/{courseId}/check-purchase")
    public ResponseEntity<?> checkIfUserHasPurchasedCourse(@PathVariable String courseId, @RequestParam("userId") String userId) {
        try {
            boolean isPurchased = coursService.hasPurchasedCourse(userId, courseId);
            return ResponseEntity.ok(Map.of("isPurchased", isPurchased));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error checking course purchase status: " + e.getMessage());
        }
    }
}
