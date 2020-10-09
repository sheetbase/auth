import {AuthService} from '../services/auth.service';

export class AuthTokenRoute {
  endpoint = '/auth/token';

  disabled = ['get'];

  constructor(private authService: AuthService) {}

  /**
   * exchange the refresh token for a new id token
   */
  get(req: {
    query: {
      refreshToken: string;
    };
  }) {
    const {refreshToken} = req.query;
    if (refreshToken) {
      const user = this.authService.getUserByRefreshToken(refreshToken);
      return {idToken: user.getIdToken()};
    }
    throw new Error('auth/invalid-input');
  }
}
