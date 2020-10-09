import {AuthService} from '../services/auth.service';

export class AuthPublicRoute {
  endpoint = '/auth/public';

  disabled = ['get'];

  constructor(private authService: AuthService) {}

  /**
   * Get user public profiles
   */
  get(req: {
    query: {
      uid?: string;
      uids?: string;
    };
  }) {
    const {uid, uids} = req.query;
    if (!uid && !uids) {
      throw new Error('auth/invalid-input');
    }
    return (() => {
      if (uid) {
        const {[uid]: profile} = this.authService.getPublicUsers(uid);
        return profile;
      } else {
        return this.authService.getPublicUsers(
          (uids as string).split(',').filter(Boolean)
        );
      }
    })();
  }
}
