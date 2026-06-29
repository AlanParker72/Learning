package com.example.places.service;

import com.example.places.dto.response.AddressDetailsDto;
import com.example.places.dto.response.AddressSuggestionDto;
import java.util.List;

public interface GooglePlacesService {
    List<AddressSuggestionDto> autocomplete(String input, String sessionToken);
    AddressDetailsDto getAddressDetails(String placeId, String sessionToken);
}
