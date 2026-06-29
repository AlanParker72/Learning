package com.example.googleplaces.service.impl;

import com.example.googleplaces.config.GoogleMapsProperties;
import com.example.googleplaces.dto.response.AddressDetailsDto;
import com.example.googleplaces.dto.response.AddressSuggestionDto;
import com.example.googleplaces.dto.google.GoogleAutocompleteResponse;
import com.example.googleplaces.dto.google.GooglePlaceDetailsResponse;
import com.example.googleplaces.exception.GooglePlacesException;
import com.example.googleplaces.service.GooglePlacesService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class GooglePlacesServiceImpl implements GooglePlacesService {

    private final WebClient webClient;
    private final GoogleMapsProperties googleMapsProperties;

    @Override
    public List<AddressSuggestionDto> autocomplete(String input, String sessionToken) {

        if (input == null || input.trim().length() < 3) {
            return List.of();
        }

        GoogleAutocompleteResponse response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/place/autocomplete/json")
                        .queryParam("input", input.trim())
                        .queryParam("key", googleMapsProperties.apiKey())
                        .queryParam("types", "address")
                        .queryParam("components", "country:us")
                        .queryParam("language", "en")
                        .queryParamIfPresent("sessiontoken", Optional.ofNullable(sessionToken))
                        .build())
                .retrieve()
                .bodyToMono(GoogleAutocompleteResponse.class)
                .block();

        if (response == null) {
            throw new GooglePlacesException("No response from Google Places autocomplete API");
        }

        if (!"OK".equals(response.status()) && !"ZERO_RESULTS".equals(response.status())) {
            log.error("Google autocomplete failed. Status={}, Error={}",
                    response.status(), response.errorMessage());
            throw new GooglePlacesException(response.errorMessage());
        }

        if (response.predictions() == null) {
            return List.of();
        }

        return response.predictions()
                .stream()
                .map(prediction -> new AddressSuggestionDto(
                        prediction.placeId(),
                        prediction.description(),
                        prediction.structuredFormatting() != null
                                ? prediction.structuredFormatting().mainText()
                                : prediction.description(),
                        prediction.structuredFormatting() != null
                                ? prediction.structuredFormatting().secondaryText()
                                : ""
                ))
                .toList();
    }

    @Override
    public AddressDetailsDto getAddressDetails(String placeId, String sessionToken) {

        GooglePlaceDetailsResponse response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/place/details/json")
                        .queryParam("place_id", placeId)
                        .queryParam("key", googleMapsProperties.apiKey())
                        .queryParam("fields", "address_components,formatted_address,geometry")
                        .queryParam("language", "en")
                        .queryParamIfPresent("sessiontoken", Optional.ofNullable(sessionToken))
                        .build())
                .retrieve()
                .bodyToMono(GooglePlaceDetailsResponse.class)
                .block();

        if (response == null || response.result() == null) {
            throw new GooglePlacesException("No response from Google Place Details API");
        }

        if (!"OK".equals(response.status())) {
            log.error("Google place details failed. Status={}, Error={}",
                    response.status(), response.errorMessage());
            throw new GooglePlacesException(response.errorMessage());
        }

        return mapToAddressDetails(response);
    }

    private AddressDetailsDto mapToAddressDetails(GooglePlaceDetailsResponse response) {

        String streetNumber = "";
        String route = "";
        String city = "";
        String state = "";
        String zip = "";
        String zipSuffix = "";
        String country = "";

        for (GooglePlaceDetailsResponse.AddressComponent component :
                response.result().addressComponents()) {

            List<String> types = component.types();

            if (types.contains("street_number")) {
                streetNumber = component.longName();
            }

            if (types.contains("route")) {
                route = component.longName();
            }

            if (types.contains("locality")) {
                city = component.longName();
            }

            if (types.contains("administrative_area_level_1")) {
                state = component.shortName();
            }

            if (types.contains("postal_code")) {
                zip = component.longName();
            }

            if (types.contains("postal_code_suffix")) {
                zipSuffix = component.longName();
            }

            if (types.contains("country")) {
                country = component.longName();
            }
        }

        String addressLine1 = (streetNumber + " " + route).trim();

        String zipCode = zip;
        if (!zipSuffix.isBlank()) {
            zipCode = zip + "-" + zipSuffix;
        }

        return new AddressDetailsDto(
                addressLine1,
                city,
                state,
                zipCode,
                country,
                response.result().formattedAddress()
        );
    }
}
