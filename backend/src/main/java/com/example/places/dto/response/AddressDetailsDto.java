package com.example.places.dto.response;

public record AddressDetailsDto(
        String placeId,
        String addressLine1,
        String city,
        String state,
        String zipCode,
        String country,
        String formattedAddress,
        Double latitude,
        Double longitude
) {}
