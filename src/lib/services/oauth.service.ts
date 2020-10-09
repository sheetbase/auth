import {UserProfile, UserProviderId} from '@sheetbase/models';

import {GoogleUserInfo, FacebookUserInfo} from '../types/auth.type';

export class OauthService {
  constructor() {}

  getUserInfo(providerId: UserProviderId, accessToken: string) {
    const url =
      providerId === 'google.com'
        ? 'https://www.googleapis.com/oauth2/v2/userinfo?access_token=' +
          accessToken
        : providerId === 'facebook.com'
        ? 'https://graph.facebook.com/me?fields=id,email,name,picture' +
          '&access_token=' +
          accessToken
        : undefined;
    if (!url) {
      throw new Error('Not supported oauth provider: ' + providerId);
    }
    // eslint-disable-next-line no-undef
    return JSON.parse(UrlFetchApp.fetch(url).getContentText('UTF-8'));
  }

  processUserInfo(providerId: UserProviderId, data: unknown): UserProfile {
    const profile: UserProfile = {};
    // extract data
    if (providerId === 'google.com') {
      const {name, link, picture} = data as GoogleUserInfo;
      profile.displayName = name;
      profile.url = link;
      profile.photoURL = picture as string;
    } else if (providerId === 'facebook.com') {
      const {name, picture} = data as FacebookUserInfo;
      profile.displayName = name;
      profile.photoURL =
        !!picture && !!(picture as Record<string, unknown>).data
          ? (picture as {data: {url?: string}}).data.url
          : '';
    }
    // return result
    return profile;
  }
}
