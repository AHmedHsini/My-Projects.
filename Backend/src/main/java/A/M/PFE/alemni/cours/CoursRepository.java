package A.M.PFE.alemni.cours;



import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CoursRepository extends MongoRepository<Cours, String> {
    List<Cours> findByEducatorId(String educatorId);
    List<Cours> findByCategory(String category);

    Optional<Cours> findById(String courseId);
    List<Cours> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);

}
