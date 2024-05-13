package A.M.PFE.alemni.admin;

import A.M.PFE.alemni.user.UserRepository;
import A.M.PFE.alemni.user.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll(); // Modify to get all users
    }

    public List<User> getAllUsersByRole(String role) {
        List<User> allUsers = getAllUsers();

        // Filter users by role using Java Streams
        List<User> usersByRole = allUsers.stream()
                .filter(user -> user.getRole().toString().equalsIgnoreCase(role)) // Use toString() to get the role as string
                .collect(Collectors.toList());

        return usersByRole;
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id); // Get user by ID
    }

    public int getStudentCount() {
        List<User> allUsers = getAllUsers();

        // Count students using Java Streams and filter
        int studentCount = (int) allUsers.stream()
                .filter(user -> user.getRole().toString().equalsIgnoreCase(User.Role.Student.toString()))
                .count();

        return studentCount;
    }

    public int getEducatorCount() {
        List<User> allUsers = getAllUsers();

        // Count educators using Java Streams and filter
        int educatorCount = (int) allUsers.stream()
                .filter(user -> user.getRole().toString().equalsIgnoreCase(User.Role.Educator.toString()))
                .count();

        return educatorCount;
    }

}

