package com.pulsecheck.community.dto;

public record GuildDto(
        String id,
        String name,
        String icon,
        Integer memberCount,
        String platform
) {}
