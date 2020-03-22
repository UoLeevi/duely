<template>
  <div class="form-page-cell d-flex flex-column ma-4" :style="{ 'min-width': width == null ? `${ adjustSize(400, 0.2) }px` : 'unset', 'width': width == null ? 'auto' : typeof width === 'string' ? width : `${ width }px` }">
    <h4 class="f-3b surface--text text--lighten2 pa-0">{{ heading }}</h4>
    <h5 class="f-2 pt-0 pb-3 background--text text--darken3">{{ subheading }}</h5>
    <div class="form-page-cell-slot d-flex ma-n2 flex-grow-1" :class="{ 'flex-column': column, 'flex-row': row }">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    width: [String, Number],
    heading: String,
    subheading: String,
    column: Boolean,
    row: Boolean
  }
}
</script>

<style>
.form-page-cell {
  box-sizing: border-box;
  position: relative;
}

.form-page-cell div.form-page-cell-slot.flex-column {
  margin-top: 0 !important;
}

.form-page-cell div.form-page-cell-slot > * {
  margin: 8px !important;
}

.form-page-cell div.form-page-cell-slot.flex-column > *:last-child {
  margin-top: auto !important;
}

.form-page-cell div.form-page-cell-slot.flex-column > *:nth-last-child(2) {
  margin-bottom: 16px !important;
}

</style>
