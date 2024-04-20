package A.M.PFE.alemni.cours;

import A.M.PFE.alemni.cours.Cours;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CoursRepository extends MongoRepository<Cours, ObjectId> {
    Optional<Cours> findCoursByDBid(String DBid);

    List<Cours> findByCategory(String category);

    void deleteById(String coursId );
}
