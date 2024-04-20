package A.M.PFE.alemni.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "AUser")
public class User {
    public enum Role {Student, Educator, Admin}

    @Id
    private ObjectId id;
    private String username;
    private String password;
    private String email;
    private Role role;

    // Initialize verified to false for new users
    private boolean verified = false;

    // Optional: Token expiration date
    private LocalDateTime tokenExpirationDate;
    private String verificationToken;

    // Method to generate a new token
    public void generateVerificationToken() {
        this.verificationToken = UUID.randomUUID().toString();
    }

    // Getter for the token
    public String getVerificationToken() {
        return verificationToken;
    }
}