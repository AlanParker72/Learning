package com.example.places.controller;

import com.example.places.dto.response.AddressDetailsDto;
import com.example.places.dto.response.AddressSuggestionDto;
import com.example.places.service.GooglePlacesService;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/addresses")
public class AddressController {
    private final GooglePlacesService googlePlacesService;

    @GetMapping("/autocomplete")
    public List<AddressSuggestionDto> autocomplete(
            @RequestParam @NotBlank @Size(min = 3, max = 150) String input,
            @RequestParam(required = false) String sessionToken) {
        return googlePlacesService.autocomplete(input, sessionToken);
    }

    @GetMapping("/details")
    public AddressDetailsDto details(
            @RequestParam @NotBlank String placeId,
            @RequestParam(required = false) String sessionToken) {
        return googlePlacesService.getAddressDetails(placeId, sessionToken);
    }
}
