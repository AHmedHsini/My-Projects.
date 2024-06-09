package A.M.PFE.alemni.cours.category;

import A.M.PFE.alemni.cours.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public Category addCategory(Category category) {
        return categoryRepository.save(category);
    }
    public Optional<Category> getCategoryById(String id) {
        return categoryRepository.findById(id);
    }
    public Category updateCategory(String id, Category category) {
        Optional<Category> optionalCategory = categoryRepository.findById(id);
        if (optionalCategory.isPresent()) {
            Category existingCategory = optionalCategory.get();
            existingCategory.setName(category.getName());
            existingCategory.setDescription(category.getDescription());
            return categoryRepository.save(existingCategory);
        } else {
            throw new NotFoundException("Category not found");
        }
    }
    public List<Category> getCategoriesByIds(List<String> categoryIds) {
        return categoryRepository.findAllById(categoryIds);
    }

    public void deleteCategory(String id) {
        categoryRepository.deleteById(id);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public boolean categoryExistsByName(String name) {
        return categoryRepository.findByName(name).isPresent();
    }
    public List<Category> saveAll(List<Category> categories) {
        return categoryRepository.saveAll(categories);
    }
}
