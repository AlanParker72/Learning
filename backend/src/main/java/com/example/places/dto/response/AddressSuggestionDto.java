package com.example.places.dto.response;

public record AddressSuggestionDto(
        String placeId,
        String description,
        String mainText,
        String secondaryText
) {}
