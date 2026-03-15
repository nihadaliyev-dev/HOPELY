package com.pulsecheck.community;

import com.pulsecheck.community.dto.GuildDto;
import com.pulsecheck.security.AuthenticatedUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/communities")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityService communityService;

    /** GET /api/v1/communities — guilds where the user is administrator */
    @GetMapping
    public ResponseEntity<List<GuildDto>> getCommunities(@AuthenticationPrincipal AuthenticatedUser principal) {
        List<GuildDto> guilds = communityService.getAdminGuilds(principal.discordAccessToken());
        return ResponseEntity.ok(guilds);
    }

    /** GET /api/v1/communities/{guildId}/stats/overview */
    @GetMapping("/{guildId}/stats/overview")
    public ResponseEntity<Map<String, Object>> getOverview(@PathVariable String guildId) {
        return ResponseEntity.ok(communityService.getOverviewStats(guildId));
    }

    /** GET /api/v1/communities/{guildId}/stats/timeline?range=7d|30d */
    @GetMapping("/{guildId}/stats/timeline")
    public ResponseEntity<List<Map<String, Object>>> getTimeline(
            @PathVariable String guildId,
            @RequestParam(defaultValue = "7d") String range) {
        return ResponseEntity.ok(communityService.getTimeline(guildId, range));
    }

    /** GET /api/v1/communities/{guildId}/stats/diagnosis */
    @GetMapping("/{guildId}/stats/diagnosis")
    public ResponseEntity<Map<String, Object>> getDiagnosis(@PathVariable String guildId) {
        return ResponseEntity.ok(communityService.getDiagnosis(guildId));
    }

    /** GET /api/v1/communities/{guildId}/alerts */
    @GetMapping("/{guildId}/alerts")
    public ResponseEntity<List<Map<String, Object>>> getAlerts(@PathVariable String guildId) {
        return ResponseEntity.ok(communityService.getAlerts(guildId));
    }

    /** GET /api/v1/communities/{guildId}/sparks */
    @GetMapping("/{guildId}/sparks")
    public ResponseEntity<List<Map<String, Object>>> getSparks(@PathVariable String guildId) {
        return ResponseEntity.ok(communityService.getSparks(guildId));
    }

    /** GET /api/v1/communities/{guildId}/channels */
    @GetMapping("/{guildId}/channels")
    public ResponseEntity<List<Map<String, Object>>> getChannels(@PathVariable String guildId) {
        return ResponseEntity.ok(communityService.getChannels(guildId));
    }

    /** GET /api/v1/communities/{guildId}/members */
    @GetMapping("/{guildId}/members")
    public ResponseEntity<List<Map<String, Object>>> getMembers(@PathVariable String guildId) {
        return ResponseEntity.ok(communityService.getMembers(guildId));
    }

    /** GET /api/v1/communities/{guildId}/automations */
    @GetMapping("/{guildId}/automations")
    public ResponseEntity<List<Map<String, Object>>> getAutomations(@PathVariable String guildId) {
        return ResponseEntity.ok(communityService.getAutomations(guildId));
    }

    /** GET /api/v1/communities/{guildId}/reports */
    @GetMapping("/{guildId}/reports")
    public ResponseEntity<List<Map<String, Object>>> getReports(@PathVariable String guildId) {
        return ResponseEntity.ok(communityService.getReports(guildId));
    }
}
