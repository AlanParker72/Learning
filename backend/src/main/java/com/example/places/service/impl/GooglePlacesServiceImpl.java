package com.example.places.service.impl;

import com.example.places.client.GooglePlacesClient;
import com.example.places.dto.google.GoogleAutocompleteResponse;
import com.example.places.dto.google.GooglePlaceDetailsResponse;
import com.example.places.dto.response.AddressDetailsDto;
import com.example.places.dto.response.AddressSuggestionDto;
import com.example.places.exception.AppException;
import com.example.places.service.GooglePlacesService;
import com.example.places.util.AddressComponentMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class GooglePlacesServiceImpl implements GooglePlacesService {
    private final GooglePlacesClient googlePlacesClient;

    @Override
    public List<AddressSuggestionDto> autocomplete(String input, String sessionToken) {
        if (!StringUtils.hasText(input) || input.trim().length() < 3) return List.of();
        GoogleAutocompleteResponse response = googlePlacesClient.autocomplete(input.trim(), sessionToken);
        validateGoogleStatus(response == null ? null : response.status(), response == null ? null : response.errorMessage(), "autocomplete");
        return Optional.ofNullable(response.predictions()).orElse(List.of()).stream()
                .map(p -> new AddressSuggestionDto(
                        p.placeId(),
                        p.description(),
                        p.structuredFormatting() == null ? p.description() : p.structuredFormatting().mainText(),
                        p.structuredFormatting() == null ? "" : p.structuredFormatting().secondaryText()))
                .toList();
    }

    @Override
    public AddressDetailsDto getAddressDetails(String placeId, String sessionToken) {
        if (!StringUtils.hasText(placeId)) throw new AppException(HttpStatus.BAD_REQUEST, "placeId is required");
        GooglePlaceDetailsResponse response = googlePlacesClient.details(placeId.trim(), sessionToken);
        validateGoogleStatus(response == null ? null : response.status(), response == null ? null : response.errorMessage(), "details");
        if (response.result() == null) throw new AppException(HttpStatus.NOT_FOUND, "No address details found for selected place");
        return AddressComponentMapper.toDto(response.result());
    }

    private void validateGoogleStatus(String status, String errorMessage, String operation) {
        if ("OK".equals(status)) return;
        if ("ZERO_RESULTS".equals(status)) return;
        log.warn("Google Places {} returned status={}, message={}", operation, status, errorMessage);
        throw new AppException(HttpStatus.BAD_GATEWAY, "Google Places error: " + (errorMessage != null ? errorMessage : status));
    }
}
