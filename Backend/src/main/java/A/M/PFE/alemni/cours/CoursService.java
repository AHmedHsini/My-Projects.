package A.M.PFE.alemni.cours;


import A.M.PFE.alemni.cours.Cours;
import A.M.PFE.alemni.cours.CoursRepository;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class CoursService {

    @Autowired
    private CoursRepository coursRepository;

    public Cours addCours(Cours cours){
        return coursRepository.save(cours);
    }

    public List<Cours> allCourses(){
        return coursRepository.findAll();
    }

    public Optional<Cours> singleCours(String DBid){
        return coursRepository.findCoursByDBid(DBid);
    }

    public List<Cours> getCoursCategory(String category){
        return coursRepository.findByCategory(category) ;
    }
    public Cours updateCours(Cours coursRequest){
        Cours existingCours = coursRepository.findById(coursRequest.getId()).get();
        existingCours.setTitle(coursRequest.getTitle());
        existingCours.setDescription(coursRequest.getDescription());
        existingCours.setPrice(coursRequest.getPrice());
        existingCours.setCategory(coursRequest.getCategory());
        return coursRepository.save(existingCours);
    }
    public String deleteCours(String coursId){
        coursRepository.deleteById(coursId);
        return coursId+" task deleted from dashboard ";
    }
}

