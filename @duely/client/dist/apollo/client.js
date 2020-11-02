"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.client = void 0;

var _client = require("@apollo/client");

var _ws = require("@apollo/client/link/ws");

var _context5 = require("@apollo/client/link/context");

var _error = require("@apollo/client/link/error");

var _utilities = require("@apollo/client/utilities");

var _subscriptionsTransportWs = require("subscriptions-transport-ws");

var _typePolicies = _interopRequireDefault(require("./typePolicies"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n              mutation($email_address: String!, $password: String!) {\n                log_in(email_address: $email_address, password: $password) {\n                  success\n                  message\n                  jwt\n                }\n              }\n            "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n        mutation {\n          begin_visit {\n            success\n            message\n            jwt\n          }\n        }\n      "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var endpoint = 'api.duely.app/graphql';
var url_http = "https://".concat(endpoint);
var url_ws = "wss://".concat(endpoint);
var ssrMode = typeof window === 'undefined';
var getResolvedAccessToken = ssrMode ? function () {
  return null;
} : function () {
  var _localStorage, _localStorage2;

  return ((_localStorage = localStorage) === null || _localStorage === void 0 ? void 0 : _localStorage.getItem('user-jwt')) || ((_localStorage2 = localStorage) === null || _localStorage2 === void 0 ? void 0 : _localStorage2.getItem('visitor-jwt'));
};
var cache = new _client.InMemoryCache({
  typePolicies: _typePolicies.default
});
var httpLink = new _client.HttpLink({
  uri: url_http
});
var getAccessTokenPromise = null;

function getAccessToken() {
  return _getAccessToken.apply(this, arguments);
}

function _getAccessToken() {
  _getAccessToken = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var token;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            token = getResolvedAccessToken();

            if (!token) {
              _context4.next = 3;
              break;
            }

            return _context4.abrupt("return", token);

          case 3:
            if (!getAccessTokenPromise) {
              getAccessTokenPromise = (0, _client.toPromise)(_client.ApolloLink.execute(httpLink, {
                query: (0, _client.gql)(_templateObject())
              })).then( /*#__PURE__*/function () {
                var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(_ref5) {
                  var data, visit_jwt, _yield$toPromise, _data;

                  return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                      switch (_context3.prev = _context3.next) {
                        case 0:
                          data = _ref5.data;

                          if (!data.begin_visit.success) {
                            _context3.next = 14;
                            break;
                          }

                          visit_jwt = data.begin_visit.jwt;

                          if (!ssrMode) {
                            _context3.next = 11;
                            break;
                          }

                          _context3.next = 6;
                          return (0, _client.toPromise)(_client.ApolloLink.execute(httpLink, {
                            query: (0, _client.gql)(_templateObject2()),
                            variables: {
                              email_address: 'serviceaccount@duely.app',
                              password: process.env.DUELY_SERVICE_ACCOUNT_PASSWORD
                            },
                            context: {
                              headers: {
                                authorization: "Bearer ".concat(visit_jwt)
                              }
                            }
                          }));

                        case 6:
                          _yield$toPromise = _context3.sent;
                          _data = _yield$toPromise.data;

                          if (_data.log_in.success) {
                            token = _data.log_in.jwt;

                            getResolvedAccessToken = function getResolvedAccessToken() {
                              return token;
                            };
                          } else {
                            // eslint-disable-next-line
                            console.error(_data.log_in.message);
                          }

                          _context3.next = 12;
                          break;

                        case 11:
                          localStorage.setItem('visitor-jwt', visit_jwt);

                        case 12:
                          _context3.next = 15;
                          break;

                        case 14:
                          throw Error(data.begin_visit.message);

                        case 15:
                        case "end":
                          return _context3.stop();
                      }
                    }
                  }, _callee3);
                }));

                return function (_x3) {
                  return _ref6.apply(this, arguments);
                };
              }());
            }

            _context4.next = 6;
            return getAccessTokenPromise;

          case 6:
            return _context4.abrupt("return", getResolvedAccessToken());

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _getAccessToken.apply(this, arguments);
}

var wsClient = null;
var transportLink = createTransportLink();

function createTransportLink() {
  if (ssrMode) return httpLink;
  wsClient = new _subscriptionsTransportWs.SubscriptionClient(url_ws, {
    reconnect: true,
    lazy: true,
    connectionParams: function () {
      var _connectionParams = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var token;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return getAccessToken();

              case 2:
                token = _context.sent;
                return _context.abrupt("return", token ? {
                  authorization: "Bearer ".concat(token)
                } : {});

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function connectionParams() {
        return _connectionParams.apply(this, arguments);
      }

      return connectionParams;
    }()
  });
  var wsLink = new _ws.WebSocketLink(wsClient);
  return _client.ApolloLink.split( // split based on operation type
  function (_ref) {
    var query = _ref.query;
    var definition = (0, _utilities.getMainDefinition)(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  }, wsLink, httpLink);
}

var authLink = (0, _context5.setContext)( /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, _ref2) {
    var headers, token;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            headers = _ref2.headers;
            _context2.next = 3;
            return getAccessToken();

          case 3:
            token = _context2.sent;
            return _context2.abrupt("return", token ? {
              headers: _objectSpread(_objectSpread({}, headers), {}, {
                authorization: "Bearer ".concat(token)
              })
            } : {});

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x, _x2) {
    return _ref3.apply(this, arguments);
  };
}());
var errorLink = (0, _error.onError)(function (_ref4) {
  var graphQLErrors = _ref4.graphQLErrors,
      networkError = _ref4.networkError,
      operation = _ref4.operation,
      forward = _ref4.forward;

  if (graphQLErrors) {
    var _iterator = _createForOfIteratorHelper(graphQLErrors),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var err = _step.value;
        console.log(err);

        switch (err.extensions.code) {
          case 'UNAUTHENTICATED':
            // error code is set to UNAUTHENTICATED
            // when AuthenticationError thrown in resolver
            if (!ssrMode) {
              // reset access tokens
              localStorage.removeItem('user-jwt');
              localStorage.removeItem('visitor-jwt');
            } // retry the request, returning the new observable


            return forward(operation);

          default:
            break;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }

  if (networkError) {
    throw Error("[Network error]: ".concat(networkError));
  }
});
var client = new _client.ApolloClient({
  ssrMode: ssrMode,
  link: _client.ApolloLink.from([errorLink, authLink, transportLink]),
  cache: cache,
  connectToDevTools: process.env.NODE_ENV !== 'production'
});
exports.client = client;
client.onClearStore(function () {
  var _wsClient, _wsClient2;

  // Close socket connection which will also unregister subscriptions on the server-side.
  (_wsClient = wsClient) === null || _wsClient === void 0 ? void 0 : _wsClient.close(); // Reconnect to the server.

  (_wsClient2 = wsClient) === null || _wsClient2 === void 0 ? void 0 : _wsClient2.connect();
});
//# sourceMappingURL=client.js.map