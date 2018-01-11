import { mapState, mapGetters, mapActions } from 'vuex';
import { isEmailValid, copyToClipboard } from '../../helpers/utils';
import SwitcherComponent from '../common/SwitcherComponent.vue';
import SwitcherRadio from '../common/SwitcherRadio.vue';
import TagsComponent from '../common/TagsComponent.vue';
import FormSection from '../common/FormSection.vue';

import ResultModal from './L2FResultModal.vue';

import constants from '../../constants';

const { getters, actions, routes } = constants;

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
    }),
    ...mapGetters({
      defaultL2FConfig: getters.GET_L2F_DEFAULT_PARAMS
    }),
  },

  async mounted() {
    if (!this.$route.params.l2f_id) {
      let documentId = this.currentDocumentId;
      if (this.prevPage === routes.INTEGRATION_DOCUMENTS.path) {
        const documentIds = await this[actions.CREATE_INTEGRATION_DOCUMENT_IN_PDFFILLER]();
        documentId = documentIds.projectId;
      }
      this.formData = { ...this.defaultL2FConfig };
      this.formData.document_id = documentId;
      this.formData.additional_documents = [...this.formData.additional_documents];
    }
  },

  methods: {
    ...mapActions([
      actions.CREATE_L2F,
      actions.CREATE_INTEGRATION_DOCUMENT_IN_PDFFILLER,
    ]),
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
      this.notificationEmailError = false;
    },
    resetAdditionalDocumentError() {
      this.additionalDocumentError = false;
    },

    addNotificationEmail(email) {
      if (!email) return;
      if (isEmailValid(email)) {
        this.formData.notification_emails.push({ email });
      } else {
        this.notificationEmailError = true;
      }
    },

    removeNotificationEmail(index) {
      this.formData.notification_emails.splice(index, 1);
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
      this.linkToFillUrl = null;
      this.$router.push(this.prevPage);
    }
  }
};
