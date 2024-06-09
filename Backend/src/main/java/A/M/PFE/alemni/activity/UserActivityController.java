package A.M.PFE.alemni.activity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/activity")
public class UserActivityController {

    @Autowired
    private UserActivityService userActivityService;

    @GetMapping("/count/visits")
    public ResponseEntity<Long> getVisitCount() {
        long count = userActivityService.countByAction("visit_user_page");
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/count/registrations")
    public ResponseEntity<Long> getRegistrationCount() {
        long count = userActivityService.countByAction("register");
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/log/visit")
    public ResponseEntity<Void> logVisit() {
        System.out.println("logVisit endpoint called");
        userActivityService.logActivity(null, "visit_user_page");
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
