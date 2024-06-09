package A.M.PFE.alemni.report;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @PostMapping
    public ResponseEntity<Report> createReport(@RequestBody ReportRequest reportRequest) {
        Report report = reportService.createReport(reportRequest.getReporterId(), reportRequest.getReporterName(), reportRequest.getCourseId(), reportRequest.getVideoId(), reportRequest.getCommentId(), reportRequest.getReason());
        return new ResponseEntity<>(report, HttpStatus.CREATED);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Report>> getReportsByCourseId(@PathVariable String courseId) {
        List<Report> reports = reportService.getReportsByCourseId(courseId);
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }

    @GetMapping("/video/{videoId}")
    public ResponseEntity<List<Report>> getReportsByVideoId(@PathVariable String videoId) {
        List<Report> reports = reportService.getReportsByVideoId(videoId);
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }

    @GetMapping("/comment/{commentId}")
    public ResponseEntity<List<Report>> getReportsByCommentId(@PathVariable String commentId) {
        List<Report> reports = reportService.getReportsByCommentId(commentId);
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }

    @GetMapping("/course")
    public ResponseEntity<List<Report>> getAllCourseReports() {
        List<Report> reports = reportService.getAllCourseReports();
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }

    @GetMapping("/video")
    public ResponseEntity<List<Report>> getAllVideoReports() {
        List<Report> reports = reportService.getAllVideoReports();
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }

    @GetMapping("/comment")
    public ResponseEntity<List<Report>> getAllCommentReports() {
        List<Report> reports = reportService.getAllCommentReports();
        return new ResponseEntity<>(reports, HttpStatus.OK);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getTotalReportCount() {
        long count = reportService.getTotalReportCount();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }
}
