"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  client: true,
  useQuery: true
};
Object.defineProperty(exports, "client", {
  enumerable: true,
  get: function get() {
    return _client.client;
  }
});
Object.defineProperty(exports, "useQuery", {
  enumerable: true,
  get: function get() {
    return _hooks.useQuery;
  }
});

var _client = require("./apollo/client");

var _hooks = require("./hooks");

var _queries = require("./queries");

Object.keys(_queries).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _queries[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _queries[key];
    }
  });
});

var _mutations = require("./mutations");

Object.keys(_mutations).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _mutations[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _mutations[key];
    }
  });
});
//# sourceMappingURL=index.js.map