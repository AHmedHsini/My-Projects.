package A.M.PFE.alemni.cours;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Media {
    private String id;
    private String title;
    private String url;
    private CourseMediaType type; // Could be VIDEO, PDF, IMAGE, etc.
    private String description;

}

