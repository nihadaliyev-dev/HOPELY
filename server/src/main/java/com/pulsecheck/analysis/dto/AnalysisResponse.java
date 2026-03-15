package com.pulsecheck.analysis.dto;

import java.util.List;

public record AnalysisResponse(
        String guildId,
        String analyzedAt,
        int healthScore,
        int sentimentScore,
        String summary,
        List<DeadZone> deadZones,
        List<String> keyIssues,
        List<Recommendation> recommendations,
        List<TopContributor> topContributors
) {
    public record DeadZone(String channelName, int daysSinceActivity, String severity) {}
    public record Recommendation(String priority, String action, String impact) {}
    public record TopContributor(String username, String contribution) {}
}
