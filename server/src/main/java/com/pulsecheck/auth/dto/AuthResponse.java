package com.pulsecheck.auth.dto;

public record AuthResponse(String token, UserDto user) {}
