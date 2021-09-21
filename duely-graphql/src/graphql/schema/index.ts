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
import { StripeAccount, StripeAccountLink } from './StripeAccount';
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
import { CredentialType } from './CredentialType';
import { BankAccount } from './BankAccount';
import { Coupon } from './Coupon';
import { Invoice, InvoiceStatusTransitions } from './Invoice';
import { Discount } from './Discount';
import { InvoiceLineItem, InvoiceLineItemDiscountAmount } from './InvoiceLineItem';
import { InvoiceItem } from './InvoiceItem';

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
  CredentialType,
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
  StripeAccountLink,
  StripeCustomer,
  StripeCheckoutSession,
  Invoice,
  InvoiceStatusTransitions,
  InvoiceItem,
  InvoiceLineItem,
  InvoiceLineItemDiscountAmount,
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
  BankAccount,
  Coupon,
  Discount,
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
