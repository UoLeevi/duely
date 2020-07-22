import { Machine, assign, sendParent } from 'xstate';
import { client, query, mutate } from '../apollo';

export const authMachine = Machine({
  id: 'auth',
  initial: 'loadingUser',
  context: {
    user: undefined
  },
  states: {
    loadingUser: {
      invoke: {
        src: 'queryMe',
        onDone: [
          { target: 'loggedIn', cond: 'isUser', actions: ['updateUser', 'notifyUserUpdated'] },
          { target: 'visitor', cond: 'isVisitor', actions: ['updateUser', 'notifyUserUpdated'] }
        ]
      }
    },
    visitor: {
      initial: 'idle',
      states: {
        idle: {},
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
          }
        },
        startPasswordResetFailed: {
          after: {
            4000: 'idle'
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
          }
        },
        startSignUpFailed: {
          after: {
            4000: 'idle'
          }
        },
        verifyPasswordResetLoading: {
          invoke: {
            src: 'verifyPasswordReset',
            onDone: [
              { target: '#auth.updateAccessToken', cond: 'isMutationSuccessful' },
              { target: 'verifyPasswordResetFailed' }
            ],
            onError: {
              target: 'verifyPasswordResetFailed'
            }
          }
        },
        verifyPasswordResetFailed: {
          after: {
            4000: 'idle'
          }
        },
        verifySignUpLoading: {
          invoke: {
            src: 'verifySignUp',
            onDone: [
              { target: '#auth.updateAccessToken', cond: 'isMutationSuccessful' },
              { target: 'verifySignUpFailed' }
            ],
            onError: {
              target: 'verifySignUpFailed'
            }
          }
        },
        verifySignUpFailed: {
          after: {
            4000: 'idle'
          }
        }
      },
      on: {
        LOG_IN: '.logInLoading',
        START_PASSWORD_RESET: '.startPasswordResetLoading',
        START_SIGN_UP: '.startSignUpLoading',
        VERIFY_PASSWORD_RESET: '.verifyPasswordResetLoading',
        VERIFY_SIGN_UP: '.verifySignUpLoading'
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
    queryMe: async () => query('me'),
    logIn: async (context, { emailAddress, password }) => await mutate('logIn', { emailAddress, password }),
    logOut: async () => await mutate('logOut'),
    startPasswordReset: async (context, { emailAddress, redirectUrl }) => await mutate('startPasswordReset', { emailAddress, redirectUrl }),
    startSignUp: async (context, { emailAddress, name, password, redirectUrl }) => await mutate('startSignUp', { emailAddress, name, password, redirectUrl }),
    verifyPasswordReset: async (context, { verificationCode, password }) => await mutate('verifyPasswordReset', { verificationCode, password }),
    verifySignUp: async (context, { verificationCode }) => await mutate('verifySignUp', { verificationCode }),
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
    isUser: (context, { data }) => data.type === 'user',
    isVisitor: (context, { data }) => data.type === 'visitor'
  }
});
