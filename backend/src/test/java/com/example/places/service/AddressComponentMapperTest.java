package com.example.places.service;

import com.example.places.dto.google.GooglePlaceDetailsResponse;
import com.example.places.dto.response.AddressDetailsDto;
import com.example.places.util.AddressComponentMapper;
import org.junit.jupiter.api.Test;
import java.util.List;
import static org.assertj.core.api.Assertions.assertThat;

class AddressComponentMapperTest {
    @Test
    void mapsZipPlusFour() {
        var result = new GooglePlaceDetailsResponse.Result(
                "place-1", "10444 Glenmere Creek Circle, Charlotte, NC 28277-1234, USA",
                List.of(
                        c("10444", "10444", "street_number"),
                        c("Glenmere Creek Circle", "Glenmere Creek Cir", "route"),
                        c("Charlotte", "Charlotte", "locality"),
                        c("North Carolina", "NC", "administrative_area_level_1"),
                        c("28277", "28277", "postal_code"),
                        c("1234", "1234", "postal_code_suffix"),
                        c("United States", "US", "country")
                ), null);
        AddressDetailsDto dto = AddressComponentMapper.toDto(result);
        assertThat(dto.addressLine1()).isEqualTo("10444 Glenmere Creek Circle");
        assertThat(dto.city()).isEqualTo("Charlotte");
        assertThat(dto.state()).isEqualTo("NC");
        assertThat(dto.zipCode()).isEqualTo("28277-1234");
    }
    private GooglePlaceDetailsResponse.AddressComponent c(String longName, String shortName, String type) {
        return new GooglePlaceDetailsResponse.AddressComponent(longName, shortName, List.of(type));
    }
}
