import Vue from 'vue';
import { client } from '@/apollo';

export default {
  data() {
    return {
      watchQuery: null,
      graph: {
        ready: Promise.resolve(),
        loading: true,
        error: null
      }
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
      this.graph.error = error;
      this.graph.loading = loading;
      for (const key in data)
        if (data.hasOwnProperty(key))
          Vue.set(this.graph, key, data[key]);
    });

    this.$options.destroyed = [
      client.onClearStore(observable.refetch.bind(observable)),
      subscription.unsubscribe.bind(subscription)
    ];

    try {
      await (this.graph.ready = observable.result);
    } catch (e) {
      this.graph.error = e;
      this.graph.loading = false;
    }
  }
};
