import { client } from '@/apollo';

const Vgraph = function () {
};

Vgraph.install = function (Vue, { watchQuery } = {}) {
  const vgraph = Vue.observable({
    ready: null,
    loading: true,
    error: null
  });

  if (process.env.NODE_ENV !== 'production')
    window.$vgraph = vgraph; // to ease debugging

  vgraph.ready = !watchQuery
    ? Promise.resolve()
    : new Promise(async resolve => {
      const observable = client.watchQuery(
        typeof watchQuery === 'function'
          ? watchQuery()
          : watchQuery);

      observable.subscribe(({ data, loading, error }) => {
        vgraph.error = error;
        vgraph.loading = loading;

        for (const key in data)
          if (data.hasOwnProperty(key))
            Vue.set(vgraph, key, data[key]);

        resolve();
      });

      client.onClearStore(observable.refetch.bind(observable))

      try {
        await observable.result;
      } catch (e) {
        this.graph.error = e;
        this.graph.loading = false;
      }
    });

  Vue.prototype.$vgraph = vgraph;
}

export default Vgraph;
