package com.pulsecheck.discord.dto;

import java.util.List;

public record DiscordGuild(
        String id,
        String name,
        String icon,
        Boolean owner,
        String permissions,
        List<String> features
) {}
