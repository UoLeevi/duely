"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.query = query;
exports.agency_services_Q = exports.subdomain_public_Q = exports.current_user_agencies_Q = exports.agency_stripe_account_update_url_Q = exports.services_agreement_Q = exports.country_codes_Q = exports.current_user_Q = void 0;

var _client = require("@apollo/client");

var _client2 = require("../apollo/client");

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _templateObject7() {
  var data = _taggedTemplateLiteral(["\n    query($agency_id: ID!) {\n      services(filter: { agency_id: $agency_id }) {\n        id\n        name\n        url_name\n        default_variant {\n          id\n          name\n          description\n          duration\n          status\n          default_price {\n            id\n            name\n            unit_amount\n            currency\n            type\n            recurring_interval\n            recurring_interval_count\n          }\n        }\n      }\n    }\n  "]);

  _templateObject7 = function _templateObject7() {
    return data;
  };

  return data;
}

function _templateObject6() {
  var data = _taggedTemplateLiteral(["\n    query($subdomain_name: String!) {\n      subdomains(filter: { name: $subdomain_name }) {\n        id\n        name\n        agency {\n          id\n          name\n          theme {\n            id\n            image_logo {\n              id\n              data\n            }\n          }\n        }\n      }\n    }\n  "]);

  _templateObject6 = function _templateObject6() {
    return data;
  };

  return data;
}

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _templateObject5() {
  var data = _taggedTemplateLiteral(["\n    query {\n      current_user {\n        id\n        memberships {\n          id\n          access\n          subdomain {\n            id\n            name\n            agency {\n              id\n              name\n              theme {\n                id\n                image_logo {\n                  id\n                  data\n                }\n              }\n              stripe_account {\n                id\n                id_ext\n                business_profile {\n                  mcc\n                  name\n                  product_description\n                  support_address\n                  support_email\n                  support_phone\n                  support_url\n                  url\n                }\n                business_type\n                capabilities {\n                  card_payments\n                  transfers\n                }\n                requirements {\n                  current_deadline\n                  disabled_reason\n                  currently_due\n                  eventually_due\n                  past_due\n                  pending_verification\n                }\n                settings {\n                  branding {\n                    icon\n                    logo\n                    primary_color\n                    secondary_color\n                  }\n                }\n                charges_enabled\n                country\n                created\n                default_currency\n                details_submitted\n                email\n                payouts_enabled\n              }\n            }\n            memberships {\n              id\n              access\n              user {\n                id\n                name\n              }\n            }\n          }\n          user {\n            id\n          }\n        }\n      }\n    }\n  "]);

  _templateObject5 = function _templateObject5() {
    return data;
  };

  return data;
}

function _templateObject4() {
  var data = _taggedTemplateLiteral(["\n    query($agency_id: ID!) {\n      agency(id: $agency_id ) {\n        stripe_account {\n          account_update_url {\n            url\n          }\n        }\n      }\n    }\n  "]);

  _templateObject4 = function _templateObject4() {
    return data;
  };

  return data;
}

function _templateObject3() {
  var data = _taggedTemplateLiteral(["\n    query {\n      markdowns(filter: { name: \"Services Agreement\", agency_id: null }) {\n        id\n        name\n        data\n      }\n    }\n  "]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral(["\n    query {\n      country_codes\n    }\n  "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n    query {\n      current_user {\n        id\n        name\n        email_address\n      }\n    }\n  "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// just a wrapper for convenience
function query(_x, _x2) {
  return _query.apply(this, arguments);
}

function _query() {
  _query = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(queryDef, variables) {
    var result,
        defaultVariables,
        defaultOptions,
        _len,
        options,
        _key,
        _yield$client$query,
        data,
        _args = arguments;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            result = queryDef.result, defaultVariables = queryDef.variables, defaultOptions = _objectWithoutProperties(queryDef, ["result", "variables"]);
            variables = _objectSpread(_objectSpread({}, defaultVariables), variables);

            for (_len = _args.length, options = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
              options[_key - 2] = _args[_key];
            }

            _context.next = 5;
            return _client2.client.query(_objectSpread(_objectSpread({
              variables: variables
            }, defaultOptions), options));

          case 5:
            _yield$client$query = _context.sent;
            data = _yield$client$query.data;
            return _context.abrupt("return", result(data));

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _query.apply(this, arguments);
}

var current_user_Q = {
  query: (0, _client.gql)(_templateObject()),
  notifyOnNetworkStatusChange: true,
  result: function result(d) {
    return d === null || d === void 0 ? void 0 : d.current_user;
  }
};
exports.current_user_Q = current_user_Q;
var country_codes_Q = {
  query: (0, _client.gql)(_templateObject2()),
  result: function result(d) {
    return d === null || d === void 0 ? void 0 : d.country_codes;
  }
};
exports.country_codes_Q = country_codes_Q;
var services_agreement_Q = {
  query: (0, _client.gql)(_templateObject3()),
  result: function result(d) {
    return d === null || d === void 0 ? void 0 : d.markdowns[0].data;
  }
};
exports.services_agreement_Q = services_agreement_Q;
var agency_stripe_account_update_url_Q = {
  query: (0, _client.gql)(_templateObject4()),
  fetchPolicy: 'no-cache',
  result: function result(d) {
    var _d$agency, _d$agency$stripe_acco, _d$agency$stripe_acco2;

    return d === null || d === void 0 ? void 0 : (_d$agency = d.agency) === null || _d$agency === void 0 ? void 0 : (_d$agency$stripe_acco = _d$agency.stripe_account) === null || _d$agency$stripe_acco === void 0 ? void 0 : (_d$agency$stripe_acco2 = _d$agency$stripe_acco.account_update_url) === null || _d$agency$stripe_acco2 === void 0 ? void 0 : _d$agency$stripe_acco2.url;
  }
};
exports.agency_stripe_account_update_url_Q = agency_stripe_account_update_url_Q;
var current_user_agencies_Q = {
  query: (0, _client.gql)(_templateObject5()),
  notifyOnNetworkStatusChange: true,
  result: function result(d) {
    var _d$current_user;

    return d === null || d === void 0 ? void 0 : (_d$current_user = d.current_user) === null || _d$current_user === void 0 ? void 0 : _d$current_user.memberships.map(function (m) {
      return _objectSpread(_objectSpread({}, m.subdomain.agency), {}, {
        subdomain: m.subdomain
      });
    });
  }
};
exports.current_user_agencies_Q = current_user_agencies_Q;
var subdomain_public_Q = {
  query: (0, _client.gql)(_templateObject6()),
  result: function result(d) {
    return d === null || d === void 0 ? void 0 : d.subdomains[0];
  }
};
exports.subdomain_public_Q = subdomain_public_Q;
var agency_services_Q = {
  query: (0, _client.gql)(_templateObject7()),
  result: function result(d) {
    return d === null || d === void 0 ? void 0 : d.services;
  }
}; // agencies: {
//   query: gql`
//     query {
//       me {
//         uuid
//         agenciesConnection {
//           edges {
//             cursor
//             roles
//             node {
//               uuid
//               name
//               subdomain {
//                 uuid
//                 name
//               }
//               theme {
//                 uuid
//                 name
//                 imageLogo {
//                   uuid
//                   name
//                   color
//                   data
//                 }
//                 imageHero {
//                   uuid
//                   name
//                   color
//                   data
//                 }
//                 colorPrimary
//                 colorSecondary
//                 colorAccent
//                 colorBackground
//                 colorSurface
//                 colorError
//                 colorSuccess
//               }
//             }
//           }
//         }
//       }
//     }
//   `,
//   result: d => d?.me.agenciesConnection.edges
//     .map(edge => ({ ...edge.node, roles: edge.roles }))
// },
// invites: {
//   query: gql`
//     query {
//       me {
//         uuid
//         invitesConnection {
//           edges {
//             node {
//               uuid
//               status
//               agency {
//                 uuid
//                 name
//                 subdomain {
//                   uuid
//                   name
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   `,
//   result: d => d?.me.invitesConnection.edges
//     .map(edge => edge.node)
//     .filter(invite => invite.status === null)
// },
// profile: {
//   query: gql`
//     query {
//       me {
//         uuid
//         name
//         agenciesConnection {
//           edges {
//             cursor
//             roles
//             node {
//               uuid
//               name
//               subdomain {
//                 uuid
//                 name
//               }
//               theme {
//                 uuid
//                 name
//                 imageLogo {
//                   uuid
//                   name
//                   color
//                   data
//                 }
//                 imageHero {
//                   uuid
//                   name
//                   color
//                   data
//                 }
//                 colorPrimary
//                 colorSecondary
//                 colorAccent
//                 colorBackground
//                 colorSurface
//                 colorError
//                 colorSuccess
//               }
//             }
//           }
//         }
//         invitesConnection {
//           edges {
//             node {
//               uuid
//               status
//               agency {
//                 uuid
//                 name
//                 subdomain {
//                   uuid
//                   name
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   `,
//   result: d => d?.me
// },
// portal: {
//   query: gql`
//     query($subdomainName: String) {
//       agency(subdomainName: $subdomainName) {
//         uuid
//         name
//         theme {
//           uuid
//           name
//           imageLogo {
//             uuid
//             name
//             data
//             color
//           }
//           imageHero {
//             uuid
//             name
//             data
//             color
//           }
//           colorPrimary
//           colorSecondary
//           colorAccent
//           colorBackground
//           colorSurface
//           colorError
//           colorSuccess
//         }
//         servicesConnection {
//           edges(status: "live") {
//             cursor
//             node {
//               uuid
//               name
//               status
//               steps {
//                 uuid
//                 name
//                 type
//               }
//             }
//           }
//         }
//       }
//     }
//   `,
//   result: d => d?.agency
// },
// dashboard: {
//   query: gql`
//     query($subdomainName: String) {
//       agency(subdomainName: $subdomainName) {
//         uuid
//         name
//         theme {
//           uuid
//           name
//           imageLogo {
//             uuid
//             name
//             data
//             color
//           }
//           imageHero {
//             uuid
//             name
//             data
//             color
//           }
//           colorPrimary
//           colorSecondary
//           colorAccent
//           colorBackground
//           colorSurface
//           colorError
//           colorSuccess
//         }
//         servicesConnection {
//           edges {
//             cursor
//             node {
//               uuid
//               name
//               status
//               steps {
//                 uuid
//                 name
//                 type
//               }
//             }
//           }
//         }
//         subjectsConnection {
//           edges {
//             cursor
//             roles
//             node {
//               uuid
//               name
//               emailAddress
//             }
//           }
//         }
//       }
//     }
//   `,
//   result: d => d?.agency
// },
// agency: {
//   query: gql`
//     query($subdomainName: String) {
//       agency(subdomainName: $subdomainName) {
//         uuid
//         name
//         theme {
//           uuid
//           name
//           imageLogo {
//             uuid
//             name
//             data
//             color
//           }
//           imageHero {
//             uuid
//             name
//             data
//             color
//           }
//           colorPrimary
//           colorSecondary
//           colorAccent
//           colorBackground
//           colorSurface
//           colorError
//           colorSuccess
//         }
//       }
//     }
//   `,
//   result: d => d?.agency
// },
// agencyRoles: {
//   query: gql`
//     query($agencyUuids: [ID!]) {
//       me {
//         uuid
//         name
//         type
//         agenciesConnection {
//           edges(uuids: $agencyUuids) {
//             node {
//               uuid
//             }
//             roles
//           }
//         }
//       }
//     }
//   `,
//   result: d => d?.me.agenciesConnection
// },
// clients: {
//   query: gql`
//     query($agencyUuid: ID!) {
//       agency(uuid: $agencyUuid) {
//         uuid
//         name
//         clientsConnection {
//           edges {
//             cursor
//             node {
//               uuid
//               name
//               emailAddress
//               subject {
//                 uuid
//                 name
//                 emailAddress
//               }
//               invite {
//                 uuid
//                 status
//                 inviteeEmailAddress
//               }
//             }
//           }
//         }
//       }
//     }
//   `,
//   result: d => d?.agency.clientsConnection.edges
//     .map(edge => edge.node)
// },
// services: {
//   query: gql`
//     query($agencyUuid: ID!) {
//       agency(uuid: $agencyUuid) {
//         uuid
//         name
//         servicesConnection {
//           edges {
//             cursor
//             node {
//               uuid
//               name
//               status
//               steps {
//                 uuid
//                 name
//                 type
//               }
//             }
//           }
//         }
//       }
//     }
//   `,
//   result: d => d?.agency.servicesConnection.edges
//     .map(edge => edge.node)
// }

exports.agency_services_Q = agency_services_Q;
//# sourceMappingURL=index.js.map