package A.M.PFE.alemni.report;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReportRepository extends MongoRepository<Report, String> {
    List<Report> findByCourseId(String courseId);
    List<Report> findByVideoId(String videoId);
    List<Report> findByCommentId(String commentId);
}
