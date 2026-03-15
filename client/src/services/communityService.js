import { fetchApi, USE_MOCK, delay } from './apiClient';

// Mock guilds — only shown when VITE_USE_MOCK_API=true
const mockAdminGuilds = [
  {
    id: 'guild-1',
    name: 'PulseCheck HQ',
    icon: 'https://ui-avatars.com/api/?name=PHQ&background=5865F2&color=fff&size=64',
    memberCount: 1450,
    platform: 'Discord',
  },
  {
    id: 'guild-2',
    name: 'React Devs Alliance',
    icon: 'https://ui-avatars.com/api/?name=RDA&background=E11D48&color=fff&size=64',
    memberCount: 8400,
    platform: 'Discord',
  },
  {
    id: 'guild-3',
    name: 'Web3 Builders',
    icon: 'https://ui-avatars.com/api/?name=W3B&background=0284C7&color=fff&size=64',
    memberCount: 3200,
    platform: 'Discord',
  },
];

export const communityService = {
  /**
   * Returns guilds where the authenticated user is an administrator.
   * Backend filters by Discord permissions bit 0x8 (ADMINISTRATOR).
   */
  async getCommunities() {
    if (USE_MOCK) {
      await delay(600);
      return mockAdminGuilds;
    }
    return fetchApi('/communities');
  },

  /**
   * Triggers Gemini AI analysis for a specific guild.
   */
  async analyzeGuild(guildId) {
    if (USE_MOCK) {
      await delay(2000);
      return {
        guildId,
        analyzedAt: new Date().toISOString(),
        healthScore: 72,
        sentimentScore: 65,
        summary:
          'This server shows moderate engagement with a concerning drop in activity over the past 14 days. Three channels are completely inactive, and expert member participation has declined by 40%.',
        deadZones: [
          { channelName: '#resources', daysSinceActivity: 12, severity: 'high' },
          { channelName: '#off-topic', daysSinceActivity: 6, severity: 'medium' },
        ],
        keyIssues: [
          '3 channels have been inactive for over 1 week',
          'Expert members are disengaging — avg messages down 40%',
          'Peak engagement window is narrowing to a 2-hour window per day',
        ],
        recommendations: [
          {
            priority: 'high',
            action: 'Archive or repurpose #resources channel',
            impact: 'Reduces dead weight and focuses member attention',
          },
          {
            priority: 'medium',
            action: 'Launch a weekly #discussion prompt thread',
            impact: 'Boosts regular engagement by ~25%',
          },
          {
            priority: 'low',
            action: 'Create a #wins channel for positive sharing',
            impact: 'Improves overall sentiment score',
          },
        ],
        topContributors: [
          { username: 'alice', contribution: 'Top poster — 341 messages this week' },
          { username: 'bob', contribution: 'Most helpful replies in #support' },
        ],
      };
    }
    return fetchApi(`/communities/${guildId}/analyze`, { method: 'POST' });
  },
};
