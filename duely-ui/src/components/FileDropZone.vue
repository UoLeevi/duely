<template>
  <div class="file-drop-zone" :class="`${status.toLowerCase()}`" @dragover.stop.prevent @dragenter.stop.prevent="dragenter" @dragleave.stop.prevent="dragleave" @drop.stop.prevent="drop" :style="{ 'width': /\d$/.test(width) ? width + 'px' : width, 'height': /\d$/.test(height) ? height + 'px' : height, 'background-color': backgroundColorHex }">
    <p v-if="['INITIAL', 'DRAGGING'].includes(status)" class="hint">{{ hint }}</p>
    <template v-else-if="['PROCESSING'].includes(status)">
      <v-progress-circular indeterminate color="primary" />
      <p>Processing file '{{ file.name }}'...</p>
    </template>
    <slot v-else-if="['FILE_PROCESSED'].includes(status)" v-bind:file="file" v-bind:data="data">
      <p>{{ file.name }} <span>({{ file.size }}B)</span></p>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    hint: {
      type: String,
      default: 'Drop files here or click to upload'
    },
    backgroundColor: {
      type: String,
      default: 'background'
    },
    width: {
      type: [String, Number],
      default: '100%'
    },
    height: {
      type: [String, Number],
      default: '100%'
    },
    decoder: {
      type: Function
    }
  },
  data() {
    return {
      status: 'INITIAL',
      file: null,
      data: null,
      message: null,
      draggingCounter: 0
    };
  },
  computed: {
    backgroundColorHex() {
      switch (this.status) {
        case 'INITIAL':
          return this.colorex(this.backgroundColor);

        case 'DRAGGING':
          return this.changeBrightness(this.colorex(this.backgroundColor), -0.1);

        default:
          return this.colorex(this.backgroundColor);
      }
    }
  },
  methods: {
    processFile(file) {
      try {
        this.status = 'PROCESSING';
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => { 
          this.data = this.decoder ? this.decoder(reader.result) : reader.result;
          this.message = null;
          this.status = 'FILE_PROCESSED';
          this.$emit('data', this.data);
        };
        reader.onerror = err => {
          this.file = null;
          this.data = null;
          this.message = err.message;
          this.status = 'ERROR';
          this.$emit('error', err);
        };
      } catch (err) {
        this.file = null;
        this.data = null;
        this.message = err.message;
        this.status = 'ERROR';
        this.$emit('error', err);
      }
    },
    dragenter() {
      if (!['INITIAL', 'DRAGGING'].includes(this.status))
        return;

      ++this.draggingCounter;
      this.status = 'DRAGGING';
    },
    dragleave() {
      if (this.status !== 'DRAGGING')
        return;

      if (--this.draggingCounter === 0)
        this.status = 'INITIAL';
    },
    drop(e) {
      if (this.status !== 'DRAGGING')
        return;

      if (e.dataTransfer.items) {
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (e.dataTransfer.items[i].kind === 'file') {
            this.file = e.dataTransfer.items[i].getAsFile();
            this.processFile(this.file);
            return;
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          this.file = e.dataTransfer.files[i];
          this.processFile(this.file);
          return;
        }
      }

      this.status = 'ERROR';
      this.message = 'No file was dropped.';
    }
  }
};
</script>

<style scoped>
.file-drop-zone {
  transition: background-color 100ms ease;
  display: flex;
  justify-content: center;
  align-items: center;
}

.file-drop-zone .hint {
  font-weight: 600;
  letter-spacing: 0.02em;
}
</style>
