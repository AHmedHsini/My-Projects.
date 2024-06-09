package A.M.PFE.alemni.cours.category;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class CategoryInitializer implements CommandLineRunner {

    @Autowired
    private CategoryService categoryService;

    @Override
    public void run(String... args) throws Exception {
        List<Category> categories = Arrays.asList(
                new Category("DEVELOPMENT", "Courses related to software development"),
                new Category("BUSINESS", "Courses related to business skills and knowledge"),
                new Category("IT_AND_SOFTWARE", "Courses related to IT and software"),
                new Category("OFFICE_PRODUCTIVITY", "Courses related to office productivity"),
                new Category("PERSONAL_DEVELOPMENT", "Courses related to personal development"),
                new Category("DESIGN", "Courses related to design"),
                new Category("MARKETING", "Courses related to marketing"),
                new Category("LIFESTYLE", "Courses related to lifestyle"),
                new Category("PHOTOGRAPHY_AND_VIDEO", "Courses related to photography and video"),
                new Category("HEALTH_AND_FITNESS", "Courses related to health and fitness"),
                new Category("TEACHING_AND_ACADEMICS", "Courses related to teaching and academics")
        );

        for (Category category : categories) {
            if (!categoryService.categoryExistsByName(category.getName())) {
                categoryService.addCategory(category);
            }
        }
    }
}