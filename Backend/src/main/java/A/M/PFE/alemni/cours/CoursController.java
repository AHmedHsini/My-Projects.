package A.M.PFE.alemni.cours;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/Courses")
public class CoursController {

    @Autowired
    private CoursService coursService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Cours createCours(@RequestBody Cours cours) {
        return coursService.addCours(cours);
    }

    @GetMapping
    public ResponseEntity<List<Cours>> getAllCourses() {
        return new ResponseEntity<List<Cours>>(coursService.allCourses(), HttpStatus.OK);
    }

    @GetMapping("{DBid}")
    public ResponseEntity<Optional<Cours>> getSingleCours(@PathVariable String DBid) {
        return new ResponseEntity<Optional<Cours>>(coursService.singleCours(DBid), HttpStatus.OK);
    }

    @GetMapping("/Category/{category}")
    public List<Cours> findCoursUsingCategory(@PathVariable String category) {
        return coursService.getCoursCategory(category);
    }

    @PutMapping
    public Cours modifyCours(@RequestBody Cours cours) {
        return coursService.updateCours(cours);
    }
    @DeleteMapping("/{coursId}")
    public String deleteCours(@PathVariable String coursId) {
        return coursService.deleteCours(coursId);
    }
}