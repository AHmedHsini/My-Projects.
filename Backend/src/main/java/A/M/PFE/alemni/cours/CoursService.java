package A.M.PFE.alemni.cours;

import A.M.PFE.alemni.cours.category.Category;
import A.M.PFE.alemni.cours.category.CategoryService;
import A.M.PFE.alemni.cours.video.Video;
import A.M.PFE.alemni.user.UserRepository;
import A.M.PFE.alemni.user.model.User;
import A.M.PFE.alemni.cours.quiz.Quiz;
import A.M.PFE.alemni.cours.quiz.QuizService;
import ch.qos.logback.classic.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class CoursService {

    @Autowired
    private CoursRepository coursRepository;

    @Autowired
    private QuizService quizService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private MongoOperations videoRepository;
    @Autowired
    private CategoryService categoryService;


    // Get all courses
    public List<Cours> allCourses() {
        return coursRepository.findAll();
    }

    public List<Cours> getCoursesByCategoryId(String categoryId) {
        return coursRepository.findByCategories_Id(categoryId);
    }
    // Add a course
    public Map<String, Object> addCours(Cours cours, User educator, MultipartFile file, CourseMediaType type) throws Exception {
        cours.setEducatorId(educator.getId());
        cours.setEducatorName(educator.getFirstName() + " " + educator.getLastName());

        // Set categories
        List<Category> categories = categoryService.getCategoriesByIds(cours.getCategoryIds());
        cours.setCategories(categories);

        // Increment the course count for each category
        categories.forEach(category -> category.incrementNumberOfCourses());
        categoryService.saveAll(categories);

        coursRepository.save(cours);

        Map<String, Object> response = new HashMap<>();
        response.put("id", cours.getId());
        response.put("title", cours.getTitle());
        response.put("description", cours.getDescription());
        response.put("price", cours.getPrice());
        response.put("imageUrl", cours.getCourseImage());
        response.put("educator", cours.getEducatorName());

        return response;
    }

    // Update a course
    public Map<String, Object> updateCours(Cours coursRequest, User educator, MultipartFile file) throws Exception {
        Map<String, Object> response = new HashMap<>();
        Optional<Cours> optionalCours = coursRepository.findById(coursRequest.getId());
        if (optionalCours.isPresent()) {
            Cours existingCours = optionalCours.get();
            if (!educator.isEducator() || !existingCours.getEducatorId().equals(educator.getId())) {
                throw new UnauthorizedException("You are not authorized to modify this course.");
            }
            if (file != null && !file.isEmpty()) {
                String fileUrl = fileStorageService.store(file, CourseMediaType.IMAGE);
                existingCours.setCourseImage(fileUrl);
            }
            existingCours.setTitle(coursRequest.getTitle());
            existingCours.setDescription(coursRequest.getDescription());
            existingCours.setPrice(coursRequest.getPrice());

            // Update categories
            List<Category> oldCategories = existingCours.getCategories();
            oldCategories.forEach(category -> category.decrementNumberOfCourses());
            categoryService.saveAll(oldCategories);

            List<Category> newCategories = categoryService.getCategoriesByIds(coursRequest.getCategoryIds());
            newCategories.forEach(category -> category.incrementNumberOfCourses());
            existingCours.setCategories(newCategories);
            categoryService.saveAll(newCategories);

            Cours updatedCourse = coursRepository.save(existingCours);
            response.put("message", "Course updated successfully!");
            response.put("course", updatedCourse);
            return response;
        } else {
            throw new NotFoundException("Course not found.");
        }
    }

    // Delete a course
    public Map<String, String> deleteCours(String coursId, User educator) {
        Map<String, String> response = new HashMap<>();
        Optional<Cours> optionalCours = coursRepository.findById(coursId);
        if (optionalCours.isPresent()) {
            Cours cours = optionalCours.get();
            if (cours.getEducatorId().equals(educator.getId())) {
                quizService.deleteQuizzesByCourseId(coursId);
                coursRepository.deleteById(coursId);
                response.put("message", "Course and related quizzes deleted successfully.");
                return response;
            } else {
                throw new UnauthorizedException("You are not authorized to delete this course.");
            }
        } else {
            throw new NotFoundException("Course not found.");
        }
    }

    // Add a quiz to a course
    public Map<String, Object> addQuizToCourse(String courseId, String quizId, User educator) {
        Map<String, Object> response = new HashMap<>();
        Optional<Cours> optionalCours = coursRepository.findById(courseId);
        if (optionalCours.isPresent()) {
            Cours cours = optionalCours.get();
            if (cours.getEducatorName().equals(educator.getFirstName() + " " + educator.getLastName())) {
                Optional<Quiz> optionalQuiz = quizService.getQuizById(quizId);
                if (optionalQuiz.isPresent()) {
                    Quiz quiz = optionalQuiz.get();
                    cours.getQuizzes().add(quiz);
                    Cours updatedCourse = coursRepository.save(cours);
                    response.put("message", "Quiz added successfully to course!");
                    response.put("course", updatedCourse);
                    return response;
                } else {
                    throw new NotFoundException("Quiz not found.");
                }
            } else {
                throw new UnauthorizedException("You are not authorized to add a quiz to this course.");
            }
        } else {
            throw new NotFoundException("Course not found.");
        }
    }

    // Get courses by educator ID
    public List<Cours> getCoursesByEducatorId(String educatorId) {
        return coursRepository.findByEducatorId(educatorId);
    }

    public String handleFileUpload(MultipartFile file, CourseMediaType type) throws Exception {
        String fileUrl = fileStorageService.store(file, type);
        return fileUrl;
    }

    // Upload files
    public void addMediaToCourse(String courseId, String fileUrl, CourseMediaType type, User educator, String title, String description) {
        Optional<Cours> courseOptional = coursRepository.findById(courseId);
        if (!courseOptional.isPresent()) {
            throw new NotFoundException("Course not found");
        }
        Cours course = courseOptional.get();
        if (!course.getEducatorId().equals(educator.getId())) {
            throw new UnauthorizedException("You are not authorized to add media to this course.");
        }

        if (type == CourseMediaType.VIDEO) {
            Video video = new Video();
            video.setUrl(fileUrl);
            video.setCourseId(courseId);
            video.setTitle(title);
            video.setDescription(description);
            videoRepository.save(video);
        } else {
            Media media = new Media();
            media.setUrl(fileUrl);
            media.setType(type);
            media.setDescription(description);
            media.setTitle(title);
            course.getMedia().add(media);
            coursRepository.save(course);
        }
    }

    public void deleteMediaFromCourse(String courseId, String fileUrl) {
        Optional<Cours> courseOptional = coursRepository.findById(courseId);
        if (!courseOptional.isPresent()) {
            throw new NotFoundException("Course not found");
        }
        Cours course = courseOptional.get();
        Optional<Media> mediaOptional = course.getMedia().stream().filter(media -> media.getUrl().equals(fileUrl)).findFirst();
        if (!mediaOptional.isPresent()) {
            throw new NotFoundException("File not found in course");
        }
        Media media = mediaOptional.get();
        course.getMedia().remove(media);
        coursRepository.save(course);
    }


    public void incrementVisitCount(String courseId) {
        Optional<Cours> courseOptional = coursRepository.findById(courseId);
        if (courseOptional.isPresent()) {
            Cours course = courseOptional.get();
            course.setVisitCount(course.getVisitCount() + 1);
            coursRepository.save(course);
        } else {
            throw new NotFoundException("Course not found.");
        }
    }

    // Increment the purchase count
    public void incrementPurchaseCount(String courseId) {
        Optional<Cours> courseOptional = coursRepository.findById(courseId);
        if (courseOptional.isPresent()) {
            Cours course = courseOptional.get();
            course.setPurchaseCount(course.getPurchaseCount() + 1);
            coursRepository.save(course);
        } else {
            throw new NotFoundException("Course not found.");
        }
    }


    public Optional<Cours> getCourseById(String courseId) {
        return coursRepository.findById(courseId);
    }
    public List<Cours> getMostBoughtCourses() {
        return coursRepository.findTop5ByOrderByPurchaseCountDesc();
    }
}

