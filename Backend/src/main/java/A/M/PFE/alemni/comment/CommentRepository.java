package A.M.PFE.alemni.comment;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findAllByCourseId(String courseId);
    List<Comment> findAllByVideoId(String videoId);
}
