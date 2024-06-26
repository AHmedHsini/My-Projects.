package A.M.PFE.alemni.user;

import A.M.PFE.alemni.user.model.User;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, ObjectId> {
    Optional<User> findByVerificationToken(String verificationToken);

    Optional<User> findByEmail(String email);

    Optional<User> findById(String id);

    Optional<User> findByResetToken(String token);
}
