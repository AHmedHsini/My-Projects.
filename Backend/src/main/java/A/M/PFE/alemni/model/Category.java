// Category class
package A.M.PFE.alemni.model;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Category {
    public enum Categories {
        DEVELOPMENT, BUSINESS, IT_AND_SOFTWARE, OFFICE_PRODUCTIVITY, PERSONAL_DEVELOPMENT,
        DESIGN, MARKETING, LIFESTYLE, PHOTOGRAPHY_AND_VIDEO, HEALTH_AND_FITNESS,
        TEACHING_AND_ACADEMICS
    }

    private Categories name;
    private String description;
    private int numberOfCourses = 0;

    // Constructor accepting name argument
    public Category(Categories name) {
        this.name = name;
    }

    public void calculateNumberOfCourses() {
        this.numberOfCourses = numberOfCourses + 1;
    }
}
