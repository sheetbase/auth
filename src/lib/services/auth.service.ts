import {DatabaseService, Filter} from '@sheetbase/database';
import {User, UserProfile, UserProviderId} from '@sheetbase/models';

import {UserObject} from '../objects/user.object';
import {HelperService} from './helper.service';
import {OauthService} from './oauth.service';
import {TokenService} from './token.service';

export class AuthService {
  constructor(
    private databaseService: DatabaseService,
    private helperService: HelperService,
    private tokenService: TokenService,
    private oauthService: OauthService
  ) {}

  private createUser(data: User) {
    return new UserObject(
      this.databaseService,
      this.helperService,
      this.tokenService,
      data
    );
  }

  getUser(finder: string | Filter<User>) {
    const userData = this.databaseService.item('users', finder);
    return userData ? this.createUser(userData) : null;
  }

  isUser(finder: string | Filter<User>) {
    return !!this.getUser(finder);
  }

  getUserByEmailAndPassword(email: string, password: string) {
    const user = this.getUser({email});
    if (!user) {
      const newUser: User = {
        uid: this.helperService.uniqueId(28, '1'),
        providerId: 'password',
        createdAt: new Date().toISOString(),
        isNewUser: true,
      };
      return this.createUser(newUser)
        .setEmail(email)
        .setPassword(password)
        .setRefreshToken();
    } else if (!!user && user.comparePassword(password)) {
      return user;
    } else {
      throw new Error('auth/no-user');
    }
  }

  getUserByCustomToken(customToken: string) {
    const payload = this.tokenService.decodeIdToken(customToken);
    if (payload) {
      const {uid, developerClaims: claims} = payload;
      const user = this.getUser(uid);
      if (!user) {
        const newUser: User = {
          uid,
          providerId: 'custom',
          createdAt: new Date().toISOString(),
          isNewUser: true,
        };
        if (claims) {
          newUser.claims = claims as Record<string, unknown>;
        }
        return this.createUser(newUser).setRefreshToken();
      } else {
        return user;
      }
    } else {
      throw new Error('auth/no-user');
    }
  }

  getUserAnonymously() {
    const newUser: User = {
      uid: this.helperService.uniqueId(28, '1'),
      providerId: 'anonymous',
      createdAt: new Date().toISOString(),
      isAnonymous: true,
      isNewUser: true,
    };
    return this.createUser(newUser).setRefreshToken();
  }

  getUserByIdToken(idToken: string) {
    const payload = this.tokenService.decodeIdToken(idToken);
    if (payload) {
      const {uid} = payload;
      const user = this.getUser(uid);
      if (user) {
        return user;
      } else {
        throw new Error('auth/no-user');
      }
    } else {
      throw new Error('auth/no-user');
    }
  }

  getUserByOobCode(oobCode: string) {
    const user = this.getUser({oobCode});
    if (user) {
      const {oobTimestamp} = user.getData();
      const beenMinutes = Math.round(
        (new Date().getTime() - (oobTimestamp as number)) / 60000
      );
      if (!!oobTimestamp && beenMinutes < 60) {
        return user;
      } else {
        throw new Error('auth/no-user');
      }
    } else {
      throw new Error('auth/no-user');
    }
  }

  getUserByRefreshToken(refreshToken: string) {
    const user = this.getUser({refreshToken});
    if (!user) {
      throw new Error('auth/no-user');
    }
    return user;
  }

  getUserByOauthProvider(providerId: UserProviderId, accessToken: string) {
    const userInfo: {
      id?: string;
      email?: string;
    } = this.oauthService.getUserInfo(providerId, accessToken);
    if (userInfo) {
      const {id, email} = userInfo;
      if (email) {
        // google, facebook
        const user = this.getUser({email});
        if (!user) {
          // extract profile from userinfo
          const userProfile = this.oauthService.processUserInfo(
            providerId,
            userInfo
          );
          // new user
          const newUser: User = {
            ...userProfile,
            uid: this.helperService.uniqueId(28, '1'),
            providerId,
            createdAt: new Date().toISOString(),
            emailVerified: true,
            isNewUser: true,
            additionalData: {id},
          };
          return this.createUser(newUser).setEmail(email).setRefreshToken();
        } else {
          if (user.getProvider().providerId === providerId) {
            return user;
          } else {
            throw new Error('auth/mismatch-provider');
          }
        }
      } else {
        throw new Error('auth/no-user');
      }
    } else {
      throw new Error('auth/no-user');
    }
  }

  getPublicUsers(uids: string | string[]): {[uid: string]: UserProfile} {
    // turn string into string[]
    if (typeof uids === 'string') {
      uids = [uids];
    }
    // get profiles
    const profiles = {} as Record<string, UserProfile>;
    for (let i = 0; i < uids.length; i++) {
      const uid = uids[i];
      const user = this.getUser(uid);
      if (user) {
        profiles[uid] = user.getPublicProfile();
      }
    }
    return profiles;
  }

  isValidPassword(password: string) {
    return password.length >= 7;
  }
}
