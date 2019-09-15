import pool from '../../db';

export default {
  typeDef: `
    type Subject implements Node {
      uuid: ID!
      name: String!
      type: String!
      emailAddress: String
      agenciesConnection: SubjectAgenciesConnection!
    }
  `,
  resolvers: {
    Subject: {
      uuid: subject => subject.uuid_,
      name: subject => subject.name_,
      type: subject => subject.type_,
      emailAddress: subject => subject.email_address_,
      agenciesConnection(subject, args, context, info) {
        return { 
          subjectUuid: subject.uuid_, 
          subjectType: subject.type_,
          type: 'SubjectAgenciesConnection' 
        };
      }
    }
  }
};
