import { makeExecutableSchema } from 'graphql-tools';
import AcceptInviteResult from './AcceptInviteResult';
import Agency from './Agency';
import AgencyClientsConnection from './AgencyClientsConnection';
import AgencyClientsEdge from './AgencyClientsEdge';
import AgencyInvitesConnection from './AgencyInvitesConnection';
import AgencyInvitesEdge from './AgencyInvitesEdge';
import AgencyServicesConnection from './AgencyServicesConnection';
import AgencyServicesEdge from './AgencyServicesEdge';
import AgencySubjectsConnection from './AgencySubjectsConnection';
import AgencySubjectsEdge from './AgencySubjectsEdge';
import BeginVisitResult from './BeginVisitResult';
import Connection from './Connection';
import Client from './Client';
import CreateAgencyResult from './CreateAgencyResult';
import CreateClientResult from './CreateClientResult';
import CreateServiceResult from './CreateServiceResult';
import CreateServiceStepResult from './CreateServiceStepResult';
import Date from './Date';
import DeclineInviteResult from './DeclineInviteResult';
import DeleteResult from './DeleteResult';
import Edge from './Edge';
import EditAgencyThemeResult from './EditAgencyThemeResult';
import EditImageResult from './EditImageResult';
import EditServiceResult from './EditServiceResult';
import EndVisitResult from './EndVisitResult';
import Image from './Image';
import Invite from './Invite';
import InviteUserResult from './InviteUserResult';
import LogInResult from './LogInResult';
import LogOutResult from './LogOutResult';
import Mutation from './Mutation';
import MutationResult from './MutationResult';
import Node from './Node';
import Query from './Query';
import Service from './Service';
import ServiceStep from './ServiceStep';
import SimpleResult from './SimpleResult';
import Subdomain from './Subdomain';
import Subject from './Subject';
import SubjectAgenciesConnection from './SubjectAgenciesConnection';
import SubjectAgenciesEdge from './SubjectAgenciesEdge';
import SubjectInvitesConnection from './SubjectInvitesConnection';
import SubjectInvitesEdge from './SubjectInvitesEdge';
import Theme from './Theme';
import VerifyPasswordResetResult from './VerifyPasswordResetResult';
import VerifySignUpResult from './VerifySignUpResult';
import Subscription from './Subscription';

import { User } from './User';

const types = [
  User,
  AcceptInviteResult,
  Agency,
  AgencyClientsConnection,
  AgencyClientsEdge,
  AgencyInvitesConnection,
  AgencyInvitesEdge,
  AgencyServicesConnection,
  AgencyServicesEdge,
  AgencySubjectsConnection,
  AgencySubjectsEdge,
  BeginVisitResult,
  Connection,
  Client,
  CreateAgencyResult,
  CreateClientResult,
  CreateServiceResult,
  CreateServiceStepResult,
  Date,
  DeclineInviteResult,
  DeleteResult,
  Edge,
  EditAgencyThemeResult,
  EditImageResult,
  EditServiceResult,
  EndVisitResult,
  Image,
  Invite,
  InviteUserResult,
  LogInResult,
  LogOutResult,
  Mutation,
  MutationResult,
  Node,
  Query,
  Service,
  ServiceStep,
  SimpleResult,
  Subdomain,
  Subject,
  SubjectAgenciesConnection,
  SubjectAgenciesEdge,
  SubjectInvitesConnection,
  SubjectInvitesEdge,
  Theme,
  VerifyPasswordResetResult,
  VerifySignUpResult,
  Subscription
];

const schema = {
  typeDefs: types.map(t => t.typeDef ?? '').join(''),
  resolvers: {}
};

for (const [t, resolvers] of types.flatMap(t => Object.entries(t.resolvers))) {
  schema.resolvers[t] = {
    ...schema.resolvers[t],
    ...resolvers
  };
}

export default makeExecutableSchema(schema);
