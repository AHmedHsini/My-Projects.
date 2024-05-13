package A.M.PFE.alemni.cours;

public class NotFoundException extends RuntimeException {

    // Default constructor with a generic message
    public NotFoundException() {
        super("Resource not found.");
    }

    // Constructor with a custom message
    public NotFoundException(String message) {
        super(message);
    }

    // Constructor with a custom message and cause
    public NotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
