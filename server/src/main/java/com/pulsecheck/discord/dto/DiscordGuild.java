package com.pulsecheck.discord.dto;

public record DiscordGuild(
        String id,
        String name,
        String icon,
        Boolean owner,
        String permissions,
        String features
) {}
