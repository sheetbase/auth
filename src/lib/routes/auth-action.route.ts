import {HelperService} from '../services/helper.service';
import {OobService} from '../services/oob.service';
import {AuthService} from '../services/auth.service';

export class AuthActionRoute {
  endpoint = '/auth/action';

  disabled = ['get', 'post'];

  constructor(
    private helperService: HelperService,
    private oobService: OobService,
    private authService: AuthService
  ) {}

  /**
   * Default oob ui
   */
  get(req: {
    query: {
      mode: string;
      oobCode: string;
    };
  }) {
    const {mode, oobCode} = req.query;
    if (!!mode && !!oobCode) {
      const user = this.authService.getUserByOobCode(oobCode);
      const {email, oobMode} = user.getData();
      if (mode === oobMode) {
        // reset password
        if (mode === 'resetPassword') {
          const url = this.oobService.getUrl(mode, oobCode);
          return this.helperService.htmlPage(
            `<style>
            .form input {
              display: block;
              width: 100%;
              max-width: 300px;
              padding: .25rem;
              border-radius: .25rem;
              margin: 1rem 0 0;
            }
            .form button {
              display: block;
              padding: .25rem;
              border-radius: .25rem;
              margin-top: 1rem;
            }
            .message {
              max-width: 300px;
              border: 1px solid black;
              padding: .5rem;
              border-radius: .25rem;
              margin-top: 1rem;
            }
            .message.error {
              border: 1px solid red;
              color: red;
            }
            .message.success {
              border: 1px solid green;
              color: green;
            }
          </style>

          <div id="app">
            <h1>Reset password</h1>
            <p>Reset your acccount password of <strong>${email}</strong>:</p>
            <div class="form">
              <input type="password" placeholder="New password" v-model="password" />
              <input type="password" placeholder="Repeat password" v-model="passwordConfirm" />
              <button v-on:click="resetPassword">Reset password</button>
            </div>
            <div class="message" v-bind:class="[messageClass]" v-if="message">{{ message }}</div>
          </div>

          <script src="https://cdn.jsdelivr.net/npm/vue"></script>
          <script>
            var app = new Vue({
              el: '#app',
              data: {
                password: '',
                passwordConfirm: '',
                message: '',
                messageClass: ''
              },
              methods: {
                resetPassword: async function () {
                  this.message = ''; // reset message
                  if (!this.password || this.password !== this.passwordConfirm) {
                    this.messageClass = 'error';
                    return this.message = 'Password mismatch!';
                  }
                  var response = await fetch('${url}', {
                    method: 'POST',
                    body: JSON.stringify({
                      mode: '${mode}',
                      oobCode: '${oobCode}',
                      newPassword: this.password,
                    }),
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
                    },
                  });
                  if (!response.ok) {
                    this.messageClass = 'error';
                    return this.message = 'Request failed.';
                  }
                  var result = await response.json();
                  if (result.error) {
                    this.messageClass = 'error';
                    return this.message = result.message;
                  } else {
                    this.messageClass = 'success';
                    return this.message = result.data.message;
                  }
                }
              }
            })
          </script>`
          );
        }

        // verify email
        else if (mode === 'verifyEmail') {
          // verify the email
          user.confirmEmail().save();
          return this.helperService.htmlPage(
            `<h1>Email confirmed</h1>
          <p>Your account email is now verified.</p>`
          );
        }
      }
    }
    return this.helperService.htmlPage(
      `<h1>Action failed</h1>
    <p>Invalid input.</p>`
    );
  }

  /**
   * Handle for oob action
   */
  post(req: {
    body: {
      mode: string;
      oobCode: string;
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
            return {
              message:
                'Your password has been updated, now you can login with new password.',
            };
          }
        }
      }
    }
    throw new Error('Action failed, invalid input.');
  }
}
