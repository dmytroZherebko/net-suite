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
                                  v-on:submit=""
                                  class="upload-section__file"
                                  :class="checkOnDragBlock()"
                                  v-on:dragenter="onDragEnter"
                                  v-on:dragleave="onDragLeave"
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
                                        accept=".ppt, .pptx, .doc, .docx, .pdf, .txt, .rtf"
                                        class="upload-section__input-file"
                                        v-on:change="onChooseFile"
                                >
                                <button type="button" class="button button_primary upload-section__upload-button">
                                    Browse for a Document on Your Computer
                                </button>
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
                                    PDFfiller supports PDF, Word, PowerPoint, and Text formats.
                                </p>
                                <div class="upload-section__input-wrapper">
                                    <input
                                            type="text"
                                            class="input"
                                            placeholder="http://"
                                            v-model="uploadFileUrl"
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
    </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import Modal from '../common/Modal.vue';

  export default {
    data() {
      return {
        showModal: false,
        uploadFileUrl: null,
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
      onUrlUploadSubmit() {
        this.uploadDocument(this.uploadFileUrl);
        this.uploadFileUrl = null;
        this.closeModal();
      },
      onChooseFile(e) {
        this.closeModal();
        this.uploadDocument(e.target.files[0]);
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
      ...mapActions([
        'uploadDocument'
      ])
    },
    components: {
      Modal
    }
  };
</script>