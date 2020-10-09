import {OobService} from '../services/oob.service';
import {AuthService} from '../services/auth.service';

export class AuthOobRoute {
  endpoint = '/auth/oob';

  disabled = ['get', 'post', 'put'];

  constructor(
    private oobService: OobService,
    private authService: AuthService
  ) {}

  /**
   * Check an oob code
   */
  get(req: {
    query: {
      oobCode: string;
      mode: string;
    };
  }) {
    const {oobCode, mode} = req.query;
    if (oobCode) {
      const user = this.authService.getUserByOobCode(oobCode);
      const {email, oobMode} = user.getData();
      if (!!mode && !!oobMode && mode === oobMode) {
        const operations = {
          resetPassword: 'PASSWORD_RESET',
          verifyEmail: 'VERIFY_EMAIL',
        } as Record<string, string>;
        return {
          operation: operations[oobMode] || 'NONE',
          data: {email},
        };
      }
    }
    throw new Error('auth/invalid-input');
  }

  /**
   * Handle oob actions
   */
  post(req: {
    body: {
      oobCode: string;
      mode: string;
      newPassword?: string;
    };
  }) {
    const {mode, oobCode, newPassword = ''} = req.body;
    if (!!mode && !!oobCode) {
      const user = this.authService.getUserByOobCode(oobCode);
      const {oobMode} = user.getData();
      if (mode === oobMode) {
        // reset password
        if (mode === 'resetPassword') {
          if (this.authService.isValidPassword(newPassword)) {
            // validate password
            user
              .setPassword(newPassword)
              .setRefreshToken() // revoke current access
              .setOob() // revoke oob code
              .save();
          }
        }
        // verify email
        else if (mode === 'verifyEmail') {
          user.confirmEmail().save();
        }
      }
    }
    throw new Error('auth/invalid-input');
  }

  /**
   * Send oob emails
   */
  put(req: {
    body: {
      mode: string;
      email: string;
    };
  }) {
    const {mode, email} = req.body;
    if (!!mode && !!email) {
      const user = this.authService.getUser({email});
      if (user) {
        if (mode === 'resetPassword') {
          this.oobService.sendPasswordResetEmail(
            user.setOob(mode).save().getData()
          );
        } else if (mode === 'verifyEmail') {
          this.oobService.sendEmailVerificationEmail(
            user.setOob(mode).save().getData()
          );
        }
      }
    }
  }
}
