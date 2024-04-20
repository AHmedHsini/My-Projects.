package A.M.PFE.alemni.user;

import A.M.PFE.alemni.auth.VerificationService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationService verificationService;

    public void registerUser(User user) throws MessagingException {
        // Set the user as unverified
        user.setVerified(false);

        // Generate a verification token
        user.generateVerificationToken();

        // Save the unverified user
        User savedUser = userRepository.save(user);

        // Send verification email
        verificationService.sendVerificationEmail(savedUser.getEmail(), savedUser.getVerificationToken());
    }


    public boolean verifyUser(String token) {
        // Find the user by verification token
        Optional<User> optionalUser = userRepository.findByVerificationToken(token);

        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (!user.isVerified()) {
                // Verify the user
                user.setVerified(true);
                userRepository.save(user);
                return true; // Verification successful
            }
        }
        return false; // Verification failed
    }
}
