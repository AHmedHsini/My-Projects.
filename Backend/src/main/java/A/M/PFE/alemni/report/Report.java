package A.M.PFE.alemni.report;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "reports")
public class Report {
    @Id
    private String id;
    private String reporterId; // ID of the user who reported
    private String reporterName;
    private String courseId; // ID of the reported course (optional)
    private String videoId; // ID of the reported video (optional)
    private String commentId; // ID of the reported comment (optional)
    private String reason;
    private LocalDateTime reportDate;

    public Report(String reporterId, String reporterName, String courseId, String videoId, String commentId, String reason) {
        this.reporterId = reporterId;
        this.reporterName = reporterName;
        this.courseId = courseId;
        this.videoId = videoId;
        this.commentId = commentId;
        this.reason = reason;
        this.reportDate = LocalDateTime.now();
    }
}
