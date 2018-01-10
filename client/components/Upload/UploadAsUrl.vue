<template>
    <form
            novalidate
            @submit.prevent="onUrlUploadSubmit"
    >
        <h3 class="upload-section__title">
            Add Documents from the Web
        </h3>
        <p class="upload-section__description">
            Enter the URL of a document hosted online to add it to PDFfiller.
        </p>
        <p class="upload-section__description">
            PDFfiller supports PDF, Word, and PowerPoint files. Max file size: 25 Mb!
        </p>
        <div class="upload-section__input-wrapper">
            <input
                    type="text"
                    class="input"
                    :class="checkUrlError()"
                    placeholder="http://"
                    v-model.trim="uploadFileUrl.value"
                    @input="onChangeUrlValue"
            >
            <button class="button button_primary upload-section__button">
                Upload
            </button>
        </div>
    </form>
</template>

<script>
  export default {
    data() {
      return {
        uploadFileUrl: {
          value: null,
          error: false
        }
      };
    },

    props: {
      uploadFile: {
        type: Function,
        required: true
      }
    },

    methods: {
      onChangeUrlValue() {
        if (this.uploadFileUrl.value) {
          this.uploadFileUrl.error = false;
        }
      },

      checkUrlError() {
        return this.uploadFileUrl.error ? 'input_invalid' : '';
      },

      onUrlUploadSubmit() {
        if (this.uploadFileUrl.value) {
          const url = this.uploadFileUrl.value;
          this.uploadFile(url);
          this.uploadFileUrl.value = null;
          this.uploadFileUrl.error = false;
        } else {
          this.uploadFileUrl.error = true;
        }
      },
    }
  };
</script>