import {User} from '@sheetbase/models';
import {MailService} from '@sheetbase/mail';

import {OptionService} from './option.service';

export class OobService {
  constructor(
    private mailService: MailService,
    private optionService: OptionService
  ) {}

  getUrl(mode: string, code: string) {
    const {oobUrl} = this.optionService.getOptions();
    // eslint-disable-next-line no-undef
    const defautlUrl = ScriptApp.getService().getUrl() + '?e=auth/action';
    const defaultParams = `mode=${mode}&oobCode=${code}`;
    if (!oobUrl) {
      return defautlUrl + '&' + defaultParams;
    } else if (typeof oobUrl === 'string') {
      return oobUrl + '?' + defaultParams;
    } else {
      return oobUrl(mode, code, defautlUrl);
    }
  }

  getSubject(mode: string, defaultSubject: string) {
    const {oobSubject} = this.optionService.getOptions();
    if (!oobSubject) {
      return defaultSubject;
    } else {
      return oobSubject(mode);
    }
  }

  getBody(mode: string, url: string, userData: User, defaultBody: string) {
    const {oobBody} = this.optionService.getOptions();
    if (!oobBody) {
      return defaultBody;
    } else {
      return oobBody(mode, url, userData);
    }
  }

  sendPasswordResetEmail(userData: User) {
    const {email, displayName, oobCode, oobMode} = userData;
    if (!email || !oobMode || !oobCode) {
      throw new Error('No oob allowed.');
    }
    const oobUrl = this.getUrl(oobMode, oobCode);
    const subject = this.getSubject(oobMode, 'Reset your password');
    const htmlBody = this.getBody(
      oobMode,
      oobUrl,
      userData,
      `<p>Hello ${displayName || 'User'}!</p>
      <p>Here is your password reset link: <a href="${oobUrl}">${oobUrl}</a>.</p>
      <p>If you did not request for password reset, please ignore this email.</p>
      <p>Thank you!</p>`
    );
    return this.mailService.send(email, subject, {options: {htmlBody}}, 'oob');
  }

  sendEmailVerificationEmail(userData: User) {
    const {email, displayName, oobCode, oobMode} = userData;
    if (!email || !oobMode || !oobCode) {
      throw new Error('No oob allowed.');
    }
    const oobUrl = this.getUrl(oobMode, oobCode);
    const subject = this.getSubject(oobMode, 'Confirm your email');
    const htmlBody = this.getBody(
      oobMode,
      oobUrl,
      userData,
      `<p>Hello ${displayName || 'User'}!</p>
      <p>Click to confirm your email: <a href="${oobUrl}">${oobUrl}</a>.</p>
      <p>If you did not request for the action, please ignore this email.</p>
      <p>Thank you!</p>`
    );
    return this.mailService.send(email, subject, {options: {htmlBody}}, 'oob');
  }
}
