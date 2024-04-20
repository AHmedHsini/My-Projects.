package A.M.PFE.alemni.comment;

import A.M.PFE.alemni.cours.Cours;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private MongoTemplate mongoTemplate;
    public Comment createComment(String commentBody, String DBid){
        Comment comment = commentRepository.insert(new Comment(commentBody));

        mongoTemplate.update(Cours.class)
                .matching(Criteria.where("DBid").is(DBid))
                .apply(new Update().push("commentIds").value(comment))
                .first();

        return comment;



    }
}
