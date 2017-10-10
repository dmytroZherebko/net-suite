<template>
    <div class="column-aside">
        <button class="button button_menu" v-on:click="openModal">
            Upload
        </button>
        <modal
                :showModal="showModal"
                :showButtons="false"
                modalTitle="Upload Document"
                modalType="modal"
                modalClass="modal_uploader"
                @modal-close="closeModal"
        >
            <div slot="modal-body">
                <div class="uploader">
                    <ul class="upload-options">
                        <li
                            v-for="option in uploadOptions"
                            :class="checkOptionIsActive(option.type)"
                            class="upload-options__item"
                            v-on:click="changeUploadOption(option.type)">
                            {{ option.title }}
                        </li>
                    </ul>
                    <div class="upload-section">
                        <div v-if="currentOption === 'file'">
                            <form
                                  novalidate
                                  v-on:submit.prevent=""
                            >
                                <label class="upload-section__file"
                                       :class="checkOnDragBlock()"
                                       v-on:dragenter.prevent="onDragEnter"
                                       v-on:dragleave="onDragLeave"
                                       v-on:drop.prevent="onDrop"
                                       v-on:dragover.prevent=""
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
                                            v-on:change="onChooseFile"
                                    >
                                    <div class="button button_primary upload-section__upload-button">
                                        Browse for a Document on Your Computer
                                    </div>
                                </label>
                            </form>
                        </div>
                        <div v-if="currentOption === 'url'">
                            <form
                                    novalidate
                                    v-on:submit.prevent="onUrlUploadSubmit"
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
                                            v-on:input="onChangeUrlValue"
                                    >
                                    <button class="button button_primary upload-section__button">
                                        Upload
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </modal>
        <modal
                :showModal="showSuccessUploadModal"
                modalTitle="Successful upload"
                modalType="alert"
                @modal-close="closeSuccessModal"
                @modal-ok="closeSuccessModal"
        >
            <div class="modal-body text-center" slot="modal-body">
                File was successfully uploaded.
            </div>
        </modal>
    </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import Modal from '../common/Modal.vue';

  export default {
    data() {
      return {
        showModal: false,
        showSuccessUploadModal: false,
        uploadFileUrl: {
          value: null,
          error: false
        },
        dragOnFileInput: false,
        uploadOptions: [
          {
            title: 'Upload Document',
            type: 'file'
          },
          {
            title: 'Enter URL of Document',
            type: 'url'
          }
        ],
        currentOption: 'file'
      };
    },
    methods: {
      closeModal() {
        this.showModal = false;
        this.uploadFileUrl.value = null;
        this.uploadFileUrl.error = false;
      },
      closeSuccessModal() {
        this.showSuccessUploadModal = false;
      },
      openModal() {
        this.showModal = true;
      },
      changeUploadOption(type) {
        this.currentOption = type;
      },
      checkOptionIsActive(type) {
        return type === this.currentOption ? 'upload-options__item_active' : '';
      },
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
          this.uploadDocument(this.uploadFileUrl.value)
            .then(() => {
              this.showSuccessUploadModal = true;
            })
            .catch(() => {});
          this.closeModal();
        } else {
          this.uploadFileUrl.error = true;
        }
      },
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
          this.closeModal();
          this.uploadDocument(file)
            .then(() => {
              this.showSuccessUploadModal = true;
            })
            .catch(() => {});
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
          this.setError('PDFfiller supports PDF, Word, and PowerPoint files.');
          return false;
        }

        if (file.size > 26214400) {
          this.setError('File size is limited to 25 Mb! Please select a smaller file.');
          return false;
        }

        return true;
      },
      ...mapActions([
        'uploadDocument',
        'setError'
      ])
    },
    components: {
      Modal
    }
  };
</script>