package A.M.PFE.alemni.report;

import lombok.Data;

@Data
public class ReportRequest {
    private String reporterId;
    private String reporterName;
    private String courseId; // Optional
    private String videoId; // Optional
    private String commentId; // Optional
    private String reason;
}
