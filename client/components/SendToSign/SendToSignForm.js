import { mapState, mapGetters, mapActions } from 'vuex';
import { isEmailValid } from '../../helpers/utils';
import ModalComponent from '../common/ModalComponent.vue';
import SwitcherComponent from '../common/SwitcherComponent.vue';
import SwitcherRadio from '../common/SwitcherRadio.vue';
import TagsComponent from '../common/TagsComponent.vue';
import FormSection from '../common/FormSection.vue';
import constants from '../../constants';

const { actions, getters, routes } = constants;

export default {
  components: {
    ModalComponent,
    SwitcherComponent,
    SwitcherRadio,
    TagsComponent,
    FormSection
  },

  data() {
    return {
      formData: {
        recipients: [],
      },
      formErrors: {
        envelope_name: false,
        pin: false
      },
      prevPage: this.$route.query.prevPage || '/documents',
      showResultModal: false
    };
  },

  computed: {
    ...mapState({
      currentDocumentId: state => state.documents.currentDocument.id,
      currentDocumentName: state => state.documents.currentDocument.name,
      currentDocumentType: state => state.documents.currentDocument.type,
    }),
    ...mapGetters({
      s2sDefaultParams: getters.GET_S2S_DEFAULT_PARAMS,
      s2sRecipientDefaultParams: getters.GET_S2S_DEFAULT_RECIPIENT
    }),
  },

  async mounted() {
    if (!this.$route.params.s2s_id) {
      let documentId = this.currentDocumentId;
      if (this.prevPage === routes.INTEGRATION_DOCUMENTS.path) {
        const documentIds = await this[actions.CREATE_INTEGRATION_DOCUMENT_IN_PDFFILLER]();
        documentId = documentIds.projectId;
      }
      this.formData = { ...this.s2sDefaultParams };
      this.formData.document_id = documentId;
      this.formData.recipients = [];
      this.addDefaultRecipient();
    }
  },

  methods: {
    ...mapActions([
      actions.CREATE_S2S,
      actions.CREATE_INTEGRATION_DOCUMENT_IN_PDFFILLER,
    ]),

    addDefaultRecipient() {
      this.formData.recipients.push({
        ...this.s2sRecipientDefaultParams,
        additional_documents: [],
        isCollapsed: false,
        order: this.formData.recipients.length + 1,
        errors: {
          name: false,
          email: false,
          additional_documents: false,
          order: false
        }
      });
    },

    addRecipient() {
      this.collapseAppRecipients();
      this.addDefaultRecipient();
    },

    collapseAppRecipients() {
      this.formData.recipients.forEach((rec) => {
        rec.isCollapsed = true;
      });
    },

    deleteRecipient(index) {
      this.formData.recipients.splice(index, 1);
      this.formData.recipients.forEach((rec, recIndex) => {
        rec.order = recIndex + 1;
      });
    },

    addAdditionalDocument(value, recipientIndex) {
      if (!value) return;
      if (value.length < 3) {
        this.formData.recipients[recipientIndex].errors.additional_documents = true;
        return;
      }

      this.formData.recipients[recipientIndex].additional_documents.push(value);
    },

    removeAdditionalDocument(index, recipientIndex) {
      this.formData.recipients[recipientIndex].additional_documents.splice(index, 1);
    },

    toggleRecipientSection(recipientIndex) {
      this.formData.recipients[recipientIndex].isCollapsed = !this.formData.recipients[recipientIndex].isCollapsed;
    },

    resetFormError(field) {
      this.formErrors[field] = false;
    },

    resetRecipientFormError(field, index) {
      this.formData.recipients[index].errors[field] = false;
    },

    async submitS2SForm() {
      try {
        if (this.checkFormValid()) {
          await this[actions.CREATE_S2S](this.formData);
          this.showResultModal = true;
        }
      } catch (err) { console.log(err); } // eslint-disable-line
    },

    closeResultModal() {
      this.showResultModal = false;
      this.$router.push(this.prevPage);
    },

    checkFormValid() {
      if (this.formData.method === 'sendtogroup') {
        if (this.formData.envelope_name.length === 0) {
          this.formErrors.envelope_name = true;
          return false;
        }
        if (this.formData.sign_in_order && !this.validateRecipientsOrder()) {
          return false;
        }
        return this.validateRecipients();
      }

      if (this.formData.method === 'sendtoeach') {
        if (this.formData.security_pin === 'enhanced' && this.formData.pin.length === 0) {
          this.formErrors.pin = true;
          return false;
        }

        return this.validateRecipients();
      }
    },

    validateRecipients() {
      const recipients = this.formData.recipients;
      const len = recipients.length;

      for (let i = 0; i < len; i++) {
        const recipient = recipients[i];
        if (recipient.name.length === 0) {
          this.setRecipientFieldError(recipient, 'name');
          return false;
        }

        if (!isEmailValid(recipient.email)) {
          this.setRecipientFieldError(recipient, 'email');
          return false;
        }

        if (this.formData.method === 'sendtoeach' && this.formData.security_pin === 'enhanced' && !recipient.phone_authenticate) {
          this.setRecipientFieldError(recipient, 'phone_authenticate');
          return false;
        }
      }

      return true;
    },

    setRecipientFieldError(recipient, field) {
      recipient.errors[field] = true;
      this.collapseAppRecipients();
      recipient.isCollapsed = false;
    },

    validateRecipientsOrder() {
      const recipients = this.formData.recipients;
      const len = recipients.length;
      const orderArray = [];

      for (let i = 0; i < len; i++) {
        const recipient = recipients[i];
        if (isNaN(recipient.order) || recipient.order < 1) {
          recipient.errors.order = true;
          return false;
        }

        if (orderArray.indexOf(recipient.order) >= 0) {
          recipient.errors.order = true;
          return false;
        }

        orderArray.push(recipient.order);
      }

      return true;
    }
  },
};
