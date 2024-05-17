package A.M.PFE.alemni.rating;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Rating {
    private String userId;
    private int value; // Rating value (e.g., 1 to 5)
}
