"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mutate = mutate;
exports.create_agency_M = exports.start_sign_up_M = exports.start_password_reset_M = exports.verify_sign_up_M = exports.verify_password_reset_M = exports.log_out_M = exports.log_in_M = void 0;

var _client = require("@apollo/client");

var _client2 = require("../apollo/client");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _templateObject7() {
  var data = _taggedTemplateLiteral(["\n    mutation($name: String!, $subdomain_name: String!, $country_code: String!, $return_url: String!) {\n      create_agency(name: $name, subdomain_name: $subdomain_name, country_code: $country_code, return_url: $return_url) {\n        stripe_verification_url\n        message\n        success\n        agency {\n          id\n        }\n      }\n    }\n  "]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral(["\n    mutation($email_address: String!, $password: String!, $name: String!, $redirect_url: String) {\n      start_sign_up(email_address: $email_address, password: $password, name: $name, redirect_url: $redirect_url) {\n        success\n        message\n      }\n    }\n  "]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function _templateObject5() {
  var data = _taggedTemplateLiteral(["\n    mutation($email_address: String!, $redirect_url: String) {\n      start_password_reset(email_address: $email_address, redirect_url: $redirect_url) {\n        success\n        message\n      }\n    }\n  "]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n    mutation($verification_code: String!) {\n      verify_sign_up(verification_code: $verification_code) {\n        success\n        message\n      }\n    }\n  "]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n    mutation($verification_code: String!, $password: String!) {\n      verify_password_reset(verification_code: $verification_code, password: $password) {\n        success\n        message\n      }\n    }\n  "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n    mutation {\n      log_out {\n        success\n        message\n      }\n    }\n  "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n    mutation($email_address: String!, $password: String!) {\n      log_in(email_address: $email_address, password: $password) {\n        success\n        message\n        jwt\n      }\n    }\n  "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// import produce from 'immer';
// import { query } from './queries';
// just a wrapper for convenience
function mutate(_x, _x2) {
  return _mutate.apply(this, arguments);
}

function _mutate() {
  _mutate = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(mutationDef, variables) {
    var result,
        after,
        defaultVariables,
        defaultOptions,
        _len,
        options,
        _key,
        _yield$client$mutate,
        data,
        res,
        _args3 = arguments;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            result = mutationDef.result, after = mutationDef.after, defaultVariables = mutationDef.variables, defaultOptions = _objectWithoutProperties(mutationDef, ["result", "after", "variables"]);
            variables = _objectSpread(_objectSpread({}, defaultVariables), variables);

            for (_len = _args3.length, options = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
              options[_key - 2] = _args3[_key];
            }

            _context3.next = 5;
            return _client2.client.mutate(_objectSpread(_objectSpread({
              variables: variables
            }, defaultOptions), options));

          case 5:
            _yield$client$mutate = _context3.sent;
            data = _yield$client$mutate.data;
            res = result(data);

            if (!after) {
              _context3.next = 11;
              break;
            }

            _context3.next = 11;
            return after(_client2.client.cache, res, variables);

          case 11:
            return _context3.abrupt("return", res);

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _mutate.apply(this, arguments);
}

var log_in_M = {
  mutation: (0, _client.gql)(_templateObject()),
  result: function result(d) {
    return d['log_in'];
  },
  after: function after(cache, result) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (result.success) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return");

            case 2:
              if (typeof window !== 'undefined') {
                localStorage.setItem('user-jwt', result.jwt);
              }

              _context.next = 5;
              return _client2.client.resetStore();

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  }
};
exports.log_in_M = log_in_M;
var log_out_M = {
  mutation: (0, _client.gql)(_templateObject2()),
  result: function result(d) {
    return d['log_out'];
  },
  after: function after(cache, result) {
    return _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (result.success) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt("return");

            case 2:
              if (typeof window !== 'undefined') {
                localStorage.removeItem('user-jwt');
              }

              _context2.next = 5;
              return _client2.client.resetStore();

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
  }
};
exports.log_out_M = log_out_M;
var verify_password_reset_M = {
  mutation: (0, _client.gql)(_templateObject3()),
  result: function result(d) {
    return d['verify_password_reset'];
  }
};
exports.verify_password_reset_M = verify_password_reset_M;
var verify_sign_up_M = {
  mutation: (0, _client.gql)(_templateObject4()),
  result: function result(d) {
    return d['verify_sign_up'];
  }
};
exports.verify_sign_up_M = verify_sign_up_M;
var start_password_reset_M = {
  mutation: (0, _client.gql)(_templateObject5()),
  result: function result(d) {
    return d['start_password_reset'];
  }
};
exports.start_password_reset_M = start_password_reset_M;
var start_sign_up_M = {
  mutation: (0, _client.gql)(_templateObject6()),
  result: function result(d) {
    return d['start_sign_up'];
  }
};
exports.start_sign_up_M = start_sign_up_M;
var create_agency_M = {
  mutation: (0, _client.gql)(_templateObject7()),
  result: function result(d) {
    return d['create_agency'];
  }
}; // createClient: {
//   mutation: gql`
//     mutation($agencyUuid: ID!, $name: String!, $emailAddress: String) {
//       createClient(agencyUuid: $agencyUuid, name: $name, emailAddress: $emailAddress) {
//         success
//         message
//         client {
//           uuid
//           name
//           emailAddress
//         }
//       }
//     }
//   `,
//   result: d => d['createClient'],
//   after(client, result, { agencyUuid }) {
//     if (!result.success) return;
//     const query = queries.clients.query;
//     const data = produce(client.readQuery({ query, variables: { agencyUuid } }), data => {
//       data.agency.clientsConnection.edges.push(result.client);
//     });
//     client.writeQuery({ query, data });
//   }
// },
// deleteClient: {
//   mutation: gql`
//     mutation($clientUuid: ID!) {
//       deleteClient(clientUuid: $clientUuid) {
//         success
//         message
//         uuid
//       }
//     }
//   `,
//   result: d => d['createAgency']
// },
// createService: {
//   mutation: gql`
//     mutation($agencyUuid: ID!, $name: String!) {
//       createService(agencyUuid: $agencyUuid, name: $name) {
//         success
//         message
//         service {
//           uuid
//           name
//           status
//         }
//       }
//     }
//   `,
//   result: d => d['createService'],
//   after(client, result, { agencyUuid }) {
//     if (!result.success) return;
//     const query = queries.services.query;
//     const data = produce(client.readQuery({ query, variables: { agencyUuid } }), data => {
//       data.agency.servicesConnection.edges.push(result.service);
//     });
//     client.writeQuery({ query, data });
//   }
// },
// deleteService: {
//   mutation: gql`
//     mutation($serviceUuid: ID!) {
//       deleteService(serviceUuid: $serviceUuid) {
//         success
//         message
//         uuid
//       }
//     }
//   `,
//   result: d => d['createAgency']
// },
// editImage: {
//   mutation: gql`
//     mutation($agencyUuid: ID!, $imageName: String!, $imageData: String!, $imageColor: String!) {
//       editImage(agencyUuid: $agencyUuid, imageName: $imageName, imageData: $imageData, imageColor: $imageColor) {
//         success
//         message
//         image {
//           uuid
//         }
//       }
//     }
//   `,
//   result: d => d['editImage']
// },
// };

exports.create_agency_M = create_agency_M;
//# sourceMappingURL=index.js.map