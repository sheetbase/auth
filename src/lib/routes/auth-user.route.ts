import {UserEditableProfile} from '@sheetbase/models';

import {UserObject} from '../objects/user.object';
import {AuthService} from '../services/auth.service';

export class AuthUserRoute {
  endpoint = '/auth/user';

  disabled = ['get', 'patch'];

  constructor(private authService: AuthService) {}

  /**
   * Get auth user profile
   */
  get(req: {
    data: {
      user: UserObject;
    };
  }) {
    const {user} = req.data;
    return user.getInfo();
  }

  /**
   * Update auth user data
   */
  patch(req: {
    body: {
      profile?: UserEditableProfile;
      additionalData?: Record<string, unknown>;
      settings?: Record<string, unknown>;
      publicly?: string | string[];
      privately?: string | string[];
      username?: string;
      currentPassword?: string;
      newPassword?: string;
    };
    data: {
      user: UserObject;
    };
  }) {
    const {user} = req.data;
    const {
      profile,
      additionalData,
      settings,
      publicly,
      privately,
      username,
      currentPassword,
      newPassword,
    } = req.body;
    if (profile) {
      return user.updateProfile(profile).save().getInfo();
    } else if (additionalData) {
      return user.setAdditionalData(additionalData).save().getInfo();
    } else if (settings) {
      return user.setSettings(settings).save().getInfo();
    } else if (publicly) {
      return user.setProfilePublicly(publicly).save().getInfo();
    } else if (privately) {
      return user.setProfilePrivately(privately).save().getInfo();
    } else if (!!username && !this.authService.isUser({username})) {
      return user.setUsername(username).save().getInfo();
    } else if (
      currentPassword &&
      newPassword &&
      this.authService.isValidPassword(newPassword) &&
      user.comparePassword(currentPassword)
    ) {
      return user.setPassword(newPassword).save().getInfo();
    }
    // TODO: update email

    // TODO: update phoneNumber

    // TODO: update claims (or edit from spreadsheet)
    throw new Error('auth/invalid-input');
  }
}
