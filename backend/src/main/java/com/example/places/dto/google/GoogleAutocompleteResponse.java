package com.example.places.dto.google;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GoogleAutocompleteResponse(
        String status,
        @JsonProperty("error_message") String errorMessage,
        List<Prediction> predictions
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Prediction(
            String description,
            @JsonProperty("place_id") String placeId,
            @JsonProperty("structured_formatting") StructuredFormatting structuredFormatting
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record StructuredFormatting(
            @JsonProperty("main_text") String mainText,
            @JsonProperty("secondary_text") String secondaryText
    ) {}
}
