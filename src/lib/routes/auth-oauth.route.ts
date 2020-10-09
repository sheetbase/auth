import {UserProviderId} from '@sheetbase/models';
import {AuthService} from '../services/auth.service';

export class AuthOauthRoute {
  endpoint = '/auth/oauth';

  disabled = ['get'];

  constructor(private authService: AuthService) {}

  /**
   * Get oauth user profile
   */
  get(req: {
    query: {
      providerId: UserProviderId;
      accessToken: string;
    };
  }) {
    const {providerId, accessToken} = req.query;
    if (!providerId || !accessToken) {
      throw new Error('auth/no-data');
    }
    const user = this.authService.getUserByOauthProvider(
      providerId,
      accessToken
    );
    // result
    user.setlastLogin().save(); // update last login
    const {refreshToken} = user.getData();
    return {
      info: user.getInfo(),
      idToken: user.getIdToken(),
      refreshToken,
    };
  }
}
