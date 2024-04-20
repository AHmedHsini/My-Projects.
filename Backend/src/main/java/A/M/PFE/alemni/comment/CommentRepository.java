package A.M.PFE.alemni.comment;

import A.M.PFE.alemni.comment.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends MongoRepository<Comment, Object> {
}
