import { IExecutableSchemaDefinition, makeExecutableSchema } from '@graphql-tools/schema';
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
import { ProductSettings } from './ProductSettings';
import { Product } from './Product';
import { Subdomain } from './Subdomain';
import { SubscriptionPlan } from './SubscriptionPlan';
import { TransactionFee } from './TransactionFee';
import { Country } from './Country';
import { Image } from './Image';
import { Markdown } from './Markdown';
import { Membership } from './Membership';
import { DateTime } from './DateTime';
import { Json } from './Json';
import { Theme } from './Theme';
import { Price } from './Price';
import { BalanceTransaction } from './BalanceTransaction';
import { ExchangeRate } from './ExchangeRate';
import type { DuelyQqlContext } from '../context';
import gql from 'graphql-tag';
import { GqlTypeDefinition, GqlResolver } from '../types';
import { DocumentNode } from 'graphql';
import { Customer } from './Customer';
import { Order } from './Order';
import { StripeCheckoutSession } from './StripeCheckoutSession';
import { Credential } from './Credential';
import { Integration } from './Integration';
import { OrderItem } from './OrderItem';
import { IntegrationType } from './IntegrationType';
import { IntegrationConfig } from './IntegrationConfig';

const types: GqlTypeDefinition[] = [
  {
    typeDef: gql`
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
  Credential,
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
  ExchangeRate,
  User,
  Customer,
  Agency,
  AgencySettings,
  Price,
  StripeAccount,
  StripeCustomer,
  StripeCheckoutSession,
  BalanceTransaction,
  ProductSettings,
  Product,
  Subdomain,
  SubscriptionPlan,
  TransactionFee,
  Image,
  Markdown,
  Membership,
  Theme,
  Order,
  OrderItem,
  Integration,
  IntegrationConfig,
  IntegrationType,
  DateTime,
  Json
];

const schema: IExecutableSchemaDefinition<DuelyQqlContext> = {
  typeDefs: types.map((t) => t.typeDef).filter((d): d is DocumentNode => d !== undefined),
  resolvers: types
    .map((t) => t.resolvers)
    .filter((r): r is Record<string, GqlResolver> => r !== undefined)
};

export default makeExecutableSchema<DuelyQqlContext>(schema);
