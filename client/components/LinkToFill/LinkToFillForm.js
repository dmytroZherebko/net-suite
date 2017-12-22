import { mapState, mapGetters, mapActions } from 'vuex';
import { isEmailValid, copyToClipboard } from '../../helpers/utils';
import SwitcherComponent from '../common/SwitcherComponent.vue';
import SwitcherRadio from '../common/SwitcherRadio.vue';
import TagsComponent from '../common/TagsComponent.vue';
import FormSection from '../common/FormSection.vue';

import ResultModal from './L2FResultModal.vue';

import constants from '../../constants';

const { getters, actions } = constants;

export default {
  components: {
    ResultModal,
    SwitcherComponent,
    SwitcherRadio,
    TagsComponent,
    FormSection
  },

  data() {
    return {
      formData: {
        additional_documents: [],
        notification_emails: []
      },
      prevPage: this.$route.query.prevPage || '/documents',
      notificationEmailError: false,
      additionalDocumentError: false,
      linkToFillUrl: null,
      showSubmitModal: false
    };
  },

  computed: {
    ...mapState({
      currentDocumentId: state => state.documents.currentDocument.id,
      currentDocumentName: state => state.documents.currentDocument.name,
      currentDocumentType: state => state.documents.currentDocument.type,
    })
  },

  async mounted() {
    if (!this.$route.params.l2f_id) {
      let documentId = this.currentDocumentId;
      if (this.prevPage === '/integration-documents') {
        documentId = await this[actions.CREATE_INTEGRATION_DOCUMENT_IN_PDFFILLER]();
      }
      this.formData = { ...this[getters.GET_L2F_DEFAULT_PARAMS]() };
      this.formData.document_id = documentId;
      this.formData.additional_documents = [];
      const defaultMail = this.formData.notification_emails[0];
      this.formData.notification_emails = [defaultMail];
    }
  },

  methods: {
    ...mapGetters([getters.GET_L2F_DEFAULT_PARAMS]),
    ...mapActions([actions.CREATE_L2F]),
    addAdditionalDocument(value) {
      if (!value) return;
      if (value.length < 3) {
        this.additionalDocumentError = true;
        return;
      }
      this.formData.additional_documents.push(value);
    },

    removeAdditionalDocument(index) {
      this.formData.additional_documents.splice(index, 1);
    },
    resetNotificationEmailError() {
      if (this.notificationEmailError) {
        this.notificationEmailError = false;
      }
    },
    resetAdditionalDocumentError() {
      if (this.additionalDocumentError) {
        this.additionalDocumentError = false;
      }
    },
    removeNotificationEmail(index) {
      this.formData.notification_emails.splice(index, 1);
    },
    addNotificationEmail(value) {
      if (!value) return;

      if (isEmailValid(value)) {
        this.formData.notification_emails.push({ email: value });
      } else {
        this.notificationEmailError = true;
      }
    },
    async createL2F() {
      try {
        this.linkToFillUrl = await this[actions.CREATE_L2F]({ ...this.formData });
        this.showSubmitModal = true;
      } catch (err) { console.log(err); } // eslint-disable-line
    },
    copyUrl() {
      copyToClipboard(this.linkToFillUrl);
    },
    closeSubmitModal() {
      this.showSubmitModal = false;
      this.$router.push(this.prevPage);
      this.linkToFillUrl = null;
    }
  }
};
