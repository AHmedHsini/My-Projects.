package A.M.PFE.alemni.comment;

import A.M.PFE.alemni.cours.Cours;
import A.M.PFE.alemni.cours.CoursRepository;
import A.M.PFE.alemni.cours.video.Video;
import A.M.PFE.alemni.cours.video.VideoRepository;
import A.M.PFE.alemni.user.UserRepository;
import A.M.PFE.alemni.user.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private CoursRepository coursRepository;

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private UserRepository userRepository;

    public Comment createComment(String commentBody, String commenterId, String courseId) {
        // Validate commenterId
        User commenter = userRepository.findById(commenterId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Validate courseId
        Cours course = coursRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));

        // Create the comment
        Comment comment = new Comment(commentBody, commenterId, commenter.getFirstName(), commenter.getLastName(), courseId, null);
        comment = commentRepository.insert(comment);

        // Add the comment ID to the course's list of commentIds
        course.getCommentIds().add(comment);

        // Save the course with the updated list of commentIds
        coursRepository.save(course);

        return comment;
    }

    public Comment createCommentForVideo(String commentBody, String commenterId, String videoId) {
        // Validate commenterId
        User commenter = userRepository.findById(commenterId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Validate videoId
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new IllegalArgumentException("Video not found"));

        // Create the comment
        Comment comment = new Comment(commentBody, commenterId, commenter.getFirstName(), commenter.getLastName(), null, videoId);
        comment = commentRepository.insert(comment);

        // Add the comment ID to the video's list of commentIds
        if (video.getCommentIds() == null) {
            video.setCommentIds(new ArrayList<>());
        }
        video.getCommentIds().add(comment);

        // Save the video with the updated list of commentIds
        videoRepository.save(video);

        return comment;
    }

    public List<Comment> getCommentsByCourseId(String courseId) {
        // Retrieve comments associated with a specific course
        return commentRepository.findAllByCourseId(courseId);
    }

    public List<Comment> getCommentsByVideoId(String videoId) {
        // Retrieve comments associated with a specific video
        return commentRepository.findAllByVideoId(videoId);
    }
}
