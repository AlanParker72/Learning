package com.example.places.dto.google;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GooglePlaceDetailsResponse(
        String status,
        @JsonProperty("error_message") String errorMessage,
        Result result
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Result(
            @JsonProperty("place_id") String placeId,
            @JsonProperty("formatted_address") String formattedAddress,
            @JsonProperty("address_components") List<AddressComponent> addressComponents,
            Geometry geometry
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record AddressComponent(
            @JsonProperty("long_name") String longName,
            @JsonProperty("short_name") String shortName,
            List<String> types
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Geometry(Location location) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Location(Double lat, Double lng) {}
}
