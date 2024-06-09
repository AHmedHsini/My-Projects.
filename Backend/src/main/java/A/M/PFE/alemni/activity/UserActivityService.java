package A.M.PFE.alemni.activity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserActivityService {

    @Autowired
    private UserActivityRepository userActivityRepository;

    public UserActivity logActivity(String userId, String action) {
        UserActivity userActivity = new UserActivity(userId, action);
        return userActivityRepository.save(userActivity);
    }

    public long countByAction(String action) {
        return userActivityRepository.countByAction(action);
    }

    public List<UserActivity> getActivitiesByAction(String action) {
        return userActivityRepository.findByAction(action);
    }
}
