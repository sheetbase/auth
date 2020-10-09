import {
  User,
  UserInfo,
  UserEditableProfile,
  UserOobMode,
  UserProfile,
} from '@sheetbase/models';
import {DatabaseService} from '@sheetbase/database';

import {HelperService} from '../services/helper.service';
import {TokenService} from '../services/token.service';

export class UserObject {
  private data: User;

  constructor(
    private databaseService: DatabaseService,
    private helperService: HelperService,
    private tokenService: TokenService,
    data: User
  ) {
    this.data = data;
  }

  getData() {
    return this.data;
  }

  getInfo(): UserInfo {
    const {
      uid,
      providerId,
      email,
      emailVerified = false,
      type,
      createdAt,
      lastLogin,
      username,
      phoneNumber,
      displayName,
      photoURL,
      bio,
      url,
      addresses,
      additionalData,
      claims,
      settings,
      isNewUser = false,
    } = this.getData();
    return {
      uid,
      providerId,
      email,
      emailVerified,
      type,
      createdAt,
      lastLogin,
      username,
      phoneNumber,
      displayName,
      photoURL,
      bio,
      url,
      addresses,
      additionalData,
      claims,
      settings,
      isAnonymous: !email && providerId === 'anonymous' ? true : false,
      isNewUser,
    };
  }

  getIdToken() {
    return this.tokenService.signIdToken(this.data);
  }

  comparePassword(password: string) {
    const {uid, password: currentPasswordSecure} = this.data;
    const passwordSecure = this.helperService.sha256((uid || '') + password);
    return passwordSecure === currentPasswordSecure;
  }

  getProvider() {
    const {providerId} = this.data;
    return {providerId};
  }

  getProfile(): UserProfile {
    const {
      uid,
      email,
      type,
      createdAt,
      phoneNumber,
      displayName,
      photoURL,
      bio,
      url,
      addresses,
      additionalData,
      claims,
    } = this.data;
    const profile = {
      uid,
      email,
      type,
      createdAt,
      phoneNumber,
      displayName,
      photoURL,
      bio,
      url,
      addresses,
      additionalData,
      claims,
    };
    // clear empty field
    for (const key of Object.keys(profile)) {
      if (!(profile as Record<string, unknown>)[key]) {
        delete (profile as Record<string, unknown>)[key];
      }
    }
    return profile;
  }

  getPublicProfile(): UserProfile {
    const profile = this.getProfile();
    const {settings = {}} = this.data;
    // remove private profile
    if (!settings.$email) {
      delete profile.email;
    }
    if (!settings.$phoneNumber) {
      delete profile.phoneNumber;
    }
    if (!settings.$addresses) {
      delete profile.addresses;
    }
    if (!settings.$type) {
      delete profile.type;
    }
    // remove private addional data
    const {additionalData} = profile;
    if (!!additionalData && additionalData instanceof Object) {
      for (const key of Object.keys(additionalData)) {
        if (!settings['$' + key]) {
          delete (additionalData as Record<string, unknown>)[key];
        }
      }
      // set it back
      profile.additionalData = additionalData;
    }
    // clear empty field
    for (const key of Object.keys(profile)) {
      if (!(profile as Record<string, unknown>)[key]) {
        delete (profile as Record<string, unknown>)[key];
      }
    }
    return profile;
  }

  updateProfile(data: UserEditableProfile) {
    const allowedFields = [
      'displayName',
      'photoURL',
      'bio',
      'url',
      'addresses',
    ];
    const profile = {} as Record<string, unknown>;
    for (let i = 0; i < allowedFields.length; i++) {
      const field = allowedFields[i];
      if ((data as Record<string, unknown>)[field]) {
        profile[field] = (data as Record<string, unknown>)[field];
      }
    }
    // apply
    this.data = {...this.data, ...profile};
    return this as UserObject;
  }

  setAdditionalData(data: Record<string, unknown>) {
    this.data.additionalData = {
      ...((this.data.additionalData as Record<string, unknown>) || {}),
      ...data,
    };
    return this as UserObject;
  }

  setSettings(data: Record<string, unknown>) {
    this.data.settings = {...this.data.settings, ...data};
    return this as UserObject;
  }

  setProfilePublicly(props: string | string[]) {
    const {settings = {}} = this.data;
    // turn string to string[]
    if (typeof props === 'string') {
      props = [props];
    }
    // set props
    for (let i = 0; i < props.length; i++) {
      settings['$' + props[i]] = true;
    }
    // set it back
    this.data.settings = settings;
    return this as UserObject;
  }

  setProfilePrivately(props: string | string[]) {
    const {settings} = this.data;
    if (!!settings && settings instanceof Object) {
      // turn string to string[]
      if (typeof props === 'string') {
        props = [props];
      }
      // set props
      for (let i = 0; i < props.length; i++) {
        delete settings['$' + props[i]];
      }
      // set it back
      this.data.settings = settings;
    }
    return this as UserObject;
  }

  updateClaims(claims: Record<string, unknown>) {
    this.data.claims = {...this.data.claims, ...claims};
    return this as UserObject;
  }

  setlastLogin() {
    this.data.lastLogin = new Date().toISOString();
    return this as UserObject;
  }

  setEmail(email: string) {
    this.data.email = email;
    return this as UserObject;
  }

  confirmEmail() {
    this.data.emailVerified = true;
    return this as UserObject;
  }

  setPassword(password: string) {
    // TODO: implement bcrypt
    const {uid = ''} = this.data;
    this.data.password = this.helperService.sha256(uid + password);
    return this as UserObject;
  }

  setUsername(username: string) {
    this.data.username = username;
    return this as UserObject;
  }

  setPhoneNumber(phoneNumber: string) {
    this.data.phoneNumber = phoneNumber;
    return this as UserObject;
  }

  setOob(mode: UserOobMode = 'none') {
    const {uid} = this.data;
    // valid modes
    if (mode !== 'resetPassword' && mode !== 'verifyEmail') {
      mode = 'none';
    }
    // eslint-disable-next-line no-undef
    this.data.oobCode = this.helperService.sha256(uid + Utilities.getUuid());
    this.data.oobMode = mode;
    this.data.oobTimestamp = new Date().getTime();
    return this as UserObject;
  }

  setRefreshToken() {
    this.data.refreshToken = this.helperService.uniqueId(64, 'A');
    this.data.tokenTimestamp = new Date().getTime();
    return this as UserObject;
  }

  delete() {
    const {uid} = this.data;
    this.databaseService.remove('users', uid as string);
    return this as UserObject;
  }

  save() {
    const {uid} = this.data;
    if (uid) {
      this.databaseService.update('users', uid, this.data);
    } else {
      this.databaseService.add('users', uid as string, this.data);
    }
    return this as UserObject;
  }
}
