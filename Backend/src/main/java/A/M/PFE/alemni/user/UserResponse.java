package A.M.PFE.alemni.user;

import A.M.PFE.alemni.user.model.User;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserResponse {
    private String id;
    private String email;
    private User.Role role;
    private String firstName;
    private String lastName;
    private String profilePicture; // New profile picture field

    public UserResponse(String id, String email, User.Role role, String firstName, String lastName, String profilePicture) {
        this.id = id;
        this.email = email;
        this.role = role;
        this.firstName = firstName;
        this.lastName = lastName;
        this.profilePicture = profilePicture; // Set the profile picture
    }
}