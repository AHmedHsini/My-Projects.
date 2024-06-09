// Category class
package A.M.PFE.alemni.cours.category;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Document(collection = "categories")
public class Category {
    @Id
    private String id;
    private String name;
    private String description;
    private int numberOfCourses = 0;

    public Category(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public void incrementNumberOfCourses() {
        this.numberOfCourses++;
    }

    public void decrementNumberOfCourses() {this.numberOfCourses--;
    }
}