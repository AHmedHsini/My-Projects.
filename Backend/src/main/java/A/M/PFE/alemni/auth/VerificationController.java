package A.M.PFE.alemni.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/verification")
public class VerificationController {

    @Autowired
    private VerificationService verificationService;

    @GetMapping
    public ResponseEntity<String> verifyUser(@RequestParam("token") String token) {
        // Use VerificationService to verify the user
        boolean isVerified = verificationService.verifyUser(token);

        // Return a message based on the verification result
        if (isVerified) {
            return ResponseEntity.ok("User verified successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid or expired verification token.");
        }
    }
}
