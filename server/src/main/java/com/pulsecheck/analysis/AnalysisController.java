package com.pulsecheck.analysis;

import com.pulsecheck.analysis.dto.AnalysisResponse;
import com.pulsecheck.security.AuthenticatedUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/communities")
@RequiredArgsConstructor
public class AnalysisController {

    private final AnalysisService analysisService;

    /**
     * POST /api/v1/communities/{guildId}/analyze
     * Protected. Triggers Gemini AI analysis. Result is cached per guildId for 1 hour.
     */
    @PostMapping("/{guildId}/analyze")
    public ResponseEntity<AnalysisResponse> analyze(
            @PathVariable String guildId,
            @AuthenticationPrincipal AuthenticatedUser principal) {
        AnalysisResponse result = analysisService.analyze(guildId, principal.discordAccessToken());
        return ResponseEntity.ok(result);
    }
}
