package A.M.PFE.alemni.cours;

import A.M.PFE.alemni.user.UserRepository;
import A.M.PFE.alemni.user.model.User;
import A.M.PFE.alemni.cours.quiz.Quiz;
import A.M.PFE.alemni.cours.quiz.QuizService;

import org.springframework.beans.factory.annotation.Autowired;
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

    // Get all courses
    public List<Cours> allCourses() {
        // Fetch all courses from the repository and return them
        return coursRepository.findAll();
    }

    // Add a course
    public Map<String, Object> addCours(Cours cours, User educator, MultipartFile file, CourseMediaType type) throws Exception {
        // Set educator information
        cours.setEducatorId(educator.getId());
        cours.setEducatorName(educator.getFirstName() + " " + educator.getLastName());

        // Save the course to the database
        coursRepository.save(cours);

        // Return response map
        Map<String, Object> response = new HashMap<>();
        response.put("id", cours.getId());
        response.put("title", cours.getTitle());
        response.put("description", cours.getDescription());
        response.put("price", cours.getPrice());
        response.put("imageUrl", cours.getCourseImage());
        response.put("educator", cours.getEducatorName());
        // Add other course properties to the response map as needed

        return response;
    }


    // Update a course
    public Map<String, Object> updateCours(Cours coursRequest, User educator, MultipartFile file) throws Exception {
        Map<String, Object> response = new HashMap<>();

        // Find the course by its ID in the repository
        Optional<Cours> optionalCours = coursRepository.findById(coursRequest.getId());
        if (optionalCours.isPresent()) {
            Cours existingCours = optionalCours.get();

            // Check if the educator is authorized to update the course
            if (!educator.isEducator() || !existingCours.getEducatorId().equals(educator.getId())) {
                throw new UnauthorizedException("You are not authorized to modify this course.");
            }

            // Handle file upload if a new file is provided
            if (file != null && !file.isEmpty()) {
                // Use FileStorageService to store the file
                String fileUrl = fileStorageService.store(file, CourseMediaType.IMAGE);
                // Set the new image URL on the course
                existingCours.setCourseImage(fileUrl);
            }

            // Update the course's properties
            existingCours.setTitle(coursRequest.getTitle());
            existingCours.setDescription(coursRequest.getDescription());
            existingCours.setPrice(coursRequest.getPrice());
            existingCours.setCategory(coursRequest.getCategory());
            // Set other properties from coursRequest as needed

            // Save the updated course
            Cours updatedCourse = coursRepository.save(existingCours);

            // Create response map
            response.put("message", "Course updated successfully!");
            response.put("course", updatedCourse);

            return response;
        } else {
            // Throw not found exception if the course is not found
            throw new NotFoundException("Course not found.");
        }
    }

    // Delete a course
    public Map<String, String> deleteCours(String coursId, User educator) {
        Map<String, String> response = new HashMap<>();

        Optional<Cours> optionalCours = coursRepository.findById(coursId);
        if (optionalCours.isPresent()) {
            Cours cours = optionalCours.get();

            // Check if the current user is the course creator
            if (cours.getEducatorId().equals(educator.getId())) {
                // Delete related quizzes first
                quizService.deleteQuizzesByCourseId(coursId);

                // Now delete the course
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

        // Find the course by its ID in the repository
        Optional<Cours> optionalCours = coursRepository.findById(courseId);
        if (optionalCours.isPresent()) {
            Cours cours = optionalCours.get();

            // Check if the current user is the course creator
            if (cours.getEducatorName().equals(educator.getFirstName() + " " + educator.getLastName())) {
                // Find the quiz by its ID
                Optional<Quiz> optionalQuiz = quizService.getQuizById(quizId);

                if (optionalQuiz.isPresent()) {
                    Quiz quiz = optionalQuiz.get();

                    // Add the quiz to the course
                    cours.getQuizzes().add(quiz);

                    // Save the course with the added quiz
                    Cours updatedCourse = coursRepository.save(cours);

                    // Add success message and updated course to response map
                    response.put("message", "Quiz added successfully to course!");
                    response.put("course", updatedCourse);

                    return response;
                } else {
                    // Throw not found exception if the quiz is not found
                    throw new NotFoundException("Quiz not found.");
                }
            } else {
                // Throw unauthorized exception if the user is not the course creator
                throw new UnauthorizedException("You are not authorized to add a quiz to this course.");
            }
        } else {
            // Throw not found exception if the course is not found
            throw new NotFoundException("Course not found.");
        }
    }

    // Get courses by educator ID
    public List<Cours> getCoursesByEducatorId(String educatorId) {
        return coursRepository.findByEducatorId(educatorId);
    }
    public String handleFileUpload(MultipartFile file, CourseMediaType type) throws Exception {
        // Use the FileStorageService to store the file with the specified type and return its URL
        String fileUrl = fileStorageService.store(file, type);
        return fileUrl;
    }
    //upload files
    public void addMediaToCourse(String courseId, String fileUrl, CourseMediaType type, User educator, String title, String description) {
        Optional<Cours> courseOptional = coursRepository.findById(courseId);

        if (!courseOptional.isPresent()) {
            throw new NotFoundException("Course not found");
        }

        Cours course = courseOptional.get();

        // Check if the current user is the course creator
        if (!course.getEducatorId().equals(educator.getId())) {
            throw new UnauthorizedException("You are not authorized to add media to this course.");
        }

        // Create a new Media object
        Media media = new Media();
        media.setUrl(fileUrl);
        media.setType(type);
        media.setDescription(description);
        media.setTitle(title);

        // Add the media object to the course
        course.getMedia().add(media);

        // Save the updated course
        coursRepository.save(course);
    }
    public boolean hasPurchasedCourse(String userId, String courseId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return user.getPurchasedCourses().stream()
                .anyMatch(purchasedCourse -> purchasedCourse.getCourseId().equals(courseId));
    }

}
