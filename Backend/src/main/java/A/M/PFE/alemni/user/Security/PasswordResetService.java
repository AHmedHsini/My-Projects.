package A.M.PFE.alemni.user.Security;

import A.M.PFE.alemni.email.EmailService;
import A.M.PFE.alemni.user.UserRepository;
import A.M.PFE.alemni.user.model.User;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class PasswordResetService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public void requestPasswordReset(String email) throws MessagingException {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.generateResetToken();
            userRepository.save(user);
            sendPasswordResetEmail(user.getEmail(), user.getResetToken());
        }
    }

    private void sendPasswordResetEmail(String userEmail, String resetToken) throws MessagingException {
        String resetUrl = "http://localhost:5173/reset-password/" + resetToken; // Frontend reset page URL
        emailService.sendEmail(userEmail, "Password Reset", "Please click the following link to reset your password: " + resetUrl);
    }

    public boolean verifyResetToken(String token) {
        Optional<User> optionalUser = userRepository.findByResetToken(token);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            LocalDateTime expiration = user.getResetTokenExpiration();
            if (expiration.isAfter(LocalDateTime.now())) {
                // Token is valid
                return true;
            }
        }
        return false;
    }

    public void resetPassword(String token, String newPassword) {
        Optional<User> optionalUser = userRepository.findByResetToken(token);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setPassword(passwordEncoder.encode(newPassword)); // Encode the new password
            user.setResetToken(null);
            user.setResetTokenExpiration(null);
            userRepository.save(user);
        }
    }
}
