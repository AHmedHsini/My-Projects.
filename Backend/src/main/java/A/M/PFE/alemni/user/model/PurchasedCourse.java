package A.M.PFE.alemni.user.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchasedCourse {
    private String courseId;
    private LocalDateTime purchaseDate;
}