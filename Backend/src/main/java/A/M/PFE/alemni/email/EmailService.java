package A.M.PFE.alemni.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    private String baseUrl = "http://localhost:8080/";

    // Method to send a simple email
    public void sendEmail(String recipientAddress, String subject, String message) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(recipientAddress);
        mailMessage.setSubject(subject);
        mailMessage.setText(message);
        // Set default "From" address
        mailMessage.setFrom("your_default_email@example.com");
        javaMailSender.send(mailMessage);
    }

    // Method to send a verification email
    public void sendVerificationEmail(String userEmail, String verificationToken) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
        // Set the "From" address
        helper.setFrom("your_default_email@example.com");
        // Set recipient, subject, and email content
        helper.setTo(userEmail);
        helper.setSubject("Email Verification");
        String verificationUrl = baseUrl + "api/verification?token=" + verificationToken;
        String emailContent = "Please click on the following link to verify your email: " + verificationUrl;
        helper.setText(emailContent, true);
        javaMailSender.send(mimeMessage);
    }
}
