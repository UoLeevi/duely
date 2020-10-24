import { Machine, assign, sendParent } from 'xstate';
import { client, query, mutate } from 'apollo';

export const authMachine = Machine({
  id: 'auth',
  context: {
    user: undefined
  },
  initial: 'loadingUser',
  states: {
    loadingUser: {
      invoke: {
        src: 'queryCurrentUser',
        onDone: [
          { target: 'loggedIn', cond: 'isUser', actions: ['updateUser', 'notifyUserUpdated'] },
          { target: 'visitor', cond: 'isVisitor', actions: ['updateUser', 'notifyUserUpdated'] }
        ]
      }
    },
    visitor: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            LOG_IN: 'logInLoading',
            START_PASSWORD_RESET: 'startPasswordResetLoading',
            START_SIGN_UP: 'startSignUpLoading',
            VERIFY_PASSWORD_RESET: 'verifyPasswordResetLoading',
            VERIFY_SIGN_UP: 'verifySignUpLoading'
          }
        },
        logInLoading: {
          invoke: {
            src: 'logIn',
            onDone: [
              { target: '#auth.updateAccessToken', cond: 'isMutationSuccessful' },
              { target: 'logInFailed' }
            ],
            onError: {
              target: 'logInFailed'
            }
          }
        },
        logInFailed: {
          after: {
            4000: 'idle'
          },
          on: {
            CONTINUE: 'idle'
          }
        },
        startPasswordResetLoading: {
          invoke: {
            src: 'startPasswordReset',
            onDone: [
              { target: 'startPasswordResetCompleted', cond: 'isMutationSuccessful' },
              { target: 'startPasswordResetFailed' }
            ],
            onError: {
              target: 'startPasswordResetFailed'
            }
          }
        },
        startPasswordResetCompleted: {
          after: {
            60000: 'idle'
          },
          on: {
            CONTINUE: 'idle'
          }
        },
        startPasswordResetFailed: {
          after: {
            4000: 'idle'
          },
          on: {
            CONTINUE: 'idle'
          }
        },
        startSignUpLoading: {
          invoke: {
            src: 'startSignUp',
            onDone: [
              { target: 'startSignUpCompleted', cond: 'isMutationSuccessful' },
              { target: 'startSignUpFailed' }
            ],
            onError: {
              target: 'startSignUpFailed'
            }
          }
        },
        startSignUpCompleted: {
          after: {
            60000: 'idle'
          },
          on: {
            CONTINUE: 'idle'
          }
        },
        startSignUpFailed: {
          after: {
            4000: 'idle'
          },
          on: {
            CONTINUE: 'idle'
          }
        },
        verifyPasswordResetLoading: {
          invoke: {
            src: 'verifyPasswordReset',
            onDone: [
              { target: 'verifyPasswordResetCompleted', cond: 'isMutationSuccessful' },
              { target: 'verifyPasswordResetFailed' }
            ],
            onError: {
              target: 'verifyPasswordResetFailed'
            }
          }
        },
        verifyPasswordResetCompleted: {
          after: {
            60000: 'idle'
          },
          on: {
            CONTINUE: 'idle'
          }
        },
        verifyPasswordResetFailed: {
          after: {
            4000: 'idle'
          },
          on: {
            CONTINUE: 'idle'
          }
        },
        verifySignUpLoading: {
          invoke: {
            src: 'verifySignUp',
            onDone: [
              { target: 'verifySignUpCompleted', cond: 'isMutationSuccessful' },
              { target: 'verifySignUpFailed' }
            ],
            onError: {
              target: 'verifySignUpFailed'
            }
          }
        },
        verifySignUpCompleted: {
          after: {
            60000: 'idle'
          },
          on: {
            CONTINUE: 'idle'
          }
        },
        verifySignUpFailed: {
          after: {
            4000: 'idle'
          },
          on: {
            CONTINUE: 'idle'
          }
        }
      }
    },
    loggedIn: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            LOG_OUT: 'logOutLoading'
          },
        },
        logOutLoading: {
          invoke: {
            src: 'logOut',
            onDone: [
              { target: '#auth.updateAccessToken', cond: 'isMutationSuccessful' },
              { target: 'logOutFailed' }
            ],
            onError: {
              target: 'logOutFailed'
            }
          }
        },
        logOutFailed: {
          on: {
            CONTINUE: 'idle',
            LOG_OUT: 'logOutLoading'
          }, 
          after: {
            4000: 'idle'
          }
        }
      },
    },
    updateAccessToken: {
      invoke: {
        src: 'updateAccessToken',
        onDone: { target: 'loadingUser' }
      }
    }
  }
}, {
  actions: {
    updateUser: assign({ user: (context, { data }) => data }),
    notifyUserUpdated: sendParent((context, event) => ({ ...context, type: 'USER_UPDATED' }))
  },
  services: {
    queryCurrentUser: async () => query('current_user'),
    logIn: async (context, { email_address, password }) => await mutate('log_in', { email_address, password }),
    logOut: async () => await mutate('log_out'),
    startPasswordReset: async (context, { email_address, redirect_url }) => await mutate('start_password_reset', { email_address, redirect_url }),
    startSignUp: async (context, { email_address, name, password, redirect_url }) => await mutate('start_sign_up', { email_address, name, password, redirect_url }),
    verifyPasswordReset: async (context, { verification_code, password }) => await mutate('verify_password_reset', { verification_code, password }),
    verifySignUp: async (context, { verification_code }) => await mutate('verify_sign_up', { verification_code }),
    updateAccessToken: async (context, { data }) => {
      if (data?.jwt) {
        localStorage.setItem('user-jwt', data.jwt);
      } else {
        localStorage.removeItem('user-jwt');
      }

      await client.clearStore(); // TODO: is this required in log in?
    }
  },
  guards: {
    isMutationSuccessful: (context, { data }) => data.success,
    isUser: (context, { data }) => data?.id != null,
    isVisitor: (context, { data }) => data?.id == null
  }
});
