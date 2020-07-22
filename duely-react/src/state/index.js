import { Machine, assign, spawn } from 'xstate';
import { authMachine } from './auth';
import { profileMachine } from './profile';

export const appMachine = Machine({
  id: 'app',
  type: 'parallel',
  context: {
    authRef: null,
    profileRef: null,
    user: undefined
  },
  states: {
    auth: {
      entry: assign({
        authRef: () => spawn(authMachine, { sync: true })
      })
    },
    view: {
      initial: 'indeterminate',
      states: {
        indeterminate: {},
        profile: {
          entry: assign({
            profileRef: () => spawn(profileMachine, { sync: true })
          })
        }
      },
      on: {
        ENTER_PROFILE: { target: 'view.profile', cond: 'isLoggedIn' }
      }
    }
  },
  on: {
    USER_UPDATED: { actions: ['updateUser'] }
  }
}, {
  actions: {
    updateUser: assign({ user: (context, { user }) => user }),
  },
  guards: {
    isLoggedIn: (context) => context.user?.type === 'user',
  }
});
