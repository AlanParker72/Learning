package com.example.places.util;

import com.example.places.dto.google.GooglePlaceDetailsResponse;
import com.example.places.dto.response.AddressDetailsDto;
import java.util.List;
import java.util.Optional;

public final class AddressComponentMapper {
    private AddressComponentMapper() {}

    public static AddressDetailsDto toDto(GooglePlaceDetailsResponse.Result result) {
        List<GooglePlaceDetailsResponse.AddressComponent> c = Optional.ofNullable(result.addressComponents()).orElse(List.of());
        String streetNumber = longName(c, "street_number");
        String route = longName(c, "route");
        String city = firstLongName(c, "locality", "postal_town", "sublocality", "administrative_area_level_2");
        String state = shortName(c, "administrative_area_level_1");
        String zip = longName(c, "postal_code");
        String suffix = longName(c, "postal_code_suffix");
        String zipCode = zip.isBlank() || suffix.isBlank() ? zip : zip + "-" + suffix;
        String country = longName(c, "country");
        String addressLine1 = (streetNumber + " " + route).trim();
        Double lat = result.geometry() != null && result.geometry().location() != null ? result.geometry().location().lat() : null;
        Double lng = result.geometry() != null && result.geometry().location() != null ? result.geometry().location().lng() : null;
        return new AddressDetailsDto(result.placeId(), addressLine1, city, state, zipCode, country, result.formattedAddress(), lat, lng);
    }

    private static String firstLongName(List<GooglePlaceDetailsResponse.AddressComponent> c, String... types) {
        for (String type : types) {
            String value = longName(c, type);
            if (!value.isBlank()) return value;
        }
        return "";
    }
    private static String longName(List<GooglePlaceDetailsResponse.AddressComponent> c, String type) {
        return c.stream().filter(x -> x.types() != null && x.types().contains(type)).map(GooglePlaceDetailsResponse.AddressComponent::longName).findFirst().orElse("");
    }
    private static String shortName(List<GooglePlaceDetailsResponse.AddressComponent> c, String type) {
        return c.stream().filter(x -> x.types() != null && x.types().contains(type)).map(GooglePlaceDetailsResponse.AddressComponent::shortName).findFirst().orElse("");
    }
}
