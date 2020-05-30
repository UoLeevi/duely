<template>
  <v-icon v-if="icon" class="text-editor-ribbon-btn" color="black" :class="{ 'active': markActive }" @mousedown.prevent="typeof callback === 'function' ? callback(editorView) : mark ? toggleMark() : null">{{ icon }}</v-icon>
  <span v-else class="text-editor-ribbon-btn f-1b" :class="{ 'active': markActive }" @mousedown.prevent="typeof callback === 'function' ? callback(editorView) : mark ? toggleMark() : null"><slot></slot></span>
</template>

<script>
import { toggleMark } from 'prosemirror-commands';

export default {
  props: {
    editorView: Object,
    mark: String,
    node: String,
    icon: String,
    callback: Function
  },
  computed: {
    markType() {
      return this.mark && this.editorView && this.editorView.state.schema.marks[this.mark];
    },
    nodeType() {
      return this.node && this.editorView && this.editorView.state.schema.nodes[this.node];
    },
    markActive() {
      if (!this.mark || !this.editorView)
        return false;

      const { selection, storedMarks, doc } = this.editorView.state;
      const { $cursor, ranges } = selection;

      return $cursor
        ? this.markType.isInSet(storedMarks || $cursor.marks())
        : ranges.some(({ $from, $to }) => doc.rangeHasMark($from.pos, $to.pos, this.markType));
    }
  },
  methods: {
    toggleMark() {
      const { state, dispatch } = this.editorView;
      toggleMark(state.schema.marks[this.mark])(state, dispatch);
    }
  }
}
</script>

<style>
.text-editor-ribbon-btn {
  opacity: 0.4;
}

.text-editor-ribbon-btn:hover {
  opacity: 0.7;
}

.text-editor-ribbon-btn.active {
  opacity: 1;
}
</style>
