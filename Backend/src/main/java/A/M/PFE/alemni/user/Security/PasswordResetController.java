package A.M.PFE.alemni.user.Security;

import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/password-reset")
public class PasswordResetController {
    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/request")
    public ResponseEntity<?> requestPasswordReset(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        try {
            passwordResetService.requestPasswordReset(email);
            return ResponseEntity.ok("Password reset email sent successfully.");
        } catch (MessagingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send password reset email.");
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyResetToken(@RequestParam("token") String token) {
        if (passwordResetService.verifyResetToken(token)) {
            return ResponseEntity.ok("Reset token is valid.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired reset token.");
        }
    }

    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@RequestParam("token") String token, @RequestBody Map<String, String> requestBody) {
        String newPassword = requestBody.get("password");
        if (newPassword != null) {
            if (passwordResetService.isSamePassword(token, newPassword)) {
                return ResponseEntity.badRequest().body("This password is already in use.");
            }
            passwordResetService.resetPassword(token, newPassword);
            return ResponseEntity.ok("Password reset successfully.");
        } else {
            return ResponseEntity.badRequest().body("New password is missing in the request body.");
        }
    }
}
