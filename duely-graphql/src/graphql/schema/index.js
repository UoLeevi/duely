import { makeExecutableSchema } from 'graphql-tools';
import Agency from './Agency';
import BeginVisitResult from './BeginVisitResult';
import Connection from './Connection';
import Date from './Date';
import Edge from './Edge';
import EndVisitResult from './EndVisitResult';
import LogInResult from './LogInResult';
import LogOutResult from './LogOutResult';
import Mutation from './Mutation';
import MutationResult from './MutationResult';
import Node from './Node';
import Query from './Query';
import Role from './Role';
import SignUpResult from './SignUpResult';
import StartEmailAddressVerificationResult from './StartEmailAddressVerificationResult';
import Subdomain from './Subdomain';
import Subject from './Subject';

export default makeExecutableSchema([
  Agency,
  BeginVisitResult,
  Connection,
  Date,
  Edge,
  EndVisitResult,
  LogInResult,
  LogOutResult,
  Mutation,
  MutationResult,
  Node,
  Query,
  Role,
  SignUpResult,
  StartEmailAddressVerificationResult,
  Subdomain,
  Subject
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