<template>
    <div class="column-aside">
        <button class="button button_menu" @click="openModal" v-if="buttons.upload.show">
            {{buttons.upload.title}}
        </button>
        <modal-component
                :show-modal="showModal"
                :show-buttons="false"
                modal-title="Upload Document"
                modal-type="modal"
                modal-class="modal_uploader"
                @modal-close="closeModal"
        >
            <div slot="modal-body">
                <div class="uploader">
                    <ul class="upload-options">
                        <li
                            v-for="option in uploadOptions"
                            :key="option.type"
                            :class="checkOptionIsActive(option.type)"
                            class="upload-options__item"
                            @click="changeUploadOption(option.type)">
                            {{ option.title }}
                        </li>
                    </ul>
                    <div class="upload-section">
                        <upload-as-file
                                v-if="currentOption === 'file'"
                                :uploadFile="uploadFile"
                        />
                        <upload-as-url
                                v-if="currentOption === 'url'"
                                :uploadFile="uploadFile"
                        />
                    </div>
                </div>
            </div>
        </modal-component>
        <success-upload-modal
                :show-upload-modal="showSuccessUploadModal"
                :close-success-upload-modal="closeSuccessModal"
        />
    </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import ModalComponent from '../common/ModalComponent.vue';
  import SuccessUploadModal from '../common/SuccessUploadModal.vue';
  import UploadAsUrl from './UploadAsUrl.vue';
  import UploadAsFile from './UploadAsFile.vue';
  import constants from '../../constants';

  const { actions } = constants;

  export default {
    components: {
      ModalComponent,
      UploadAsUrl,
      UploadAsFile,
      SuccessUploadModal,
    },

    data() {
      return {
        showModal: false,
        showSuccessUploadModal: false,
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

    computed: {
      ...mapState({
        buttons: state => state.buttons,
      }),
    },
    methods: {
      ...mapActions([
        actions.UPLOAD_DOCUMENT,
      ]),

      openModal() {
        this.showModal = true;
      },

      closeModal() {
        this.showModal = false;
      },

      closeSuccessModal() {
        this.showSuccessUploadModal = false;
      },

      changeUploadOption(type) {
        this.currentOption = type;
      },

      checkOptionIsActive(type) {
        return type === this.currentOption ? 'upload-options__item_active' : '';
      },

      async uploadFile(file) {
        try {
          this.closeModal();
          await this[actions.UPLOAD_DOCUMENT](file);
          this.showSuccessUploadModal = true;
        } catch (err) { console.log(err); } // eslint-disable-line
      },
    }
  };
</script>