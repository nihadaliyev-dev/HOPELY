package com.pulsecheck.auth.dto;

public record UserDto(
        String id,
        String username,
        String displayName,
        String email,
        String avatar
) {}
