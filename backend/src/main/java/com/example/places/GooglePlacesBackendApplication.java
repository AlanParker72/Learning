package com.example.places;

import com.example.places.config.GooglePlacesProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(GooglePlacesProperties.class)
public class GooglePlacesBackendApplication {
    public static void main(String[] args) { SpringApplication.run(GooglePlacesBackendApplication.class, args); }
}
