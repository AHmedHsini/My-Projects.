package A.M.PFE.alemni.admin;

import A.M.PFE.alemni.user.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

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

}
