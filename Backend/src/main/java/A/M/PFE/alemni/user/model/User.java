package A.M.PFE.alemni.user.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "AUser")
public class User {
    public enum Role {Student, Educator, Admin}

    @Id
    private String id;
    private String firstName;
    private String lastName;
    @Indexed(unique = true)
    private String email;
    private String password;
    private Role role;
    private boolean verified = false;
    private LocalDateTime tokenExpirationDate;
    private String verificationToken;
    private String profilePicture; // New profile picture field
    private String resetToken;
    private LocalDateTime resetTokenExpiration;
    //card
    private String cardNumber;
    private String expiryDate;
    private String cvv;

    private List<PurchasedCourse> purchasedCourses = new ArrayList<>();

    // Generate verification token
    public void generateVerificationToken() {
        this.verificationToken = UUID.randomUUID().toString();
    }

    public void generateResetToken() {
        this.resetToken = UUID.randomUUID().toString();
        this.resetTokenExpiration = LocalDateTime.now().plusHours(24); // Token expiration after 24 hours
    }

    // Check if user has Educator role
    public boolean isEducator() {
        return this.role == Role.Educator;
    }

    // Return user authorities
    public List<SimpleGrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + this.role.name()));
    }
}
