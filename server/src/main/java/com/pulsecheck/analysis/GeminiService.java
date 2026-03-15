package com.pulsecheck.analysis;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pulsecheck.analysis.dto.AnalysisResponse;
import com.pulsecheck.analysis.dto.GuildContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class GeminiService {

    private final WebClient geminiWebClient;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.api-url}")
    private String apiUrl;

    public GeminiService(@Qualifier("geminiWebClient") WebClient geminiWebClient,
                         ObjectMapper objectMapper) {
        this.geminiWebClient = geminiWebClient;
        this.objectMapper = objectMapper;
    }

    public AnalysisResponse analyzeGuild(GuildContext guild) {
        String prompt = buildPrompt(guild);

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of(
                        "parts", List.of(Map.of("text", prompt))
                )),
                "generationConfig", Map.of(
                        "temperature", 0.3,
                        "maxOutputTokens", 1024,
                        "responseMimeType", "application/json"
                )
        );

        try {
            String rawResponse = geminiWebClient.post()
                    .uri(apiUrl + "?key=" + apiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            // Gemini response wraps the JSON string in candidates[0].content.parts[0].text
            JsonNode root = objectMapper.readTree(rawResponse);
            String jsonText = root
                    .path("candidates").get(0)
                    .path("content")
                    .path("parts").get(0)
                    .path("text")
                    .asText();

            // Parse the AI-generated JSON into AnalysisResponse
            GeminiAnalysisResult result = objectMapper.readValue(jsonText, GeminiAnalysisResult.class);

            return new AnalysisResponse(
                    guild.id(),
                    java.time.Instant.now().toString(),
                    result.healthScore(),
                    result.sentimentScore(),
                    result.summary(),
                    result.deadZones().stream()
                            .map(dz -> new AnalysisResponse.DeadZone(dz.get("channelName").toString(),
                                    Integer.parseInt(dz.get("daysSinceActivity").toString()),
                                    dz.get("severity").toString()))
                            .toList(),
                    result.keyIssues(),
                    result.recommendations().stream()
                            .map(r -> new AnalysisResponse.Recommendation(
                                    r.get("priority").toString(),
                                    r.get("action").toString(),
                                    r.get("impact").toString()))
                            .toList(),
                    result.topContributors().stream()
                            .map(c -> new AnalysisResponse.TopContributor(
                                    c.get("username").toString(),
                                    c.get("contribution").toString()))
                            .toList()
            );
        } catch (WebClientResponseException e) {
            log.error("Gemini API call failed: {} {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Gemini API call failed: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Failed to parse Gemini response", e);
            throw new RuntimeException("Failed to process Gemini analysis: " + e.getMessage(), e);
        }
    }

    private String buildPrompt(GuildContext guild) {
        return """
                You are an expert community health analyst. Analyze the following Discord server and return ONLY valid JSON (no markdown, no explanation).

                Server: %s
                Total Members: %d
                Active Members (7d): %d
                Total Messages (7d): %d
                Channel Count: %d

                Return exactly this JSON structure:
                {
                  "healthScore": <integer 0-100>,
                  "sentimentScore": <integer 0-100>,
                  "summary": "<2-3 sentence plain english community assessment>",
                  "deadZones": [{"channelName": "string", "daysSinceActivity": <integer>, "severity": "low|medium|high"}],
                  "keyIssues": ["string", "string", "string"],
                  "recommendations": [{"priority": "high|medium|low", "action": "string", "impact": "string"}],
                  "topContributors": [{"username": "string", "contribution": "string"}]
                }
                """.formatted(
                guild.name(), guild.memberCount(),
                guild.activeMembers(), guild.totalMessages(), guild.channelCount()
        );
    }

    /** Internal record for deserializing the raw Gemini JSON output */
    private record GeminiAnalysisResult(
            int healthScore,
            int sentimentScore,
            String summary,
            List<Map<String, Object>> deadZones,
            List<String> keyIssues,
            List<Map<String, Object>> recommendations,
            List<Map<String, Object>> topContributors
    ) {}
}
