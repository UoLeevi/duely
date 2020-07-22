import { Machine, assign } from 'xstate';
import { query, mutate } from '../apollo';

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
      }
    },
    ready: {},
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
