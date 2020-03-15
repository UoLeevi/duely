<template>
  <v-card :color="backgroundColor" dark width="200" class="rounded-corners-tiny pa-1 ma-4 elevation-6">
    <router-link :to="`/dashboard?subdomain=${agency.subdomain.name}`">
      <v-img v-if="agency.theme && agency.theme.imageLogo" contain :src="agency.theme.imageLogo.data" height="100px" class="mb-n5" />
      <v-card-text>
        <h3 :style="{ 'color': nameColor }" class="f-3b pb-1">{{ agency.name }}</h3>
        <span :style="{ 'color': subdomainNameColor }" class="f-2b">{{ agency.subdomain.name }}.duely.app</span>
      </v-card-text>
    </router-link>
    <v-card-actions v-if="invite" class="mt-n2">
      <div class="d-flex flex-column">
        <span class="f-2 pb-1">Invite</span>
        <v-progress-circular v-if="inviteLoading" indeterminate />
        <div v-else class="ma-n2">
          <v-btn @click="acceptInvite(invite)" text class="text-none ma-1 f-2b">Accept</v-btn>
          <v-btn @click="declineInvite(invite)" text class="text-none ma-1 f-2b">Decline</v-btn>
        </div>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
import { gql } from '@/apollo';

export default {
  props: {
    agency: Object /*{
      uuid
      name
      subdomain {
        uuid
        name
      }
      theme {
        uuid
        name
        imageLogo {
          uuid
          name
          color
          data
        }
        imageHero {
          uuid
          name
          color
          data
        }
        colorPrimary
        colorSecondary
        colorAccent
        colorBackground
        colorSurface
        colorError
        colorSuccess
      }
    }*/,
    invite: Object /*{
      uuid
      status
      agency
    }*/
  },
  computed: {
    backgroundColor() {
      return this.agency.theme
        ? this.chooseContrastingColor(
            this.agency.theme.imageLogo.color,
            this.agency.theme.colorSurface,
            this.agency.theme.colorPrimary,
            this.agency.theme.colorSecondary
          )
        : this.colorHex('primary');
    },
    nameColor() {
      return this.agency.theme
        ? this.chooseContrastingColor(
            this.backgroundColor,
            this.agency.theme.colorPrimary,
            this.agency.theme.colorSecondary,
            '#FFFFFF',
            '#000000'
          )
        : this.chooseContrastingColor(
            this.backgroundColor,
            this.colorHex('primary'),
            this.colorHex('secondary'),
            '#FFFFFF',
            '#000000'
          );
    },
    subdomainNameColor() {
      return this.agency.theme
        ? this.chooseContrastingColor(
            this.backgroundColor,
            this.agency.theme.colorSecondary,
            this.agency.theme.colorAccent,
            '#FFFFFF',
            '#000000'
          )
        : this.chooseContrastingColor(
            this.backgroundColor,
            this.colorHex('secondary'),
            this.colorHex('accent'),
            '#FFFFFF',
            '#000000'
          );
    }
  },
  data() {
    return {
      inviteLoading: false
    };
  },
  methods: {
    async acceptInvite(invite) {
      this.inviteLoading = true;

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
          inviteUuid: invite.uuid
        }
      });

      this.inviteLoading = false;
    },
    async declineInvite(invite) {
      this.inviteLoading = true;

      await this.$apollo.mutate({
        mutation: gql`mutation($inviteUuid: ID!) {
          declineInvite(inviteUuid: $inviteUuid) {
            success
            message
            invite {
              uuid
              status
            }
          }
        }`,
        variables: {
          inviteUuid: invite.uuid
        }
      });

      this.inviteLoading = false;
    }
  }
};
</script>
