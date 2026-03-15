package com.pulsecheck.analysis.dto;

public record GuildContext(
        String id,
        String name,
        int memberCount,
        int activeMembers,
        int totalMessages,
        int channelCount
) {}
