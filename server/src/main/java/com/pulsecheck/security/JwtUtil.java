package com.pulsecheck.security;

import com.pulsecheck.auth.dto.UserDto;
import com.pulsecheck.exception.JwtAuthException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

@Slf4j
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration-ms}")
    private long expirationMs;

    private SecretKey signingKey;

    @PostConstruct
    public void init() {
        if (secret == null || secret.length() < 32) {
            throw new IllegalStateException(
                    "JWT_SECRET must be at least 32 characters for HS256. Got: " +
                    (secret == null ? "null" : secret.length() + " chars"));
        }
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Generates a signed JWT token containing Discord user info and access token.
     * NOTE: discordAccessToken is intentionally stored in the JWT (stateless proxy pattern).
     */
    public String generateToken(UserDto user, String discordAccessToken) {
        return Jwts.builder()
                .subject(user.id())
                .claims(Map.of(
                        "username", user.username() != null ? user.username() : "",
                        "displayName", user.displayName() != null ? user.displayName() : "",
                        "email", user.email() != null ? user.email() : "",
                        "avatar", user.avatar() != null ? user.avatar() : "",
                        "discordAccessToken", discordAccessToken
                ))
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(signingKey)
                .compact();
    }

    /**
     * Validates token and returns claims. Throws JwtAuthException on any failure.
     */
    public Claims validateToken(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (ExpiredJwtException e) {
            throw new JwtAuthException("JWT token has expired");
        } catch (UnsupportedJwtException | MalformedJwtException e) {
            throw new JwtAuthException("JWT token is invalid");
        } catch (Exception e) {
            throw new JwtAuthException("JWT validation failed");
        }
    }

    /**
     * Extracts an AuthenticatedUser from validated JWT claims.
     */
    public AuthenticatedUser extractUser(Claims claims) {
        return new AuthenticatedUser(
                claims.getSubject(),
                (String) claims.get("username"),
                (String) claims.get("displayName"),
                (String) claims.get("email"),
                (String) claims.get("avatar"),
                (String) claims.get("discordAccessToken")
        );
    }
}
