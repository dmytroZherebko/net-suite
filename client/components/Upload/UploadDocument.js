import { mapActions, mapState } from 'vuex';
import ModalComponent from '../common/ModalComponent.vue';
import constants from '../../constants';

const { actions, errors } = constants;

export default {
  components: {
    ModalComponent
  },

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

  computed: {
    ...mapState({
      buttons: state => state.buttons,
    }),
  },
  methods: {
    ...mapActions([
      actions.UPLOAD_DOCUMENT,
      actions.SET_ERROR
    ]),

    openModal() {
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.uploadFileUrl.value = null;
      this.uploadFileUrl.error = false;
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

    onChangeUrlValue() {
      if (this.uploadFileUrl.value) {
        this.uploadFileUrl.error = false;
      }
    },

    checkUrlError() {
      return this.uploadFileUrl.error ? 'input_invalid' : '';
    },

    async onUrlUploadSubmit() {
      try {
        if (this.uploadFileUrl.value) {
          const url = this.uploadFileUrl.value;
          this.closeModal();
          await this[actions.UPLOAD_DOCUMENT](url);
          this.showSuccessUploadModal = true;
        } else {
          this.uploadFileUrl.error = true;
        }
      } catch (err) { console.log(err); } // eslint-disable-line
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

    async upload(file) {
      try {
        if (file && this.validateFile(file)) {
          this.closeModal();
          await this[actions.UPLOAD_DOCUMENT](file);
          this.showSuccessUploadModal = true;
        }
      } catch (err) { console.log(err); } // eslint-disable-line
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
