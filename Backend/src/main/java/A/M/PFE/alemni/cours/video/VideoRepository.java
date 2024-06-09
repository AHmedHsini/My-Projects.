package A.M.PFE.alemni.cours.video;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoRepository extends MongoRepository<Video, String> {
    List<Video> findByCourseId(String courseId);

    List<Video> findVideosByCourseId(String courseId);
}