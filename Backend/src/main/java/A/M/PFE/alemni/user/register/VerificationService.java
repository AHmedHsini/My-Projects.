package A.M.PFE.alemni.user.register;

import A.M.PFE.alemni.email.EmailService;
import A.M.PFE.alemni.user.model.User;
import A.M.PFE.alemni.user.UserRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class VerificationService {

    private final EmailService emailService;
    private final UserRepository userRepository;

    @Autowired
    public VerificationService(EmailService emailService, UserRepository userRepository) {
        this.emailService = emailService;
        this.userRepository = userRepository;
    }

    public void sendVerificationEmail(String userEmail, String verificationToken) throws MessagingException {
        String verificationUrl = "http://localhost:5173/email-verification/" + verificationToken;
        emailService.sendEmail(userEmail, "Email Verification", "Please click the following link to verify your email: " + verificationUrl);
    }

    public boolean verifyUser(String token) {
        Optional<User> optionalUser = userRepository.findByVerificationToken(token);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setVerified(true);
            userRepository.save(user);
            return true;
        }
        return false;
    }
}
