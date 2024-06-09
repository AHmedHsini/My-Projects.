package A.M.PFE.alemni.user;

import A.M.PFE.alemni.cours.NotFoundException;
import A.M.PFE.alemni.user.Security.JwtUtils;
import A.M.PFE.alemni.user.model.CardInfoRequest;
import A.M.PFE.alemni.user.model.User;
import A.M.PFE.alemni.user.register.VerificationService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.naming.AuthenticationException;
import java.nio.file.AccessDeniedException;
import java.util.*;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final VerificationService verificationService;
    private final JwtUtils jwtUtils;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    public UserService(UserRepository userRepository, VerificationService verificationService, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.verificationService = verificationService;
        this.jwtUtils = jwtUtils;
    }
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user= null;
        try {
            user = userRepository.findByEmail(email).orElseThrow(() -> new AccessDeniedException("Access to this resource is denied"));
            var role = user.getRole();
            return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), List.of((GrantedAuthority) role::toString)) ;
        } catch (AccessDeniedException e) {
            throw new RuntimeException(e);
        }
    }

    //register
    public void registerUser(User user) throws MessagingException {
        // Check if user with the given email already exists
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            // User with the given email already exists
            throw new MessagingException("User with this email already exists");
        }

        // Encode the user's password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setVerified(false);
        user.generateVerificationToken();

        // Save the new user
        User savedUser = userRepository.save(user);

        // Send verification email
        verificationService.sendVerificationEmail(savedUser.getEmail(), savedUser.getVerificationToken());
    }

    //login
    public User authenticateUser(String email, String password) throws AuthenticationException {
        // Check if user with the given email exists
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            // User with the given email does not exist
            throw new AuthenticationException("User with this email does not exist");
        }

        // Retrieve the user from the optional
        User user = userOptional.get();

        // Check if the provided password matches the user's stored password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            // Passwords do not match
            throw new AuthenticationException("Invalid password");
        }

        // User is authenticated
        return user;
    }


    public void updateUserProfile(String id, String firstName, String lastName, String email, String profilePicturePath) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setEmail(email);
            if (profilePicturePath != null) {
                user.setProfilePicture(profilePicturePath);
            }
            userRepository.save(user);
        } else {
            throw new NotFoundException("User not found with id: " + id);
        }
    }

    //card
    public boolean hasCardInformation(String userId) {
        return userRepository.findById(userId).map(User::getCardNumber).isPresent();
    }
    public void addCardInfo(String userId, CardInfoRequest cardInfoRequest) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            // Populate the user's card information
            user.setCardNumber(cardInfoRequest.getCardNumber());
            user.setExpiryDate(cardInfoRequest.getExpiryDate());
            user.setCvv(cardInfoRequest.getCvv());
            userRepository.save(user);
        } else {
            throw new NotFoundException("User not found with id: " + userId);
        }
    }

}
