package A.M.PFE.alemni.webconf;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Define a handler to serve files from the "/uploads" path
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:///D:/PFE-main/Frontend/uploads/");
    }

    @Override
    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
        // Set default content type as JSON
        configurer.defaultContentType(MediaType.APPLICATION_JSON);
        // Allow clients to request multiple media types
        configurer.favorParameter(true);
    }
}
