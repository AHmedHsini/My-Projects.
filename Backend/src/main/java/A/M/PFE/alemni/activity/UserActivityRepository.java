package A.M.PFE.alemni.activity;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface UserActivityRepository extends MongoRepository<UserActivity, String> {
    List<UserActivity> findByAction(String action);
    long countByAction(String action);
}
