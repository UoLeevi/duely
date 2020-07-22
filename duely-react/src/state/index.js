import { Machine, assign, spawn } from 'xstate';
import { authMachine } from './auth';

export const appMachine = Machine({
  id: 'app',
  initial: 'init',
  context: {
    authRef: null
  },
  states: {
    init: {
      entry: assign({
        authRef: () => spawn(authMachine, { sync: true })
      })
    }
  }
}, {
  
});
