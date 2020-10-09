import {User} from '@sheetbase/models';

import {AuthData, AuthPayload} from '../types/auth.type';
import {OptionService} from './option.service';
import {HelperService} from './helper.service';

export class TokenService {
  constructor(
    private optionService: OptionService,
    private helperService: HelperService
  ) {}

  sign(data: AuthData): string {
    const {encryptionSecret} = this.optionService.getOptions();
    return this.helperService.signJWT(data, encryptionSecret);
  }

  signIdToken(userData: User) {
    const {uid, email, claims = {}} = userData;
    if (!uid || !email) {
      throw new Error('No uid or email');
    }
    return this.sign({...claims, uid, sub: email, tty: 'ID'});
  }

  decode(token: string, additionalChecks?: Record<string, unknown>) {
    // check validation
    const {encryptionSecret} = this.optionService.getOptions();
    let valid = !!this.helperService.verifyJWT(token, encryptionSecret);
    // extract the payload
    let payload: AuthPayload | undefined;
    if (valid) {
      const {payloadObj} = this.helperService.parseJWT(token);
      payload = payloadObj;
      // check additionalChecks
      if (additionalChecks) {
        for (const key of Object.keys(additionalChecks)) {
          const value = (payload as AuthPayload)[key];
          const checkingValue = additionalChecks[key];
          if (!value || value !== checkingValue) {
            valid = false;
            break;
          }
        }
      }
    }
    return valid ? payload : null;
  }

  decodeIdToken(token: string) {
    return this.decode(token, {tty: 'ID'});
  }

  decodeCustomToken(token: string) {
    return this.decode(token, {tty: 'CUSTOM'});
  }
}
