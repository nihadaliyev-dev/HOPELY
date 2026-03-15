package com.pulsecheck.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient discordWebClient(@Value("${discord.api-base}") String discordBaseUrl) {
        return WebClient.builder()
                .baseUrl(discordBaseUrl)
                .build();
    }

    @Bean
    public WebClient geminiWebClient() {
        return WebClient.builder()
                .build();
    }
}
