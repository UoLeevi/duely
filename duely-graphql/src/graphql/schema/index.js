import { makeExecutableSchema } from 'graphql-tools';
// import AcceptInviteResult from './AcceptInviteResult';
// import Agency from './Agency';
// import AgencyClientsConnection from './AgencyClientsConnection';
// import AgencyClientsEdge from './AgencyClientsEdge';
// import AgencyInvitesConnection from './AgencyInvitesConnection';
// import AgencyInvitesEdge from './AgencyInvitesEdge';
// import AgencyServicesConnection from './AgencyServicesConnection';
// import AgencyServicesEdge from './AgencyServicesEdge';
// import AgencySubjectsConnection from './AgencySubjectsConnection';
// import AgencySubjectsEdge from './AgencySubjectsEdge';
// import BeginVisitResult from './BeginVisitResult';
// import Connection from './Connection';
// import Client from './Client';
// import CreateAgencyResult from './CreateAgencyResult';
// import CreateClientResult from './CreateClientResult';
// import CreateServiceResult from './CreateServiceResult';
// import CreateServiceStepResult from './CreateServiceStepResult';
// import Date from './Date';
// import DeclineInviteResult from './DeclineInviteResult';
// import DeleteResult from './DeleteResult';
// import Edge from './Edge';
// import EditAgencyThemeResult from './EditAgencyThemeResult';
// import EditImageResult from './EditImageResult';
// import EditServiceResult from './EditServiceResult';
// import EndVisitResult from './EndVisitResult';
// import Image from './Image';
// import Invite from './Invite';
// import InviteUserResult from './InviteUserResult';
// import Mutation from './Mutation';
// import MutationResult from './MutationResult';
// import Node from './Node';
// import Query from './Query';
// import Service from './Service';
// import ServiceStep from './ServiceStep';
// import SimpleResult from './SimpleResult';
// import Subdomain from './Subdomain';
// import Subject from './Subject';
// import SubjectAgenciesConnection from './SubjectAgenciesConnection';
// import SubjectAgenciesEdge from './SubjectAgenciesEdge';
// import SubjectInvitesConnection from './SubjectInvitesConnection';
// import SubjectInvitesEdge from './SubjectInvitesEdge';
// import Theme from './Theme';
// import Subscription from './Subscription';

import { interfaces } from './interfaces';
import { AccessLevel } from './AccessLevel';
import { Visit } from './Visit';
import { LogIn } from './LogIn';
import { SignUp } from './SignUp';
import { PasswordReset } from './PasswordReset';
import { User } from './User';
import { Agency } from './Agency';
import { StripeAccount } from './StripeAccount';
import { Service } from './Service';
import { ServiceVariant } from './ServiceVariant';
import { Subdomain } from './Subdomain';
import { Country } from './Country';
import { Image } from './Image';
import { Markdown } from './Markdown';
import { Membership } from './Membership';
import { Date } from './Date';
import { Theme } from './Theme';
import { Price } from './Price';

const types = [
  {
    typeDef: `
      type Query
      type Mutation

      type SimpleResult implements MutationResult {
        success: Boolean!
        message: String
      }
    `
  },
  interfaces,
  AccessLevel,
  Visit,
  LogIn,
  SignUp,
  PasswordReset,
  Country,
  User,
  Agency,
  Price,
  StripeAccount,
  Service,
  ServiceVariant,
  Subdomain,
  Image,
  Markdown,
  Membership,
  Theme,
  Date
  // AcceptInviteResult,
  // AgencyClientsConnection,
  // AgencyClientsEdge,
  // AgencyInvitesConnection,
  // AgencyInvitesEdge,
  // AgencyServicesConnection,
  // AgencyServicesEdge,
  // AgencySubjectsConnection,
  // AgencySubjectsEdge,
  // BeginVisitResult,
  // Connection,
  // Client,
  // CreateClientResult,
  // CreateServiceResult,
  // CreateServiceStepResult,
  // DeclineInviteResult,
  // DeleteResult,
  // Edge,
  // EditAgencyThemeResult,
  // EditImageResult,
  // EditServiceResult,
  // EndVisitResult,
  // Invite,
  // InviteUserResult,
  // Mutation,
  // MutationResult,
  // Node,
  // Query,
  // Service,
  // ServiceStep,
  // SimpleResult,
  // Subject,
  // SubjectAgenciesConnection,
  // SubjectAgenciesEdge,
  // SubjectInvitesConnection,
  // SubjectInvitesEdge,
  // Subscription
];

const schema = {
  typeDefs: types.map(t => t.typeDef ?? '').join(''),
  resolvers: {}
};

for (const [t, resolvers] of types.flatMap(t => Object.entries(t.resolvers ?? {}))) {
  schema.resolvers[t] = {
    ...schema.resolvers[t],
    ...resolvers
  };
}

export default makeExecutableSchema(schema);
