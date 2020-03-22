<template>
  <div class="texteditor"></div>
</template>

<script>
import { schema } from 'prosemirror-schema-basic';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

export default {
  props: {
    text: {
      type: String
    },
    edit: {
      type: Boolean
    },
    disabled: Boolean
  },
  data() {
    return {
      editorView: null,
      d_text: this.text,
      d_edit: this.edit
    };
  },
  computed: {
    html() {
      return '';
    },
    c_text: {
      get() {
        return this.d_text || '';
      },
      set(v) {
        if (v === this.d_text) return;

        this.d_text = v;

        if (this.text !== v) this.$emit('update:text', v);
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
    text() {
      this.c_text = this.text;
    },
    edit() {
      this.c_edit = this.edit;
    }
  },
  mounted() {
    // https://prosemirror.net/docs/guide/
    // https://prosemirror.net/docs/ref/#view
    let view = new EditorView(this.$el, { 
      state: EditorState.create({ schema }),
      dispatchTransaction(transaction) {
        let newState = view.state.apply(transaction);
        view.updateState(newState);
      },
      attributes: {
        spellcheck: false
      }
    });

    this.editorView = view;
  },
  beforeDestroy() {
    if (this.editorView)
      this.editorView.destroy();
  }
}
</script>

<style src="prosemirror-view/style/prosemirror.css">

</style>

<style>
.texteditor {
  min-width: 30ch;
}

.texteditor > [contenteditable] {
  margin: -8px -12px;
  padding: 8px 12px;
  border: solid 1px transparent;
  transition: border 200ms ease;
}

#app.xl .texteditor > [contenteditable],
#app.lg .texteditor > [contenteditable],
#app.md .texteditor > [contenteditable] {
  border-bottom-left-radius: 0.5rem;
}
#app.sm .texteditor > [contenteditable] {
  border-bottom-left-radius: 0.45rem;
}
#app.xs .texteditor > [contenteditable] {
  border-bottom-left-radius: 0.4rem;
}

.texteditor > [contenteditable]:focus,
.texteditor > [contenteditable]:hover {
  border-left: solid 1px #ddd;
  border-bottom: solid 1px #ddd;
}

.texteditor > [contenteditable]:focus {
  outline: none;
}

.texteditor > [contenteditable] > *:last-child {
  margin-bottom: 0;
}
</style>
