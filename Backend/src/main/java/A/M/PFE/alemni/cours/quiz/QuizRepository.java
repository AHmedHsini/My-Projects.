package A.M.PFE.alemni.cours.quiz;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends MongoRepository<Quiz, String> {
    List<Quiz> findAllByCourseId(String courseId);
    // You can add custom query methods if needed
}