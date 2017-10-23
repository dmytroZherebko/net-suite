import { mapState, mapGetters, mapActions } from 'vuex';
import { isEmailValid, copyToClipboard } from '../../helpers/utils';
import SwitcherComponent from '../common/SwitcherComponent.vue';
import SwitcherRadio from '../common/SwitcherRadio.vue';
import TagsComponent from '../common/TagsComponent.vue';
import FormSection from '../common/FormSection.vue';

import ResultModal from './L2FResultModal.vue';

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
      prevPage: this.$route.params.prevPage || '/documents',
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

  mounted() {
    if (!this.$route.params.l2f_id) {
      this.formData = { ...this.getL2FDefaultParams() };
      this.formData.document_id = this.currentDocumentId;
      this.formData.additional_documents = [];
      const defaultMail = this.formData.notification_emails[0];
      this.formData.notification_emails = [defaultMail];
    }
  },

  methods: {
    ...mapGetters(['getL2FDefaultParams']),
    ...mapActions(['createLinkToFill']),
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
    createL2F() {
      this.createLinkToFill(this.formData)
        .then((url) => {
          this.linkToFillUrl = url;
          this.showSubmitModal = true;
        })
        .catch(() => {});
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
