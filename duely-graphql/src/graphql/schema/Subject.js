import pool from '../../db';

export default {
  typeDef: `
    type Subject implements Node {
      uuid: ID!
      name: String!
      type: String!
      emailAddress: String
    }
  `,
  resolvers: {
    Subject: {
      uuid: source => source.uuid_,
      name: source => source.name_,
      type: source => source.type_,
      emailAddress: subject => subject.email_address_,
      // agenciesConnection(subject, args, context, info) {
      //   return { subjectUuid: subject.uuid, type: 'SubjectAgenciesConnection' };
      // }
    }
  }
};
