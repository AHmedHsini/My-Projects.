package A.M.PFE.alemni.cours;


import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileStorageService {
    // Update the rootLocation to the desired directory
    private final Path rootLocation = Paths.get(".\\Frontend\\uploads");

    public String store(MultipartFile file, CourseMediaType type) throws Exception {
        String directory = type.toString().toLowerCase();
        // Create a target location for the specific media type directory
        Path targetLocation = rootLocation.resolve(directory);
        Files.createDirectories(targetLocation);

        // Generate a unique filename
        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path destinationFile = targetLocation.resolve(filename).normalize().toAbsolutePath();

        // Save the file to the destination
        file.transferTo(destinationFile);

        // Return the relative path to the file, which your server can use to serve the file
        return "/uploads/" + directory + "/" + filename;
    }

    //delete
    public void delete(String fileUrl) throws IOException {
        Path filePath = rootLocation.resolve(Paths.get(fileUrl).normalize().getFileName());
        Files.deleteIfExists(filePath);
    }
}

