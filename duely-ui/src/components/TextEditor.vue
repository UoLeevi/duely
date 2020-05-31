<template>
  <v-hover #default="{ hover }">
    <div class="text-editor" :class="{ editable: c_editable, focus, blank, hover, multiline, space }">
      <div v-if="c_editable" class="header surface--text">
        <span class="mr-7" :class="`${ !blank || focus || hover ? 'f-1b' : 'f-3b' }`" style="pointer-events: none;">{{ label }}</span>
        <div class="editor-ribbon f-3">
          <v-icon class="edit">edit</v-icon>
          <TextEditorRibbonBtn :editor-view="editorView" icon="format_bold" mark="strong" />
          <TextEditorRibbonBtn :editor-view="editorView" icon="format_italic" mark="em" />
          <TextEditorRibbonBtn :editor-view="editorView" icon="code" mark="code" />
          <TextEditorRibbonBtn :editor-view="editorView" icon="format_list_bulleted" node="bullet_list" />
        </div>
      </div>
      <v-fade-transition>
        <span v-if="c_editable && hint && blank && !focus && !hover" class="hint f-2 mt-3 background--text text--darken3">{{ hint }}</span>
      </v-fade-transition>
      <div ref="editor-view" class="editor-view"></div>
    </div>
  </v-hover>
</template>

<script>
import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { schema, defaultMarkdownSerializer, defaultMarkdownParser } from 'prosemirror-markdown';
import { undo, redo, history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap, toggleMark } from 'prosemirror-commands';

import TextEditorRibbonBtn from '@/components/TextEditorRibbonBtn';

export default {
  components: {
    TextEditorRibbonBtn
  },
  props: {
    node: Object,
    label: {
      type: String,
      default: 'edit text'
    },
    hint: {
      type: String
    },
    text: {
      type: String
    },
    editable: Boolean,
    multiline: Boolean,
    space: Boolean,
    backgroundColor: String
  },
  data() {
    return {
      editorView: null,
      d_text: this.text,
      d_editable: this.editable
    };
  },
  computed: {
    blank() {
      return this.c_text === '';
    },
    focus() {
      return this.editorView && this.editorView.focused;
    },
    html() {
      return '';
    },
    c_text: {
      get() {
        return this.d_text != null ? this.d_text : '';
      },
      set(v) {
        if (v === this.d_text)
          return;

        this.d_text = v;

        if (this.text !== v)
          this.$emit('update:text', v);
      }
    },
    c_editable: {
      get() {
        return this.d_editable;
      },
      set(v) {
        if (v === this.d_editable)
          return;

        this.d_editable = v;

        if (this.edit !== v)
          this.$emit('update:editable', v);
      }
    }
  },
  watch: {
    text(v) {
      if (this.editorView && v !== this.d_text) {
        this.editorView.updateState(EditorState.create({ 
          schema: this.editorView.state.schema, 
          doc: defaultMarkdownParser.parse(v), 
          plugins: this.editorView.state.plugins
        }));
      }

      this.c_text = this.text;
    },
    editable() {
      this.c_editable = this.editable;
    }
  },
  methods: {
    updateComponent(view) {
      this.c_text = defaultMarkdownSerializer.serialize(view.state.doc);
    }
  },
  mounted() {
    // https://prosemirror.net/docs/guide/
    // https://prosemirror.net/docs/ref/#view

    const stateConfig = {
      schema,
      plugins: [
        history(),
        keymap({ 
          'Mod-z': undo, 
          'Mod-y': redo, 
          'Enter': (state, dispatch) => {
            if (!this.multiline || !dispatch)
              return true;

            dispatch(state.tr
              .replaceSelectionWith(schema.node('hard_break'))
              .scrollIntoView());

            return true;
          },
          'Mod-b': toggleMark(schema.marks.strong),
          'Mod-i': toggleMark(schema.marks.em)
        }),
        keymap(baseKeymap),
        new Plugin({ view: () => ({ update: this.updateComponent })})
      ],
    };

    if (this.c_text) {
      stateConfig.doc = defaultMarkdownParser.parse(this.c_text);
    }

    this.editorView = new EditorView(this.$refs['editor-view'], {
      state: EditorState.create(stateConfig),
      editable: () => this.c_editable,
      attributes: {
        spellcheck: false
      }
    });
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
.text-editor.space {
  position: relative;
}

.text-editor:not(.editable) {
  cursor: default;
}

.text-editor.editable > .header {
  display: flex;
  font-weight: 700;
  letter-spacing: 0.06rem;
  transition: opacity 200ms ease, transform 200ms ease;
  position: absolute;
  align-items: center;
}

.text-editor.editable > .header > span {
  transition: font-size 200ms ease;
}

.text-editor.editable:not(.focus):not(.hover) > .header {
  opacity: 0.5;
}

.text-editor.editable.focus > .header,
.text-editor.editable.hover > .header,
.text-editor.editable:not(.blank) > .header {
  transform: translateY(-1rem);
}

.text-editor.editable > .hint {
  position: absolute;
  display: inline-block;
  top: 14px;
}

.text-editor.editable > .editor-view {
  margin-top: 12px;
}

.text-editor.editable > .editor-view > [contenteditable] {
  min-width: 30ch;
  margin: -8px -12px;
  padding: 8px 12px;
  border: solid 1px transparent;
  transition: border 200ms ease;
}

.text-editor.editable.multiline > .editor-view > [contenteditable] {
  min-width: 60ch;
  min-height: 5.6rem;
}

#app.xl .text-editor.editable > .editor-view > [contenteditable],
#app.lg .text-editor.editable > .editor-view > [contenteditable],
#app.md .text-editor.editable > .editor-view > [contenteditable] {
  border-bottom-left-radius: 0.5rem;
}
#app.sm .text-editor.editable > .editor-view > [contenteditable] {
  border-bottom-left-radius: 0.45rem;
}
#app.xs .text-editor.editable > .editor-view > [contenteditable] {
  border-bottom-left-radius: 0.4rem;
}

.text-editor.editable.focus > .editor-view > [contenteditable],
.text-editor.editable.hover > .editor-view > [contenteditable] {
  border-left: solid 1px #ddd;
  border-bottom: solid 1px #ddd;
}

.text-editor.editable.focus > .editor-view > [contenteditable] {
  outline: none;
}

.text-editor > .editor-view > [contenteditable] > *:last-child {
  margin-bottom: 0;
}

.text-editor.editable > .header > .editor-ribbon {
  position: relative;
  display: flex;
  align-items: center;
  margin: -6px !important;
  transition: opacity 200ms ease;
}

.text-editor.editable:not(.focus) > .header > .editor-ribbon {
  pointer-events: none;
}

.text-editor.editable > .header > .editor-ribbon > * {
  transition: opacity 200ms ease;
}

.text-editor.editable > .header > .editor-ribbon > *:not(.edit) {
  margin: 6px !important;
  transition: opacity 200ms ease;
}

.text-editor.editable:not(.focus) > .header > .editor-ribbon > *:not(.edit) {
  opacity: 0;
}

.text-editor.editable > .header > .editor-ribbon > .edit {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.text-editor.editable.focus > .header > .editor-ribbon > .edit,
.text-editor.editable.hover > .header > .editor-ribbon > .edit,
.text-editor.editable:not(.blank) > .header > .editor-ribbon > .edit {
  opacity: 0;
}
</style>
