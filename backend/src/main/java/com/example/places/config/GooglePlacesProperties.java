package com.example.places.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "google.places")
public record GooglePlacesProperties(
        String apiKey,
        @NotBlank String autocompleteUrl,
        @NotBlank String detailsUrl,
        @NotBlank String country,
        @NotBlank String language,
        @Positive int requestTimeoutMs
) {}
