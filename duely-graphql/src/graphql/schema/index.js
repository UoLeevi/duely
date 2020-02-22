import { makeExecutableSchema } from 'graphql-tools';
import Agency from './Agency';
import AgencyServicesConnection from './AgencyServicesConnection';
import AgencyServicesEdge from './AgencyServicesEdge';
import AgencySubjectsConnection from './AgencySubjectsConnection';
import AgencySubjectsEdge from './AgencySubjectsEdge';
import BeginVisitResult from './BeginVisitResult';
import Connection from './Connection';
import CreateAgencyResult from './CreateAgencyResult';
import CreateServiceResult from './CreateServiceResult';
import CreateServiceStepResult from './CreateServiceStepResult';
import Date from './Date';
import DeleteAgencyResult from './DeleteAgencyResult';
import DeleteServiceResult from './DeleteServiceResult';
import DeleteServiceStepResult from './DeleteServiceStepResult';
import Edge from './Edge';
import EditAgencyThemeResult from './EditAgencyThemeResult';
import EditImageResult from './EditImageResult';
import EndVisitResult from './EndVisitResult';
import Image from './Image';
import LogInResult from './LogInResult';
import LogOutResult from './LogOutResult';
import Mutation from './Mutation';
import MutationResult from './MutationResult';
import Node from './Node';
import Query from './Query';
import Service from './Service';
import ServiceStep from './ServiceStep';
import SignUpResult from './SignUpResult';
import StartEmailAddressVerificationResult from './StartEmailAddressVerificationResult';
import Subdomain from './Subdomain';
import Subject from './Subject';
import SubjectAgenciesConnection from './SubjectAgenciesConnection';
import SubjectAgenciesEdge from './SubjectAgenciesEdge';
import Theme from './Theme';
import Subscription from './Subscription';

export default makeExecutableSchema([
  Agency,
  AgencyServicesConnection,
  AgencyServicesEdge,
  AgencySubjectsConnection,
  AgencySubjectsEdge,
  BeginVisitResult,
  Connection,
  CreateAgencyResult,
  CreateServiceResult,
  CreateServiceStepResult,
  Date,
  DeleteAgencyResult,
  DeleteServiceResult,
  DeleteServiceStepResult,
  Edge,
  EditAgencyThemeResult,
  EditImageResult,
  EndVisitResult,
  Image,
  LogInResult,
  LogOutResult,
  Mutation,
  MutationResult,
  Node,
  Query,
  Service,
  ServiceStep,
  SignUpResult,
  StartEmailAddressVerificationResult,
  Subdomain,
  Subject,
  SubjectAgenciesConnection,
  SubjectAgenciesEdge,
  Theme,
  Subscription
].reduce((schema, type) => ({
  typeDefs: schema.typeDefs.concat(type.typeDef),
  resolvers: {
    ...schema.resolvers,
    ...type.resolvers
  }
}), {
    typeDefs: '',
    resolvers: {}
  }));