import { mapState, mapGetters, mapActions } from 'vuex';
import { isEmailValid } from '../../helpers/utils';
import ModalComponent from '../common/ModalComponent.vue';
import SwitcherComponent from '../common/SwitcherComponent.vue';
import SwitcherRadio from '../common/SwitcherRadio.vue';
import TagsComponent from '../common/TagsComponent.vue';
import FormSection from '../common/FormSection.vue';

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
      prevPage: this.$route.params.prevPage || '/documents',
      showResultModal: false
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
    if (!this.$route.params.s2s_id) {
      this.formData = { ...this.getS2SDefaultParams() };
      this.recipientTemplate = this.getS2SDefaultRecipient();
      this.formData.document_id = this.currentDocumentId;
      this.formData.recipients = [];
      this.addDefaultRecipient();
    }
  },

  methods: {
    ...mapGetters(['getS2SDefaultParams', 'getS2SDefaultRecipient']),
    ...mapActions(['createSendToSign']),
    removeAdditionalDocument(index, recipientIndex) {
      this.formData.recipients[recipientIndex].additional_documents.splice(index, 1);
    },
    addAdditionalDocument(value, recipientIndex) {
      if (!value) return;
      if (value.length < 3) {
        this.formData.recipients[recipientIndex].errors.additional_documents = true;
        return;
      }

      this.formData.recipients[recipientIndex].additional_documents.push(value);
    },
    addDefaultRecipient() {
      this.formData.recipients.push({
        ...this.recipientTemplate,
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

    toggleRecipientSection(recipientIndex) {
      this.formData.recipients[recipientIndex].isCollapsed = !this.formData.recipients[recipientIndex].isCollapsed;
    },

    addRecipient() {
      this.formData.recipients.forEach((rec) => {
        rec.isCollapsed = true;
      });
      this.addDefaultRecipient();
    },

    deleteRecipient(index) {
      this.formData.recipients.splice(index, 1);
      this.formData.recipients.forEach((rec, recIndex) => {
        rec.order = recIndex + 1;
      });
    },

    resetFormError(field) {
      this.formErrors[field] = false;
    },

    resetRecipientFormError(field, index) {
      this.formData.recipients[index].errors[field] = false;
    },

    submitS2SForm() {
      if (this.checkFormValid()) {
        this.createSendToSign(this.formData)
          .then(() => {
            this.showResultModal = true;
          })
          .catch(() => {});
      }
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
        return this.validateRecipientsNameAndEmail();
      }

      if (this.formData.method === 'sendtoeach') {
        if (this.formData.security_pin === 'enhanced' && this.formData.pin.length === 0) {
          this.formErrors.pin = true;
          return false;
        }

        if (!this.validateRecipientsNameAndEmail()) return false;
      }

      return true;
    },

    validateRecipientsNameAndEmail() {
      const recipients = this.formData.recipients;
      const len = recipients.length;

      for (let i = 0; i < len; i++) {
        const recipient = recipients[i];
        if (recipient.name.length === 0) {
          recipient.errors.name = true;
          return false;
        }

        if (!isEmailValid(recipient.email)) {
          recipient.errors.email = true;
          return false;
        }
      }

      return true;
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
