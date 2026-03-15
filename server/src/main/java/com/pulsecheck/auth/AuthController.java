package com.pulsecheck.auth;

import com.pulsecheck.auth.dto.AuthResponse;
import com.pulsecheck.auth.dto.DiscordCallbackRequest;
import com.pulsecheck.auth.dto.UserDto;
import com.pulsecheck.security.AuthenticatedUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * GET /api/v1/auth/discord/url
     * Public — returns the Discord OAuth2 authorization URL.
     */
    @GetMapping("/discord/url")
    public ResponseEntity<Map<String, String>> getDiscordUrl() {
        String url = authService.getDiscordOAuthUrl();
        return ResponseEntity.ok(Map.of("url", url));
    }

    /**
     * POST /api/v1/auth/discord/callback
     * Public — exchanges OAuth2 code for JWT + user profile.
     */
    @PostMapping("/discord/callback")
    public ResponseEntity<AuthResponse> discordCallback(@RequestBody DiscordCallbackRequest request) {
        AuthResponse response = authService.handleCallback(request.code());
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/v1/auth/me
     * Protected — returns decoded JWT user info from SecurityContext.
     */
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal AuthenticatedUser principal) {
        UserDto user = authService.getCurrentUser(principal);
        return ResponseEntity.ok(user);
    }
}
