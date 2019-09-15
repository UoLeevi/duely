import { makeExecutableSchema } from 'graphql-tools';
import Agency from './Agency';
import BeginVisitResult from './BeginVisitResult';
import Connection from './Connection';
import CreateAgencyResult from './CreateAgencyResult';
import Date from './Date';
import DeleteAgencyResult from './DeleteAgencyResult';
import Edge from './Edge';
import EndVisitResult from './EndVisitResult';
import LogInResult from './LogInResult';
import LogOutResult from './LogOutResult';
import Mutation from './Mutation';
import MutationResult from './MutationResult';
import Node from './Node';
import Query from './Query';
import SignUpResult from './SignUpResult';
import StartEmailAddressVerificationResult from './StartEmailAddressVerificationResult';
import Subdomain from './Subdomain';
import Subject from './Subject';
import SubjectAgenciesConnection from './SubjectAgenciesConnection';
import SubjectAgenciesEdge from './SubjectAgenciesEdge';

export default makeExecutableSchema([
  Agency,
  BeginVisitResult,
  Connection,
  CreateAgencyResult,
  Date,
  DeleteAgencyResult,
  Edge,
  EndVisitResult,
  LogInResult,
  LogOutResult,
  Mutation,
  MutationResult,
  Node,
  Query,
  SignUpResult,
  StartEmailAddressVerificationResult,
  Subdomain,
  Subject,
  SubjectAgenciesConnection,
  SubjectAgenciesEdge
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