import { fetchApi, USE_MOCK, delay } from './apiClient';
import { 
  communityStats, 
  pulseTimelineData, 
  alerts, 
  sparks, 
  aiDiagnosis, 
  members, 
  channels 
} from '../data/mockData';

export const dashboardService = {
  async getOverviewStats(communityId) {
    if (USE_MOCK) {
      await delay(800);
      return communityStats;
    }
    return fetchApi(`/communities/${communityId}/stats/overview`);
  },

  async getTimeline(communityId, range = '7d') {
    if (USE_MOCK) {
      await delay(600);
      return pulseTimelineData;
    }
    return fetchApi(`/communities/${communityId}/stats/timeline?range=${range}`);
  },

  async getAiDiagnosis(communityId) {
    if (USE_MOCK) {
      await delay(500);
      return aiDiagnosis;
    }
    return fetchApi(`/communities/${communityId}/stats/diagnosis`);
  },

  async getAlerts(communityId) {
    if (USE_MOCK) {
      await delay(700);
      return alerts;
    }
    return fetchApi(`/communities/${communityId}/alerts`);
  },

  async getSparks(communityId) {
    if (USE_MOCK) {
      await delay(700);
      return sparks;
    }
    return fetchApi(`/communities/${communityId}/sparks`);
  },

  async getChannels(communityId) {
    if (USE_MOCK) {
      await delay(800);
      return channels;
    }
    return fetchApi(`/communities/${communityId}/channels`);
  },

  async getMembers(communityId) {
    if (USE_MOCK) {
      await delay(1000);
      return members;
    }
    return fetchApi(`/communities/${communityId}/members`);
  },

  async getAutomations(communityId) {
    if (USE_MOCK) {
      await delay(600);
      return [
        { id: 1, name: 'Critical Dead Zone Alert', ifMetric: 'Channel Inactivity', condition: '> 48 hours', action: 'Send Slack DM to @admin', status: 'active', lastRun: '2 hours ago', runs: 142 },
        { id: 2, name: 'Sentiment Drop Warning', ifMetric: 'Channel Sentiment', condition: '< 40%', action: 'Post "What\'s on your mind?" Spark', status: 'active', lastRun: '1 day ago', runs: 28 },
        { id: 3, name: 'Expert Disengagement', ifMetric: 'Member (Expert) Activity', condition: '0 msgs in 7 days', action: 'Tag in #core-contributors', status: 'paused', lastRun: 'Never', runs: 0 }
      ];
    }
    return fetchApi(`/communities/${communityId}/automations`);
  },

  async getReports(communityId) {
    if (USE_MOCK) {
      await delay(700);
      return [
        { id: 1, name: 'Weekly Health Digest', date: 'Oct 24, 2026', size: '2.4 MB', type: 'PDF' },
        { id: 2, name: 'Q3 Sentiment Analysis', date: 'Oct 01, 2026', size: '1.8 MB', type: 'CSV' },
        { id: 3, name: 'Weekly Health Digest', date: 'Oct 17, 2026', size: '2.4 MB', type: 'PDF' },
        { id: 4, name: 'Inactive Members Export', date: 'Oct 15, 2026', size: '840 KB', type: 'CSV' }
      ];
    }
    return fetchApi(`/communities/${communityId}/reports`);
  }
};
