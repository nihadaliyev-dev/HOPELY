import { fetchApi, USE_MOCK, delay } from './apiClient';

// Fallback mock communities if API is unavailable
const mockCommunities = [
  { id: '1', name: 'PulseCheck HQ', platform: 'Discord', memberCount: 1450, icon: 'https://ui-avatars.com/api/?name=PHQ&background=5865F2&color=fff' },
  { id: '2', name: 'React Devs Alliance', platform: 'Slack', memberCount: 8400, icon: 'https://ui-avatars.com/api/?name=RDA&background=E11D48&color=fff' },
  { id: '3', name: 'Web3 Builders', platform: 'Telegram', memberCount: 3200, icon: 'https://ui-avatars.com/api/?name=W3B&background=0284C7&color=fff' }
];

export const communityService = {
  async getCommunities() {
    if (USE_MOCK) {
      await delay(600);
      return mockCommunities;
    }
    return fetchApi('/communities');
  }
};
