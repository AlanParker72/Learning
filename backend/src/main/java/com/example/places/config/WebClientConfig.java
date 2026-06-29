package com.example.places.config;

import io.netty.channel.ChannelOption;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;
import java.time.Duration;

@Configuration
@RequiredArgsConstructor
public class WebClientConfig {
    private final GooglePlacesProperties properties;

    @Bean
    public WebClient googlePlacesWebClient(WebClient.Builder builder) {
        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, properties.requestTimeoutMs())
                .responseTimeout(Duration.ofMillis(properties.requestTimeoutMs()));
        return builder.clientConnector(new ReactorClientHttpConnector(httpClient)).build();
    }
}
