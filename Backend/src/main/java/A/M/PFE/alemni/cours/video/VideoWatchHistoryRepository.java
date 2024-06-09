package A.M.PFE.alemni.cours.video;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface VideoWatchHistoryRepository extends MongoRepository<VideoWatchHistory, String> {
    Optional<VideoWatchHistory> findByVideoIdAndUserId(String videoId, String userId);
}