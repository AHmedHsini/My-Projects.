package A.M.PFE.alemni.report;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    public Report createReport(String reporterId, String reporterName, String courseId, String videoId, String commentId, String reason) {
        Report report = new Report(reporterId, reporterName, courseId, videoId, commentId, reason);
        return reportRepository.save(report);
    }

    public List<Report> getReportsByCourseId(String courseId) {
        return reportRepository.findByCourseId(courseId);
    }

    public List<Report> getReportsByVideoId(String videoId) {
        return reportRepository.findByVideoId(videoId);
    }

    public List<Report> getReportsByCommentId(String commentId) {
        return reportRepository.findByCommentId(commentId);
    }

    public List<Report> getAllCourseReports() {
        return reportRepository.findAll().stream().filter(report -> report.getCourseId() != null).collect(Collectors.toList());
    }

    public List<Report> getAllVideoReports() {
        return reportRepository.findAll().stream().filter(report -> report.getVideoId() != null).collect(Collectors.toList());
    }

    public List<Report> getAllCommentReports() {
        return reportRepository.findAll().stream().filter(report -> report.getCommentId() != null).collect(Collectors.toList());
    }

    public long getTotalReportCount() {
        return reportRepository.count();
    }
}
