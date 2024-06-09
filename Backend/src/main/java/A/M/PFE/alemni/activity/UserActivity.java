package A.M.PFE.alemni.activity;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "user_activities")
public class UserActivity {
    @Id
    private String id;
    private String userId;
    private String action;
    private LocalDateTime timestamp;

    public UserActivity(String userId, String action) {
        this.userId = userId;
        this.action = action;
        this.timestamp = LocalDateTime.now();
    }
}
