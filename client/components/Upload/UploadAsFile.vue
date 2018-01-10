<template>
    <form
            novalidate
    >
        <label class="upload-section__file"
               :class="checkOnDragBlock()"
               @dragenter.prevent="onDragEnter"
               @dragleave="onDragLeave"
               @drop.prevent="onDrop"
        >
            <h3 class="upload-section__title">
                Drag and Drop Document Here to Get Started!
            </h3>
            <p class="upload-section__description">
                Use the button below to upload your document to PDFfiller.
                PDFfiller supports PDF, Word, PowerPoint, and Text formats.
            </p>
            <input
                    type="file"
                    accept=".ppt, .pptx, .doc, .docx, .pdf"
                    class="upload-section__input-file"
                    @change="onChooseFile"
            >
            <div class="button button_primary upload-section__upload-button">
                Browse for a Document on Your Computer
            </div>
        </label>
    </form>
</template>

<script>
  import { mapActions } from 'vuex';
  import constants from '../../constants';

  const { actions, errors } = constants;

  export default {
    data() {
      return {
        dragOnFileInput: false,
      };
    },

    props: {
      uploadFile: {
        type: Function,
        required: true
      }
    },

    methods: {
      ...mapActions([
        actions.SET_ERROR
      ]),

      onChooseFile(e) {
        const file = e.target.files[0];
        this.upload(file);
      },

      onDrop(e) {
        const file = e.dataTransfer.files[0];
        this.dragOnFileInput = false;
        this.upload(file);
      },

      upload(file) {
        if (file && this.validateFile(file)) {
          this.uploadFile(file);
        }
      },

      onDragEnter() {
        this.dragOnFileInput = true;
      },

      onDragLeave() {
        this.dragOnFileInput = false;
      },

      checkOnDragBlock() {
        return this.dragOnFileInput ? 'upload-section__file_ondrag' : '';
      },

      validateFile(file) {
        const format = file.name.split('.').pop().toLowerCase();
        if (!/(ppt|pptx|doc|docx|pdf)/.test(format)) {
          this[actions.SET_ERROR](errors.NOT_SUPPORTED_FORMAT);
          return false;
        }

        if (file.size > 26214400) {
          this[actions.SET_ERROR](errors.BIG_FILE);
          return false;
        }

        return true;
      },
    }
  };
</script>