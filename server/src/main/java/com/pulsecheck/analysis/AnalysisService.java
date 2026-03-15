package com.pulsecheck.analysis;

import com.pulsecheck.analysis.dto.AnalysisResponse;
import com.pulsecheck.analysis.dto.GuildContext;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnalysisService {

    private final GeminiService geminiService;

    /**
     * Runs Gemini AI analysis for a guild.
     * Results are cached per guildId for 1 hour (see CacheConfig).
     */
    @Cacheable(value = "guildAnalysis", key = "#guildId")
    public AnalysisResponse analyze(String guildId, String discordAccessToken) {
        // Build a guild context with synthetic activity numbers
        // (Real data would require a bot token with full server access)
        GuildContext context = new GuildContext(
                guildId,
                "Discord Server", // Name would come from guild lookup with bot token
                3420, // Synthetic — representative community size
                312, // Synthetic active members (7d)
                9840, // Synthetic total messages (7d)
                18 // Synthetic channel count
        );

        return geminiService.analyzeGuild(context);
    }
}
