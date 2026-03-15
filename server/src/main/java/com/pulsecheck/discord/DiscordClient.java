package com.pulsecheck.discord;

import com.pulsecheck.discord.dto.DiscordGuild;
import com.pulsecheck.discord.dto.DiscordTokenResponse;
import com.pulsecheck.discord.dto.DiscordUser;
import com.pulsecheck.exception.DiscordApiException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;

@Slf4j
@Component
public class DiscordClient {

    private final WebClient discordWebClient;

    @Value("${discord.client-id}")
    private String clientId;

    @Value("${discord.client-secret}")
    private String clientSecret;

    @Value("${discord.redirect-uri}")
    private String redirectUri;

    public DiscordClient(@Qualifier("discordWebClient") WebClient discordWebClient) {
        this.discordWebClient = discordWebClient;
    }

    /**
     * Exchanges an OAuth2 authorization code for a Discord access token.
     * MUST use application/x-www-form-urlencoded — Discord rejects JSON.
     */
    public DiscordTokenResponse exchangeCodeForToken(String code) {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "authorization_code");
        formData.add("code", code);
        formData.add("client_id", clientId);
        formData.add("client_secret", clientSecret);
        formData.add("redirect_uri", redirectUri);

        try {
            return discordWebClient.post()
                    .uri("/oauth2/token")
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(BodyInserters.fromFormData(formData))
                    .retrieve()
                    .bodyToMono(DiscordTokenResponse.class)
                    .block();
        } catch (WebClientResponseException e) {
            log.error("Discord token exchange failed: {} {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new DiscordApiException("Failed to exchange Discord authorization code: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new DiscordApiException("Discord token exchange failed: " + e.getMessage(), e);
        }
    }

    /**
     * Fetches the current Discord user profile using their access token.
     */
    public DiscordUser getCurrentUser(String accessToken) {
        try {
            return discordWebClient.get()
                    .uri("/users/@me")
                    .header("Authorization", "Bearer " + accessToken)
                    .retrieve()
                    .bodyToMono(DiscordUser.class)
                    .block();
        } catch (WebClientResponseException e) {
            log.error("Discord /users/@me failed: {} {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new DiscordApiException("Failed to fetch Discord user profile: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new DiscordApiException("Failed to fetch Discord user: " + e.getMessage(), e);
        }
    }

    /**
     * Fetches all guilds the user belongs to.
     * Filter downstream for administrator permission bit 0x8.
     */
    public List<DiscordGuild> getUserGuilds(String accessToken) {
        try {
            return discordWebClient.get()
                    .uri("/users/@me/guilds")
                    .header("Authorization", "Bearer " + accessToken)
                    .retrieve()
                    .bodyToFlux(DiscordGuild.class)
                    .collectList()
                    .block();
        } catch (WebClientResponseException e) {
            log.error("Discord /users/@me/guilds failed: {} {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new DiscordApiException("Failed to fetch Discord guilds: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new DiscordApiException("Failed to fetch Discord guilds: " + e.getMessage(), e);
        }
    }
}
