import {UserObject} from '../objects/user.object';
import {HelperService} from '../services/helper.service';
import {AuthService} from '../services/auth.service';

export class AuthRoute {
  endpoint = '/auth';

  disabled = ['post', 'put', 'delete'];

  errors = {
    'auth/invalid-input': 'Invalid input.',
    'auth/invalid-token': 'Invalid token.',
    'auth/invalid-email': 'Invalid email.',
    'auth/invalid-password': 'Invalid password.',
    'auth/user-exists': 'User already exists.',
    'auth/user-not-exists': 'No user.',
  };

  constructor(
    private helperService: HelperService,
    private authService: AuthService
  ) {}

  /**
   * Create new account
   */
  put(req: {
    body: {
      email?: string;
      password?: string;
    };
  }) {
    const {email, password} = req.body;
    let user: UserObject;
    if (!email && !password) {
      user = this.authService.getUserAnonymously();
    } else {
      if (!this.helperService.isValidEmail(email as string)) {
        throw new Error('auth/invalid-email');
      }
      if (!this.authService.isValidPassword(password as string)) {
        throw new Error('auth/invalid-password');
      }
      user = this.authService.getUserByEmailAndPassword(
        email as string,
        password as string
      );
    }
    // check if user exists
    const {isNewUser} = user.getInfo();
    if (!isNewUser) {
      throw new Error('auth/user-exists');
    }
    // result
    user.setlastLogin().save(); // update last login
    const {refreshToken} = user.getData();
    return {
      info: user.getInfo(),
      idToken: user.getIdToken(),
      refreshToken,
    };
  }

  /**
   * Log a user in
   */
  post(req: {
    body: {
      email?: string;
      password?: string;
      customToken?: string;
      offlineAccess?: boolean;
    };
  }) {
    const {email, password, customToken, offlineAccess = false} = req.body;
    // get user
    let user: UserObject | undefined;
    if (!email && !customToken) {
      throw new Error('auth/invalid-input');
    } else if (customToken) {
      user = this.authService.getUserByCustomToken(customToken);
    } else if (email) {
      if (!this.helperService.isValidEmail(email)) {
        throw new Error('auth/invalid-email');
      }
      if (!password || !this.authService.isValidPassword(password)) {
        throw new Error('auth/invalid-password');
      }
      user = this.authService.getUserByEmailAndPassword(email, password);
    }

    // no user
    if (!user || user.getInfo().isNewUser) {
      throw new Error('auth/user-not-exists');
    }

    // result
    user.setlastLogin().save(); // update last login
    const response = {
      info: user.getInfo(),
      idToken: user.getIdToken(),
    } as Record<string, unknown>;
    if (offlineAccess) {
      const {refreshToken} = user.getData();
      response.refreshToken = refreshToken;
    }
    return response;
  }

  // TODO: may add signInWithPopup

  // TODO: may add signInWithEmailLink

  /**
   * Logout or delete account
   */
  delete(req: {
    body: {
      cancelAccount?: boolean;
      refreshToken?: string;
    };
    data: {
      user: UserObject;
    };
  }) {
    const {cancelAccount, refreshToken} = req.body;
    const {user} = req.data;
    if (cancelAccount && refreshToken) {
      const {refreshToken: userRefreshToken} = user.getData();
      if (refreshToken === userRefreshToken) {
        user.delete(); // delete
      }
    } else {
      user.setRefreshToken().save(); // new refresh token
    }
  }
}
