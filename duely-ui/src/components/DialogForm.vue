<template>
  <v-dialog content-class="rounded-corners" max-width="600px" v-model="c_dialog" @click:outside="$refs.form.reset()">
    <template #activator="activator">
      <slot name="activator" v-bind="activator">
        <v-btn name="activator" v-on="activator.on" absolute dark large rounded bottom right color="primary" :class="activatorClass">
          <span class="text-none f-2b">{{ title }}</span>
          <v-icon v-if="activatorIcon" right>{{ activatorIcon }}</v-icon>
        </v-btn>
      </slot>
    </template>
    <v-card flat class="pa-4 rounded-corners">
      <v-card-title>
        <h2 class="f-6b text-no-wrap">{{ title }}</h2>
      </v-card-title>
      <v-card-text>
        <v-form class="pb-1 px-4" @submit.prevent="$emit('submit', $event)" ref="form">
          <slot />
          <v-expand-transition>
            <p class="error--text" v-if="errorMessage">{{ errorMessage }}</p>
          </v-expand-transition>
          <v-row no-gutters class="flex-wrap justify-space-around align-center ma-n3 mb-n4">
            <slot name="actions" />
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    errorMessage: {
      type: String,
      default: undefined
    },
    activatorClass: {
      type: [Object, String],
      default: undefined
    },
    activatorIcon: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      d_dialog: this.dialog
    };
  },
  computed: {
    c_dialog: {
      get() {
        return this.d_dialog;
      },
      set(v) {
        if (v === this.d_dialog)
          return;

        this.d_dialog = v;
        this.$emit('dialog:update', v);
      }
    }
  }
}
</script>
