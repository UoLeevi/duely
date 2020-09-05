import { Machine, assign, sendParent } from 'xstate';
import { query } from '../apollo';

export const profileMachine = Machine({
  id: 'profile',
  initial: 'loadingProfile',
  context: {
    profile: undefined
  },
  states: {
    loadingProfile: {
      invoke: {
        src: 'queryProfile',
        onDone: [
          { target: 'ready', actions: ['assignProfile'] }
        ]
      },
      exit: sendParent((context, event) => {
        debugger;
        return {
          ...event,
          type: 'NAVIGATION_CONFIRMED'
        };
      })
    },
    ready: {
      enter: sendParent((context, event) => {
        debugger;
        return {
          ...event,
          type: 'NAVIGATION_READY'
        };
      })
    },
    overview: {},
    agencies: {}
  }
}, {
  actions: {
    assignProfile: assign({ profile: (context, { data }) => data })
  },
  services: {
    queryProfile: () => query('profile'),
  }
});
