<template>
  <div>
    <DialogForm :title="`Add new ${role}`" @submit="addNewUser" :errorMessage="errorMessage" activatorClass="new-user-button" activatorIcon="add" :dialog.sync="dialog">
      <v-text-field color="primary" solo outlined flat single-line rounded class="mt-5 mb-1" label="Email address" :rules="[rules.required, rules.emailAddressFormat]" type="email" v-model="emailAddress" validate-on-blur spellcheck="false" />
      <v-textarea label="Short message" solo outlined flat rounded no-resize v-model="message" hint="This message is sent with the invite email." class="mb-1" />
      <template #actions>
        <v-btn depressed rounded min-width="140px" color="primary" x-large class="f-3b ma-3 text-none" type="submit" :loading="$apollo.loading">Send an invite</v-btn>
      </template>
    </DialogForm>
  <v-snackbar v-model="snackbar" bottom right :timeout="2000" color="surface darken-2" class="success--text"><span class="f-2b">Invite sent to {{ emailAddress && emailAddress.toLowerCase() }}.</span></v-snackbar>
  </div>
</template>

<script>
import DialogForm from '@/components/DialogForm';

import { gql } from '@/apollo';

export default {
  props: {
    agency: Object /*{
      uuid
    }*/,
    role: {
      type: String,
      default: 'agent'
    }
  },
  components: {
    DialogForm
  },
  data() {
    return {
      dialog: false,
      snackbar: false,
      emailAddress: '',
      message: '',
      rules: {
        required: v => !!v || 'Required',
        emailAddressFormat: v =>
          /^\S+@\S+$/.test(v) || 'Email address does not have correct format'
      },
      errorMessage: null,
      loading: false
    };
  },
  methods: {
    async addNewUser() {
      await this.$apollo.mutate({
        mutation: gql`mutation($agencyUuid: ID!, $emailAddress: String!, $role: String!, $message: String) {
          inviteUser(agencyUuid: $agencyUuid, emailAddress: $emailAddress, role: $role, message: $message) {
            success
            message
            invite {
              uuid
              inviteeEmailAddress
            }
          }
        }`,
        variables: {
          agencyUuid: this.agency.uuid,
          emailAddress: this.emailAddress && this.emailAddress.toLowerCase(),
          role: this.role,
          message: this.message
        },
        update: async (store, { data: { inviteUser } }) => {
          if (inviteUser.success) {
            // success
            this.snackbar = true;
            this.dialog = false;
          } else {
            this.errorMessage = inviteUser.message;
            /* eslint-disable */
            console.log(inviteUser.message);
          }
        }
      });
    }
  }
};
</script>

<style>

.new-user-button {
  transform: translateY(160%);
}

</style>
