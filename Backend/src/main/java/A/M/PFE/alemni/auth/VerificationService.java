package A.M.PFE.alemni.auth;

import A.M.PFE.alemni.email.EmailService;
import A.M.PFE.alemni.user.User;
import A.M.PFE.alemni.user.UserRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class VerificationService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    public void sendVerificationEmail(String userEmail, String verificationToken) throws MessagingException {
        String verificationUrl = "http://localhost:8080/api/verification?token=" + verificationToken;
        emailService.sendEmail(userEmail, "Email Verification", "Please click the following link to verify your email: " + verificationUrl);
    }

    public void sendVerificationEmail(User user) {
        String verificationToken = generateVerificationToken();
        user.setVerificationToken(verificationToken);

        String recipientAddress = user.getEmail();
        String subject = "Email Verification";
        String confirmationUrl = "/verify?token=" + verificationToken;
        String message = "Please click the link below to verify your email:\n" + confirmationUrl;
        emailService.sendEmail(recipientAddress, subject, message);
    }

    private String generateVerificationToken() {
        return UUID.randomUUID().toString();
    }

    public boolean verifyUser(String token) {
        Optional<User> optionalUser = userRepository.findByVerificationToken(token);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setVerified(true); // Mark user as verified
            userRepository.save(user);
            return true;
        }
        return false;
    }
}
