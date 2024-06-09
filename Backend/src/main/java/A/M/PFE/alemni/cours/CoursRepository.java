package A.M.PFE.alemni.cours;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CoursRepository extends MongoRepository<Cours, String> {
    List<Cours> findByEducatorId(String educatorId);
    Optional<Cours> findById(String courseId);
    List<Cours> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);
    List<Cours> findByCategories_Id(String categoryId); // Updated to query by category ID
    List<Cours> findTop5ByOrderByPurchaseCountDesc();
}

