import { makeExecutableSchema } from '@graphql-tools/schema';
import { interfaces } from './interfaces';
import { AccessLevel } from './AccessLevel';
import { Address } from './Address';
import { Charge } from './Charge';
import { FormField } from './FormField';
import { Page } from './Page';
import { PageBlock } from './PageBlock';
import { PageDefinition } from './PageDefinition';
import { PageBlockDefinition } from './PageBlockDefinition';
import { PaymentIntent } from './PaymentIntent';
import { Visit } from './Visit';
import { LogIn } from './LogIn';
import { SignUp } from './SignUp';
import { PasswordReset } from './PasswordReset';
import { User } from './User';
import { Agency } from './Agency';
import { AgencySettings } from './AgencySettings';
import { StripeAccount } from './StripeAccount';
import { StripeCustomer } from './StripeCustomer';
import { Service } from './Service';
import { ServiceSettings } from './ServiceSettings';
import { ServiceVariant } from './ServiceVariant';
import { Subdomain } from './Subdomain';
import { Country } from './Country';
import { Image } from './Image';
import { Markdown } from './Markdown';
import { Membership } from './Membership';
import { Date } from './Date';
import { Theme } from './Theme';
import { Price } from './Price';
import { BalanceTransaction } from './BalanceTransaction';

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
  FormField,
  Page,
  PageBlock,
  PageDefinition,
  PageBlockDefinition,
  Address,
  Charge,
  PaymentIntent,
  Visit,
  LogIn,
  SignUp,
  PasswordReset,
  Country,
  User,
  Agency,
  AgencySettings,
  Price,
  StripeAccount,
  StripeCustomer,
  BalanceTransaction,
  Service,
  ServiceSettings,
  ServiceVariant,
  Subdomain,
  Image,
  Markdown,
  Membership,
  Theme,
  Date
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
