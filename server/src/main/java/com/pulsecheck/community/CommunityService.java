package com.pulsecheck.community;

import com.pulsecheck.community.dto.GuildDto;
import com.pulsecheck.discord.DiscordClient;
import com.pulsecheck.discord.dto.DiscordGuild;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CommunityService {

    private final DiscordClient discordClient;

    private static final long ADMINISTRATOR_PERMISSION = 0x8L;

    /**
     * Returns guilds where the user has the ADMINISTRATOR permission bit set.
     * The permissions field from Discord is a string — parse as Long before bitwise check.
     */
    public List<GuildDto> getAdminGuilds(String discordAccessToken) {
        List<DiscordGuild> guilds = discordClient.getUserGuilds(discordAccessToken);
        return guilds.stream()
                .filter(g -> {
                    try {
                        long perms = Long.parseLong(g.permissions());
                        return (perms & ADMINISTRATOR_PERMISSION) == ADMINISTRATOR_PERMISSION;
                    } catch (NumberFormatException e) {
                        return false;
                    }
                })
                .map(g -> new GuildDto(
                        g.id(),
                        g.name(),
                        g.icon() != null
                                ? "https://cdn.discordapp.com/icons/" + g.id() + "/" + g.icon() + ".png"
                                : null,
                        null,   // memberCount requires a bot token — not available here
                        "Discord"
                ))
                .toList();
    }

    // ── Static-data helper endpoints (no bot token required) ────────────────────

    public Map<String, Object> getOverviewStats(String guildId) {
        return Map.of(
                "id", guildId,
                "healthScore", 73,
                "activeChannels", 18,
                "dyingChannels", 7,
                "avgDiscussionDepth", 4.2,
                "sentimentScore", 64,
                "aiInterventionCount", 12,
                "totalMembers", 3420,
                "weeklyChange", Map.of(
                        "healthScore", -3,
                        "activeChannels", -2,
                        "dyingChannels", 3,
                        "sentimentScore", -8
                )
        );
    }

    public List<Map<String, Object>> getTimeline(String guildId, String range) {
        // Build 7 or 14 data points going back from today
        int days = "30d".equals(range) ? 14 : 7;
        List<Map<String, Object>> result = new ArrayList<>();
        int[] messages = {1240, 1560, 980, 1820, 2100, 740, 560, 1380, 1620, 890, 1720, 1940, 680, 490};
        int[] members  = {312, 389, 241, 445, 521, 187, 143, 344, 398, 221, 430, 480, 162, 128};
        int[] sentiment= {72, 68, 60, 75, 78, 64, 58, 70, 66, 55, 71, 74, 61, 57};

        LocalDate today = LocalDate.now();
        for (int i = days - 1; i >= 0; i--) {
            String date = today.minusDays(i).format(DateTimeFormatter.ISO_LOCAL_DATE);
            int idx = i % messages.length;
            result.add(Map.of(
                    "date", date,
                    "messages", messages[idx],
                    "activeUsers", members[idx],
                    "sentiment", sentiment[idx]
            ));
        }
        return result;
    }

    public Map<String, Object> getDiagnosis(String guildId) {
        return Map.of(
                "summary", "Your community shows moderate health with growing risk zones. The tech sector channels — particularly #backend, #devops, and #security — have entered critical inactivity. Immediate AI sparks are recommended. Member sentiment in #general has dipped, possibly tied to recent off-topic debates. Your core catalysts remain active, but expert members show disengagement signals.",
                "score", 73,
                "trend", "declining",
                "topConcern", "#security completely inactive for 6 days",
                "quickWin", "Post the \"Backend Architecture Debate\" spark to re-activate 3 dormant experts"
        );
    }

    public List<Map<String, Object>> getAlerts(String guildId) {
        return List.of(
                alertOf("al-1","critical","#backend","No meaningful discussion in #backend for 52 hours","The last 3 messages were all single-word responses. Expert members have gone silent.","3 hours ago","Post Discussion Spark","flame"),
                alertOf("al-2","critical","#security","#security has been completely inactive for 6 days","Zero messages in the last 144 hours. All 198 members appear inactive.","1 hour ago","Review Channel","shield"),
                alertOf("al-3","high","#general","Sentiment in #general dropped by 18% this week","Negative tone detected in 34% of messages. Possible community conflict.","45 min ago","View Details","trending-down"),
                alertOf("al-4","high","#startups","Most active members have disengaged from #startups","5 of your top 10 contributors haven't posted in 38+ hours.","2 hours ago","Re-engage","users"),
                alertOf("al-5","medium","#devops","#devops has dropped below inactivity threshold","No expert participation. Activity score: 14/100.","4 hours ago","Tag Experts","activity"),
                alertOf("al-6","medium","#introductions","New member introductions not being acknowledged","12 new members posted intros with zero responses in the last 24h.","6 hours ago","Create Welcome Spark","user-plus")
        );
    }

    public List<Map<String, Object>> getSparks(String guildId) {
        return List.of(
                Map.of("id","sp-1","title","Backend Architecture Debate","question","🔥 Hot take: Microservices are overengineered for 90% of startups. What's your experience — monolith vs micro?","reason","Channel has been inactive for 52 hours. This debate topic historically generates 3x average engagement in tech channels.","targetChannel","#backend","tagMembers",List.of("@alex_k","@priya_m","@dr_rust"),"predictedEngagement",87,"status","draft","category","Tech Debate"),
                Map.of("id","sp-2","title","Security War Story","question","🛡️ Share your worst security incident story (sanitized, of course). What did you learn from it?","reason","#security has been dead for 6 days. Vulnerability storytelling sparks are highly effective in technical channels.","targetChannel","#security","tagMembers",List.of("@sec_guru","@hacker_j"),"predictedEngagement",74,"status","draft","category","Community Story"),
                Map.of("id","sp-3","title","Startup Failure Lessons","question","💡 What was your biggest startup mistake and what would you tell your past self?","reason","#startups sentiment is declining. Vulnerability + learning content rebuilds trust and drives authentic discussion.","targetChannel","#startups","tagMembers",List.of("@founder_joe","@vc_sara","@mike_b"),"predictedEngagement",91,"status","approved","category","Founder Stories"),
                Map.of("id","sp-4","title","DevOps Daily Pain Points","question","⚡ What's the most painful part of your CI/CD pipeline right now? Let's compare setups.","reason","Expert members have been silent. Practical Q&A activates dormant experts.","targetChannel","#devops","tagMembers",List.of("@devops_pro","@cloudnative_k","@sre_anna"),"predictedEngagement",68,"status","scheduled","scheduledFor","Tomorrow, 9:00 AM","category","Tech Discussion"),
                Map.of("id","sp-5","title","Welcome Wave Campaign","question","👋 There are 12 incredible new members who just joined but haven't been welcomed yet! Drop a 🔥 on their intro posts.","reason","12 introductions with zero acknowledgment. Early welcoming drastically increases 30-day retention.","targetChannel","#introductions","tagMembers",List.of("@community_lead","@mod_team"),"predictedEngagement",82,"status","draft","category","Onboarding")
        );
    }

    public List<Map<String, Object>> getChannels(String guildId) {
        return List.of(
                channelOf("ch-1","#general","General",92,78,"healthy","2 min ago",324,1850,72,"Main community channel for everyone",List.of()),
                channelOf("ch-2","#backend","Tech",18,22,"critical","52 hours ago",3,412,38,"Backend engineering discussions",List.of("inactivity","low_sentiment","no_expert")),
                channelOf("ch-3","#frontend","Tech",55,61,"warning","4 hours ago",47,534,63,"Frontend development and design topics",List.of("repetitive_messages")),
                channelOf("ch-4","#startups","Business",31,29,"critical","38 hours ago",8,780,44,"Startup ideas, fundraising, strategy",List.of("inactivity","disengaged_members")),
                channelOf("ch-5","#design","Creative",74,68,"healthy","22 min ago",89,321,81,"UI/UX, branding, visual design",List.of()),
                channelOf("ch-6","#introductions","General",42,38,"warning","9 hours ago",21,2100,77,"New member introductions",List.of("low_engagement")),
                channelOf("ch-7","#devops","Tech",14,12,"critical","4 days ago",0,267,42,"CI/CD, infrastructure, cloud ops",List.of("inactivity","no_expert","low_sentiment")),
                channelOf("ch-8","#ai-ml","Tech",88,82,"healthy","8 min ago",216,645,79,"AI/ML research and applications",List.of()),
                channelOf("ch-9","#jobs","Career",61,44,"warning","3 hours ago",34,1420,68,"Job postings and career opportunities",List.of("low_engagement")),
                channelOf("ch-10","#random","General",79,66,"healthy","30 min ago",142,1640,74,"Off-topic and casual chat",List.of()),
                channelOf("ch-11","#product","Business",48,52,"warning","6 hours ago",29,380,61,"Product strategy and roadmap",List.of("low_engagement")),
                channelOf("ch-12","#security","Tech",9,7,"critical","6 days ago",0,198,35,"Security, pen testing, best practices",List.of("inactivity","no_expert","low_sentiment","disengaged_members"))
        );
    }

    public List<Map<String, Object>> getMembers(String guildId) {
        return List.of(
                memberOf("m-1","Alex Kim","@alex_k","Senior Engineer","AK","Catalyst","brand",218,"up",List.of("#backend","#ai-ml","#general"),420,"#6366F1",null),
                memberOf("m-2","Priya Mehta","@priya_m","ML Researcher","PM","Expert","info",184,"stable",List.of("#ai-ml","#research"),312,"#06B6D4",null),
                memberOf("m-3","Jordan Lee","@jordan_l","Founder","JL","At Risk","critical",12,"down",List.of("#startups"),198,"#EF4444","4 days ago"),
                memberOf("m-4","Sam Torres","@sam_t","Designer","ST","Catalyst","brand",156,"up",List.of("#design","#general","#random"),267,"#8B5CF6",null),
                memberOf("m-5","Marina V.","@marina_v","DevOps Eng.","MV","Re-engage Candidate","warning",4,"down",List.of("#devops"),156,"#F59E0B","8 days ago"),
                memberOf("m-6","David Park","@david_p","Backend Dev","DP","Silent Reader","info",2,"stable",List.of("#backend","#devops"),89,"#06B6D4",null),
                memberOf("m-7","Ciara Walsh","@ciara_w","Community Lead","CW","Catalyst","healthy",341,"up",List.of("#general","#introductions","#random","#jobs"),580,"#10B981",null),
                memberOf("m-8","Ravi Shankar","@sec_guru","Security Eng.","RS","At Risk","critical",0,"down",List.of("#security"),240,"#EF4444","10 days ago")
        );
    }

    public List<Map<String, Object>> getAutomations(String guildId) {
        return List.of(
                Map.of("id",1,"name","Critical Dead Zone Alert","ifMetric","Channel Inactivity","condition","> 48 hours","action","Send Slack DM to @admin","status","active","lastRun","2 hours ago","runs",142),
                Map.of("id",2,"name","Sentiment Drop Warning","ifMetric","Channel Sentiment","condition","< 40%","action","Post \"What's on your mind?\" Spark","status","active","lastRun","1 day ago","runs",28),
                Map.of("id",3,"name","Expert Disengagement","ifMetric","Member (Expert) Activity","condition","0 msgs in 7 days","action","Tag in #core-contributors","status","paused","lastRun","Never","runs",0)
        );
    }

    public List<Map<String, Object>> getReports(String guildId) {
        return List.of(
                Map.of("id",1,"name","Weekly Health Digest","date","Mar 15, 2026","size","2.4 MB","type","PDF"),
                Map.of("id",2,"name","Q1 Sentiment Analysis","date","Mar 01, 2026","size","1.8 MB","type","CSV"),
                Map.of("id",3,"name","Weekly Health Digest","date","Mar 08, 2026","size","2.4 MB","type","PDF"),
                Map.of("id",4,"name","Inactive Members Export","date","Mar 05, 2026","size","840 KB","type","CSV")
        );
    }

    // ── Builders ────────────────────────────────────────────────────────────────

    private Map<String, Object> alertOf(String id, String priority, String channel,
                                        String message, String detail, String time,
                                        String action, String icon) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", id); m.put("priority", priority); m.put("channel", channel);
        m.put("message", message); m.put("detail", detail); m.put("time", time);
        m.put("action", action); m.put("icon", icon);
        return m;
    }

    private Map<String, Object> channelOf(String id, String name, String category,
                                          int activity, int engagement, String risk,
                                          String lastActive, int messages24h, int members,
                                          int sentiment, String description, List<String> issues) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", id); m.put("name", name); m.put("category", category);
        m.put("activity", activity); m.put("engagement", engagement); m.put("risk", risk);
        m.put("lastActive", lastActive); m.put("messages24h", messages24h);
        m.put("members", members); m.put("sentiment", sentiment);
        m.put("description", description); m.put("issues", issues);
        return m;
    }

    private Map<String, Object> memberOf(String id, String name, String username,
                                         String role, String avatar, String label,
                                         String labelColor, int messages7d, String trend,
                                         List<String> activeIn, int joinedDays,
                                         String color, String lastSeen) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", id); m.put("name", name); m.put("username", username);
        m.put("role", role); m.put("avatar", avatar); m.put("label", label);
        m.put("labelColor", labelColor); m.put("messages7d", messages7d); m.put("trend", trend);
        m.put("activeIn", activeIn); m.put("joinedDays", joinedDays); m.put("color", color);
        if (lastSeen != null) m.put("lastSeen", lastSeen);
        return m;
    }
}
