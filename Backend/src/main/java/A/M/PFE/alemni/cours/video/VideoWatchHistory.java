package A.M.PFE.alemni.cours.video;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "video_watch_history")
public class VideoWatchHistory {
    @Id
    private String id;
    private String videoId;
    private String userId;
    private long timestamp; // in seconds
    private long duration; // in seconds
}