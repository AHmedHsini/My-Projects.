package A.M.PFE.alemni.auth;

import java.util.UUID;

public class VerificationTokenGenerator {
    public static String generateToken() {
        return UUID.randomUUID().toString();
    }
}
