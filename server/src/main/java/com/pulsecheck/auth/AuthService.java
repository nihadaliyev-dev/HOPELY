package com.pulsecheck.auth;

import com.pulsecheck.auth.dto.AuthResponse;
import com.pulsecheck.auth.dto.UserDto;
import com.pulsecheck.discord.DiscordClient;
import com.pulsecheck.discord.dto.DiscordTokenResponse;
import com.pulsecheck.discord.dto.DiscordUser;
import com.pulsecheck.security.AuthenticatedUser;
import com.pulsecheck.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final DiscordClient discordClient;
    private final JwtUtil jwtUtil;

    @Value("${discord.client-id}")
    private String discordClientId;

    @Value("${discord.redirect-uri}")
    private String discordRedirectUri;

    /**
     * Builds the Discord OAuth2 authorization URL.
     */
    public String getDiscordOAuthUrl() {
        return UriComponentsBuilder
                .fromHttpUrl("https://discord.com/api/oauth2/authorize")
                .queryParam("client_id", discordClientId)
                .queryParam("redirect_uri", discordRedirectUri)
                .queryParam("response_type", "code")
                .queryParam("scope", "identify email guilds")
                .build()
                .toUriString();
    }

    /**
     * Exchanges an OAuth2 code for a JWT.
     * Fetches Discord user profile and embeds the access token in the JWT for stateless proxying.
     */
    public AuthResponse handleCallback(String code) {
        // 1. Exchange code for Discord tokens
        DiscordTokenResponse tokenResponse = discordClient.exchangeCodeForToken(code);
        String discordAccessToken = tokenResponse.accessToken();

        // 2. Fetch user profile
        DiscordUser discordUser = discordClient.getCurrentUser(discordAccessToken);

        // 3. Build avatar URL
        String avatarUrl = buildAvatarUrl(discordUser);

        // 4. Build display name (prefer global_name, fall back to username)
        String displayName = (discordUser.globalName() != null && !discordUser.globalName().isBlank())
                ? discordUser.globalName()
                : discordUser.username();

        // 5. Build username tag (modern Discord has discriminator "0")
        String username = "0".equals(discordUser.discriminator())
                ? discordUser.username()
                : discordUser.username() + "#" + discordUser.discriminator();

        UserDto userDto = new UserDto(
                discordUser.id(),
                username,
                displayName,
                discordUser.email(),
                avatarUrl
        );

        // 6. Sign JWT
        String token = jwtUtil.generateToken(userDto, discordAccessToken);

        return new AuthResponse(token, userDto);
    }

    /**
     * Maps an AuthenticatedUser (from SecurityContext) to a public UserDto.
     */
    public UserDto getCurrentUser(AuthenticatedUser principal) {
        return new UserDto(
                principal.id(),
                principal.username(),
                principal.displayName(),
                principal.email(),
                principal.avatar()
        );
    }

    private String buildAvatarUrl(DiscordUser user) {
        if (user.avatar() != null && !user.avatar().isBlank()) {
            return "https://cdn.discordapp.com/avatars/" + user.id() + "/" + user.avatar() + ".png";
        }
        // Default avatar index based on discriminator
        int index = "0".equals(user.discriminator()) ? 0 : Integer.parseInt(user.discriminator()) % 5;
        return "https://cdn.discordapp.com/embed/avatars/" + index + ".png";
    }
}
