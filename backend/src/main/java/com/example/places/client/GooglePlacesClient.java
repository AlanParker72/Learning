package com.example.places.client;

import com.example.places.config.GooglePlacesProperties;
import com.example.places.dto.google.GoogleAutocompleteResponse;
import com.example.places.dto.google.GooglePlaceDetailsResponse;
import com.example.places.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.time.Duration;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class GooglePlacesClient {
    private final WebClient googlePlacesWebClient;
    private final GooglePlacesProperties properties;

    public GoogleAutocompleteResponse autocomplete(String input, String sessionToken) {
        assertApiKeyConfigured();
        return googlePlacesWebClient.get()
                .uri(properties.autocompleteUrl(), b -> b
                        .queryParam("input", input)
                        .queryParam("key", properties.apiKey())
                        .queryParam("language", properties.language())
                        .queryParam("components", "country:" + properties.country())
                        .queryParam("types", "address")
                        .queryParamIfPresent("sessiontoken", Optional.ofNullable(sessionToken).filter(StringUtils::hasText))
                        .build())
                .retrieve()
                .onStatus(s -> s.is4xxClientError() || s.is5xxServerError(), r -> Mono.error(new AppException(HttpStatus.BAD_GATEWAY, "Google autocomplete request failed")))
                .bodyToMono(GoogleAutocompleteResponse.class)
                .timeout(Duration.ofMillis(properties.requestTimeoutMs()))
                .block();
    }

    public GooglePlaceDetailsResponse details(String placeId, String sessionToken) {
        assertApiKeyConfigured();
        return googlePlacesWebClient.get()
                .uri(properties.detailsUrl(), b -> b
                        .queryParam("place_id", placeId)
                        .queryParam("key", properties.apiKey())
                        .queryParam("language", properties.language())
                        .queryParam("fields", "place_id,formatted_address,address_components,geometry")
                        .queryParamIfPresent("sessiontoken", Optional.ofNullable(sessionToken).filter(StringUtils::hasText))
                        .build())
                .retrieve()
                .onStatus(s -> s.is4xxClientError() || s.is5xxServerError(), r -> Mono.error(new AppException(HttpStatus.BAD_GATEWAY, "Google place details request failed")))
                .bodyToMono(GooglePlaceDetailsResponse.class)
                .timeout(Duration.ofMillis(properties.requestTimeoutMs()))
                .block();
    }

    private void assertApiKeyConfigured() {
        if (!StringUtils.hasText(properties.apiKey())) {
            throw new AppException(HttpStatus.INTERNAL_SERVER_ERROR, "GOOGLE_MAPS_API_KEY is not configured");
        }
    }
}
