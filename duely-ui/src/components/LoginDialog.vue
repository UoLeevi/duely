<template>
  <DialogForm title="Log in" @submit="logIn" :errorMessage="errorMessage" :dialog.sync="dialog">
    <template #activator="activator">
      <slot name="activator" v-bind="activator">
        <v-btn v-on="activator.on">
          <span>Log in</span>
        </v-btn>
      </slot>
    </template>

    <v-text-field color="primary" solo outlined flat single-line rounded class="mt-5 mb-1" label="Email address" :rules="[rules.required, rules.emailAddressFormat]" type="email" v-model="emailAddress" validate-on-blur spellcheck="false" />
    <v-text-field color="primary" solo outlined flat single-line rounded class="mt-1 mb-1" label="Password" :append-icon="isPasswordVisible ? 'visibility' : 'visibility_off'" :type="isPasswordVisible ? 'text' : 'password'" :rules="[rules.required, rules.minLength]" v-model="password" validate-on-blur spellcheck="false" @click:append="isPasswordVisible = !isPasswordVisible" />
          
    <template #actions>
      <v-btn depressed rounded min-width="140px" color="primary" x-large class="f-3b ma-3 text-none" type="submit" :loading="$apollo.loading || loading">Log in</v-btn>
      <div class="d-inline-flex ma-2 align-center">
        <span class="text-no-wrap f-2 text-none">Don't have an account?</span>
        <v-btn text depressed rounded small color="primary" class="f-2b text-none" :to="emailAddress ? `/create-account?email=${emailAddress}` : '/create-account'">Sign up</v-btn>
      </div>
    </template>
  </DialogForm>
</template>

<script>
import DialogForm from '@/components/DialogForm';

import { gql } from '@/apollo';

export default {
  components: {
    DialogForm
  },
  data() {
    return {
      dialog: false,
      inviteUuid: this.$route.query.invite !== undefined ? decodeURIComponent(this.$route.query.invite) : null,
      emailAddress: this.$route.query.login !== undefined ? decodeURIComponent(this.$route.query.login) : '',
      password: '',
      isPasswordVisible: false,
      rules: {
        required: v => !!v || 'Required',
        minLength: v => (v || '').length >= 6 || 'Min 6 characters',
        emailAddressFormat: v =>
          /^\S+@\S+$/.test(v) || 'Email address does not have correct format'
      },
      errorMessage: null,
      loading: false
    };
  },
  async created() {
    await this.$nextTick();
    this.dialog = this.$route.query.login !== undefined
    this.removeQueryParameters('login');
  },
  methods: {
    async logIn() {
      await this.$apollo.mutate({
        mutation: gql`mutation($emailAddress: String!, $password: String!) {
          logIn(emailAddress: $emailAddress, password: $password) {
            success
            message
            jwt
          }
        }`,
        variables: {
          emailAddress: this.emailAddress,
          password: this.password
        },
        update: async (store, { data: { logIn } }) => {
          if (logIn.success)
          {
            const jwt = logIn.jwt;
            if (jwt) {
              localStorage.setItem('user-jwt', jwt);
            }
          }
          else {
            this.errorMessage = logIn.message;
            /* eslint-disable */
            console.log(logIn.message);
            return;
          }

          await this.$apollo.provider.defaultClient.clearStore();
          await this.$apollo.queries.me.refetch();

          if (!this.agency) {
            this.$router.push({ path: '/profile' });
            this.loading = false;
            return;
          }

          // accept any invite from the agency
          if (this.inviteUuid === null) {
            const invite = this.me.invitesConnection.edges
              .map(edge => edge.node)
              .find(invite => invite.agency.uuid === this.agency.uuid && invite.status === null);

            if (!invite) {
              this.dialog = false;
              this.loading = false;
              return;
            }

            this.inviteUuid = invite.uuid;
          }

          await this.$apollo.mutate({
            mutation: gql`mutation($inviteUuid: ID!) {
              acceptInvite(inviteUuid: $inviteUuid) {
                success
                message
                invite {
                  uuid
                  status
                }
              }
            }`,
            variables: {
              inviteUuid: this.inviteUuid
            },
            update: async (store, { data: { acceptInvite } }) => {
              if (acceptInvite.success) {
                this.$router.push({ path: '/portal' });
                this.loading = false;
                return;
              } else {
                // something went wrong
                console.log(acceptInvite.message);
                this.dialog = false;
                this.loading = false;
                return;
              }
            }
          });

          this.dialog = false;
        }
      });
    }
  },
  apollo: {
    me: {
      query: gql`query {
        me {
          uuid
          name
          type
          invitesConnection {
            edges {
              cursor
              node {
                uuid
                status
                agency {
                  uuid
                  name
                  subdomain {
                    uuid
                    name
                  }
                }
              }
            }
          }
        }
      }`
    },
    session: {
      query: gql`query {
        session @client {
          subdomainName
        }
      }`
    },
    agency: {
      query: gql`query($subdomainName: String) {
        agency(subdomainName: $subdomainName) {
          uuid
          name
        }
      }`,
      variables () {
        return {
          subdomainName: this.session.subdomainName,
        }
      },
      skip () {
        return this.$apollo.queries.session.loading || this.session.subdomainName === null;
      }
    }
  },
  created() {
    this.removeQueryParameters('invite');
  }
};
</script>
