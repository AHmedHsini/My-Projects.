package A.M.PFE.alemni.user;

import A.M.PFE.alemni.user.User;
import A.M.PFE.alemni.user.UserService;
import jakarta.mail.MessagingException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/User")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<String> createUser(@RequestBody User user) {
        try {
            // Register the user and send verification email
            userService.registerUser(user);

            // Return a message indicating the user needs to verify their email
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("User registered successfully. Please verify your email to complete registration.");
        } catch (MessagingException e) {
            // Handle exception during registration or email sending
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error occurred during registration. Please try again later.");
        } catch (Exception e) {
            // Handle other exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred. Please try again later.");
        }
    }

}
