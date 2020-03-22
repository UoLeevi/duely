<template>
  <div class="markdownarea">
    <div class="d-flex flex-column align-start flex-wrap ma-n2">
    <v-fade-transition mode="out-in">
      <div v-if="c_edit" class="mt-2 mx-2 mb-1 align-self-start" style="position: relative; min-height: 1.5em;">
        <textarea v-model="c_markdown" spellcheck="false" class="editarea rounded-corners-tiny" style="transition: opacity 150ms linear;" :style="{ 'opacity': c_edit ? '1' : '0' }"></textarea>
        <span v-if="c_edit" class="f-1" style="position: absolute; user-select: none; white-space: nowrap; right: 14px; bottom: 12px;"># markdown <span style="opacity: 0.5;">|</span> <span v-if="!disabled" class="primary--text" @click="c_edit = false">hide</span></span>
      </div>
      <span v-else-if="!disabled" class="f-1 ma-2" style="user-select: none; white-space: nowrap;"># markdown <span style="opacity: 0.5;">|</span> <span v-if="!disabled" class="primary--text" @click="c_edit = true">edit</span></span>
    </v-fade-transition>
    <div v-html="html" class="htmlarea ma-2" style="min-height: 3em;"></div>
    </div>
  </div>
</template>

<script>
import marked from 'marked';
import DOMPurify from 'dompurify';

export default {
  props: {
    markdown: {
      type: String
    },
    edit: {
      type: Boolean
    },
    disabled: Boolean
  },
  data() {
    return {
      d_markdown: this.markdown,
      d_edit: this.edit
    };
  },
  computed: {
    html() {
      return DOMPurify.sanitize(marked(this.c_markdown, { breaks: true }));
    },
    c_markdown: {
      get() {
        return this.d_markdown || '';
      },
      set(v) {
        if (v === this.d_markdown) return;

        this.d_markdown = v;

        if (this.markdown !== v) this.$emit('update:markdown', v);
      }
    },
    c_edit: {
      get() {
        return this.d_edit;
      },
      set(v) {
        if (v === this.d_edit) return;

        this.d_edit = v;

        if (this.edit !== v) this.$emit('update:edit', v);
      }
    }
  },
  watch: {
    markdown() {
      this.c_markdown = this.markdown;
    },
    edit() {
      this.c_edit = this.edit;
    }
  }
};
</script>

<style scoped>
.markdownarea textarea.editarea {
  background-color: transparent;
  width: 80ch;
  max-height: 400px;
  padding: 10px;
  font-size: 0.95em;
  font-family: monospace;
  border: solid 1px #ddd;
}

.markdownarea textarea.editarea:focus {
  outline: none;
}

.markdownarea div.htmlarea {
  min-width: 80ch;
}
</style>
