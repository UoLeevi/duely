import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { client } from '@/apollo';

Vue.use(VueApollo)

const apolloProvider = new VueApollo({
  defaultClient: client,
});

export default apolloProvider;
