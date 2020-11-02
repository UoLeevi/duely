"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useQuery = useQuery;

var _client = require("@apollo/client");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function useQuery(queryDef, variables, options) {
  var query = queryDef.query,
      result = queryDef.result,
      defaultVariables = queryDef.variables,
      defaultOptions = _objectWithoutProperties(queryDef, ["query", "result", "variables"]);

  var _useApolloQuery = (0, _client.useQuery)(query, _objectSpread(_objectSpread({
    variables: _objectSpread(_objectSpread({}, defaultVariables), variables)
  }, defaultOptions), options)),
      rawData = _useApolloQuery.data,
      networkStatus = _useApolloQuery.networkStatus,
      initialLoading = _useApolloQuery.loading,
      rest = _objectWithoutProperties(_useApolloQuery, ["data", "networkStatus", "loading"]); // https://github.com/apollographql/apollo-client/blob/main/src/core/networkStatus.ts


  var loading = networkStatus ? networkStatus < 7 : initialLoading;
  var data = result(rawData);
  return _objectSpread({
    data: data,
    loading: loading,
    initialLoading: initialLoading
  }, rest);
}
//# sourceMappingURL=useQuery.js.map