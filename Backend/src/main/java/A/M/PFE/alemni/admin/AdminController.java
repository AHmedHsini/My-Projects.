package A.M.PFE.alemni.admin;

import A.M.PFE.alemni.activity.UserActivityService;
import A.M.PFE.alemni.cours.Cours;
import A.M.PFE.alemni.cours.CoursRepository;
import A.M.PFE.alemni.cours.category.Category;
import A.M.PFE.alemni.cours.category.CategoryService;
import A.M.PFE.alemni.user.UserRepository;
import A.M.PFE.alemni.user.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CoursRepository coursRepository;
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private UserActivityService userActivityService;
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = adminService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/students")
    public ResponseEntity<List<User>> getAllStudents() {
        List<User> students = adminService.getAllUsersByRole(User.Role.Student.toString()); // Pass role as string
        if (students.isEmpty()) {
            return ResponseEntity.noContent().build(); // Handle empty list
        }
        return new ResponseEntity<>(students, HttpStatus.OK);
    }

    @GetMapping("/educators")
    public ResponseEntity<List<User>> getAllEducators() {
        List<User> educators = adminService.getAllUsersByRole(User.Role.Educator.toString()); // Pass role as string
        if (educators.isEmpty()) {
            return ResponseEntity.noContent().build(); // Handle empty list
        }
        return new ResponseEntity<>(educators, HttpStatus.OK);
    }

    @GetMapping("userDetails/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable String userId) {
        Optional<User> userOptional = adminService.getUserById(userId);
        return userOptional.map(user -> new ResponseEntity<>(user, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/studentCount")
    public ResponseEntity<Integer> getStudentCount() {
        int studentCount = adminService.getStudentCount();
        return new ResponseEntity<>(studentCount, HttpStatus.OK);
    }

    @GetMapping("/educatorCount")
    public ResponseEntity<Integer> getEducatorCount() {
        int educatorCount = adminService.getEducatorCount();
        return new ResponseEntity<>(educatorCount, HttpStatus.OK);
    }
    @GetMapping("/purchase-history")
    public ResponseEntity<List<Map<String, Object>>> getAllUsersPurchaseHistory() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> purchaseHistories = users.stream().map(user -> {
            Map<String, Object> userPurchaseHistory = new HashMap<>();
            userPurchaseHistory.put("userId", user.getId());
            userPurchaseHistory.put("userName", user.getFirstName() + " " + user.getLastName());
            userPurchaseHistory.put("purchaseHistory", user.getPurchasedCourses().stream().map(purchase -> {
                Map<String, Object> purchaseDetails = new HashMap<>();
                Optional<Cours> courseOptional = coursRepository.findById(purchase.getCourseId());
                if (courseOptional.isPresent()) {
                    Cours course = courseOptional.get();
                    purchaseDetails.put("courseId", course.getId());
                    purchaseDetails.put("courseTitle", course.getTitle());
                    purchaseDetails.put("purchaseDate", purchase.getPurchaseDate());
                }
                return purchaseDetails;
            }).collect(Collectors.toList()));
            return userPurchaseHistory;
        }).collect(Collectors.toList());

        return new ResponseEntity<>(purchaseHistories, HttpStatus.OK);
    }
    @PostMapping("/categories")
    public ResponseEntity<Category> addCategory(@RequestBody Category category) {
        Category newCategory = categoryService.addCategory(category);
        return new ResponseEntity<>(newCategory, HttpStatus.CREATED);
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable String id, @RequestBody Category category) {
        Category updatedCategory = categoryService.updateCategory(id, category);
        return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable String id) {
        categoryService.deleteCategory(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return new ResponseEntity<>(categories, HttpStatus.OK);
    }
    @GetMapping("/categories-with-course-counts")
    public ResponseEntity<List<Map<String, Object>>> getCategoriesWithCourseCounts() {
        List<Category> categories = categoryService.getAllCategories();

        List<Map<String, Object>> response = categories.stream().map(category -> {
            Map<String, Object> categoryData = new HashMap<>();
            categoryData.put("id", category.getId());
            categoryData.put("name", category.getName());
            categoryData.put("description", category.getDescription());
            categoryData.put("numberOfCourses", category.getNumberOfCourses()); // Fetch directly from category

            return categoryData;
        }).collect(Collectors.toList());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @GetMapping("/activity-count/{action}")
    public ResponseEntity<Long> getActivityCount(@PathVariable String action) {
        long count = userActivityService.countByAction(action);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

}
