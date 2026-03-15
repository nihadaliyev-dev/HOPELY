package com.pulsecheck.discord.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record DiscordUser(
        String id,
        String username,
        String discriminator,
        @JsonProperty("global_name") String globalName,
        String email,
        String avatar,
        Boolean verified
) {}
