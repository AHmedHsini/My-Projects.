    package A.M.PFE.alemni.cours.quiz;

    import lombok.*;

    import org.springframework.data.annotation.CreatedDate;
    import org.springframework.data.annotation.Id;
    import org.springframework.data.annotation.LastModifiedDate;

    import java.time.LocalDateTime;
    import java.util.List;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public class Quiz {
        @Id
        private String id;
        private String title;
        private List<Question> questions;
        private String courseId; // Reference to the associated course's DBid
        @CreatedDate
        private LocalDateTime creationDate;
        @LastModifiedDate
        private LocalDateTime lastModifiedDate;

    }

