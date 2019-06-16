import Vue from 'vue';
import { client } from '@/apollo';

export default {
  data() {
    return {
      watchQuery: null,
      loading: true,
      error: null,
      graph: {},
    };
  },
  async created() {
    if (!this.watchQuery)
      return;

    const observable = client.watchQuery(
      typeof this.watchQuery === 'function' 
        ? this.watchQuery() 
        : this.watchQuery);

    const subscription = observable.subscribe(({ data, loading, error }) => {
      this.error = error;
      this.loading = loading;
      for (const key in data)
        if (data.hasOwnProperty(key))
          Vue.set(this.graph, key, data[key]);
    });

    this.$options.destroyed = [
      client.onClearStore(observable.refetch.bind(observable)),
      subscription.unsubscribe.bind(subscription)
    ];

    try {
      await observable.result;
    } catch (e) {
      this.error = e;
      this.loading = false;
    }
  }
};
