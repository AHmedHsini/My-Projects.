package A.M.PFE.alemni.user;

import A.M.PFE.alemni.activity.UserActivityService;
import A.M.PFE.alemni.cours.CourseMediaType;
import A.M.PFE.alemni.cours.FileStorageService;
import A.M.PFE.alemni.user.Security.JwtUtils;
import A.M.PFE.alemni.user.login.LoginRequest;
import A.M.PFE.alemni.user.model.CardInfoRequest;
import A.M.PFE.alemni.user.model.User;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.naming.AuthenticationException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class UserController {
    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private final UserService userService;
    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private UserActivityService userActivityService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Map<String, String>> createUser(@RequestBody User user) {
        try {
            userService.registerUser(user);
            String token = jwtUtils.generateToken(user);
            Map<String, String> response = new HashMap<>();
            response.put("message", "User registered successfully. Please verify your email to complete registration.");
            response.put("token", token);

            // Log registration activity
            userActivityService.logActivity(user.getId(), "register");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred. Please try again later."));
        }
    }

    @PostMapping("/login")
    @CrossOrigin(origins = "http://localhost:5173")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) throws AuthenticationException {
        Optional<User> userOptional = Optional.ofNullable(userService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword()));

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (!user.isVerified()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Account not activated. Please verify your email to activate your account.");
            }
            String token = jwtUtils.generateToken(user);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful.");
            response.put("role", user.getRole().toString());
            response.put("token", token);
            response.put("firstName", user.getFirstName());
            response.put("lastName", user.getLastName());
            response.put("id", String.valueOf(user.getId()));
            response.put("profilePicture", user.getProfilePicture());

            // Log visit activity
            userActivityService.logActivity(user.getId(), "visit");

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Invalid email or password!"));
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);

            if (jwtUtils.validateToken(token)) {
                String email = jwtUtils.getEmailFromToken(token);
                Optional<User> userOptional = userRepository.findByEmail(email);

                if (userOptional.isPresent()) {
                    User user = userOptional.get();
                    UserResponse userResponse = new UserResponse(user.getId(), user.getEmail(), user.getRole(), user.getFirstName(), user.getLastName(), user.getProfilePicture());
                    return ResponseEntity.ok()
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(userResponse);
                }
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
    }
    @PostMapping("/user/{id}/updateProfile")
    @CrossOrigin(origins = "http://localhost:5173")
    public ResponseEntity<?> updateProfile(
            @PathVariable String id,
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("email") String email,
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture
    ) {
        try {
            String profilePicturePath = null;
            if (profilePicture != null && !profilePicture.isEmpty()) {
                profilePicturePath = fileStorageService.store(profilePicture, CourseMediaType.IMAGE);
            }

            // Update the user profile
            userService.updateUserProfile(id, firstName, lastName, email, profilePicturePath);

            Optional<User> optionalUser = userRepository.findById(id);
            if (optionalUser.isPresent()) {
                User updatedUser = optionalUser.get();
                UserResponse userResponse = new UserResponse(
                        updatedUser.getId(),
                        updatedUser.getEmail(),
                        updatedUser.getRole(),
                        updatedUser.getFirstName(),
                        updatedUser.getLastName(),
                        updatedUser.getProfilePicture()
                );
                return ResponseEntity.ok().body(userResponse);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update profile");
        }
    }
    @PostMapping("/refresh-token")
    public ResponseEntity<Map<String, String>> refreshToken(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);

            if (jwtUtils.validateToken(token)) {
                String email = jwtUtils.getEmailFromToken(token);
                Optional<User> userOptional = userRepository.findByEmail(email);

                if (userOptional.isPresent()) {
                    User user = userOptional.get();
                    String newToken = jwtUtils.generateToken(user);
                    Map<String, String> response = new HashMap<>();
                    response.put("newToken", newToken);
                    return ResponseEntity.ok(response);
                }
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid or expired token"));
    }
    //card
    @GetMapping("/user/{userId}/has-card-info")
    public ResponseEntity<Boolean> checkUserCardInfo(@PathVariable String userId) {
        boolean hasCardInfo = userService.hasCardInformation(userId);
        return ResponseEntity.ok(hasCardInfo);
    }
    @PostMapping("/user/{userId}/card-info")
    public ResponseEntity<?> addCardInfo(@PathVariable String userId, @RequestBody CardInfoRequest cardInfoRequest) {
        try {
            userService.addCardInfo(userId, cardInfoRequest);
            return ResponseEntity.ok("Card information added successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add card information.");
        }
    }

}