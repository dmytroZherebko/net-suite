<template>
    <div>
        <header class="form-header">
            <router-link
                    class="form-header__back"
                    :to="prevPage"
            >
                &#8678;
            </router-link>
            <h1 class="form-header__title">
                SendToSign
            </h1>
        </header>
        <div class="form">
            <h2 class="form__title">
                {{ this.$route.params.l2f_id ? "Edit SendToSign" : `Create new SendToSign for ${currentDocumentName}.${currentDocumentType} document`}}
            </h2>

            <div class="form-section">
                <div class="form-section__title">
                    SendToSign method.
                </div>
                <div class="form-section__info">
                    <div class="switch-radio">
                        <label class="switch-radio__item" :class="formData.method === 'sendtoeach' ? 'switch-radio__item_active' : ''">
                            <input type="radio" value="sendtoeach" v-model="formData.method" name="status">
                            SendToEach
                        </label>
                        <label class="switch-radio__item" :class="formData.method === 'sendtogroup' ? 'switch-radio__item_active' : ''">
                            <input type="radio" value="sendtogroup" v-model="formData.method" name="status">
                            SendToGroup
                        </label>
                    </div>
                </div>
            </div>
            <div v-if="formData.method === 'sendtogroup'">
                <div class="form-section">
                    <div class="form-section__title">
                        Enter Your Envelope Name.
                    </div>
                    <div class="form-section__info">
                        <input type="text"
                               class="input"
                               :class="{'input_invalid': formErrors.envelope_name}"
                               v-on:input="resetFormError('envelope_name')"
                               v-model="formData.envelope_name"
                               maxlength="255"
                        >
                    </div>
                </div>
                <div class="form-section">
                    <div class="form-section__title">
                        Sign In Order
                    </div>
                    <div class="form-section__info">
                        <label class="switch" :class="{'checked': formData.sign_in_order}">
                            <input type="checkbox" v-model="formData.sign_in_order">
                            <div class="slider"></div>
                        </label>
                    </div>
                </div>
            </div>

            <div v-if="formData.method === 'sendtoeach'">
                <div class="form-section">
                    <div class="form-section__title">
                        Authenticate Signer.
                    </div>
                    <div class="form-section__info">
                        <div class="switch-radio">
                            <label class="switch-radio__item" :class="formData.security_pin === 'standard' ? 'switch-radio__item_active' : ''">
                                <input type="radio" value="standard" v-model="formData.security_pin" name="status">
                                Standard
                            </label>
                            <label class="switch-radio__item" :class="formData.security_pin === 'enhanced' ? 'switch-radio__item_active' : ''">
                                <input type="radio" value="enhanced" v-model="formData.security_pin" name="status">
                                Enhanced
                            </label>
                        </div>
                    </div>
                </div>

                <div v-if="formData.security_pin === 'enhanced'">
                    <div class="form-section">
                        <div class="form-section__title">
                            Authenticate pin
                        </div>
                        <div class="form-section__info">
                            <input type="text"
                                   class="input"
                                   :class="{'input_invalid': formErrors.pin}"
                                   v-on:input="resetFormError('pin')"
                                   v-model="formData.pin"
                            >
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <div class="form-section__title">
                    Send notifications
                </div>
                <div class="form-section__info">
                    <label class="switch" :class="{'checked': formData.sender_notifications}">
                        <input type="checkbox" v-model="formData.sender_notifications">
                        <div class="slider"></div>
                    </label>
                </div>
            </div>

            <div class="recipients">
                <div class="recipient" v-for="(recipient, recipientIndex) in formData.recipients">
                    <div class="recipient__edit">
                        <div class="recipient__edit-action recipient__edit-action_first">
                            <input type="text"
                                   class="input recipient__edit-input-order"
                                   v-if="formData.sign_in_order && formData.method === 'sendtogroup'"
                                   :class="{'input_invalid': recipient.errors.order}"
                                   v-on:input="resetRecipientFormError('order', recipientIndex)"
                                   v-model.number="recipient.order"
                                   maxlength="2"
                            >
                            <input type="text"
                                   class="input"
                                   v-model="recipient.name"
                                   :class="{'input_invalid': recipient.errors.name}"
                                   v-on:input="resetRecipientFormError('name', recipientIndex)"
                                   placeholder="Recipient Name"
                            >
                        </div>
                        <div class="recipient__edit-action">
                            <input type="text"
                                   class="input"
                                   v-model="recipient.email"
                                   :class="{'input_invalid': recipient.errors.email}"
                                   v-on:input="resetRecipientFormError('email', recipientIndex)"
                                   placeholder="Recipient Email"
                            >
                        </div>
                        <div class="recipient__edit-action recipient__edit-action_delete">
                            <button class="button button_secondary"
                                    :disabled="formData.recipients.length === 1"
                                    v-on:click="deleteRecipient(recipientIndex)"
                            >Delete</button>
                        </div>
                        <div class="recipient__edit-action recipient__edit-action_toggle"
                             :class="{ 'is-open': !recipient.isCollapsed}"
                             v-on:click="toggleRecipientSection(recipientIndex)"
                        >
                            Options
                        </div>
                    </div>

                    <div v-if="!recipient.isCollapsed">
                        <div class="form-section">
                            <div class="form-section__title">
                                Require Photo
                            </div>
                            <div class="form-section__info">
                                <label class="switch" :class="{'checked': recipient.require_photo}">
                                    <input type="checkbox" v-model="recipient.require_photo">
                                    <div class="slider"></div>
                                </label>
                            </div>
                        </div>

                        <div class="form-section">
                            <div class="form-section__title">
                                Request additional documents.
                            </div>
                            <div class="form-section__info">
                                <div class="input tags-wrapper ">
                                    <div v-for="(document, index) in recipient.additional_documents"
                                         class="tags__tag"
                                    >
                                        <div class="tags__name">
                                            {{ document }}
                                        </div>
                                        <div class="tags__remove"
                                             v-on:click="removeAdditionalDocument(index, recipientIndex)"
                                        ></div>
                                    </div>
                                    <input v-if="recipient.additional_documents.length < 5"
                                           type="text"
                                           autocomplete="off"
                                           class="input tags__input"
                                           maxlength="70"
                                           v-on:blur="e => {addAdditionalDocument(e, recipientIndex)}"
                                           v-on:keyup.enter="e => {addAdditionalDocument(e, recipientIndex)}"
                                           placeholder="Add document name">
                                </div>
                            </div>
                        </div>

                        <div v-if="formData.method === 'sendtoeach' && formData.security_pin === 'enhanced'">
                            <div class="form-section">
                                <div class="form-section__title">
                                    Phone Authenticate Number
                                </div>
                                <div class="form-section__info">
                                    <input type="text"
                                           class="input"
                                           :class="{'input_invalid': recipient.errors.phone_authenticate}"
                                           v-on:input="resetRecipientFormError('phone_authenticate', recipientIndex)"
                                           v-model="recipient.phone_authenticate"
                                    >
                                </div>
                            </div>
                        </div>

                        <div class="form-section">
                            <div class="form-section__title">
                                Editing Permissions
                            </div>
                            <div class="form-section__info">
                                <div class="switch-radio">
                                    <label class="switch-radio__item" :class="recipient.access === 'signature' ? 'switch-radio__item_active' : ''">
                                        <input type="radio" value="signature" v-model="recipient.access" name="status">
                                        Signature Only
                                    </label>
                                    <label class="switch-radio__item" :class="recipient.access === 'full' ? 'switch-radio__item_active' : ''">
                                        <input type="radio" value="full" v-model="recipient.access" name="status">
                                        Full Access
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="form-section">
                            <div class="form-section__title">
                                Message
                            </div>
                            <div class="form-section__info form-section-message">
                                <div class="form-section-message__subject">Subject:</div>
                                <input type="text"
                                       class="input form-section-message__subject-input"
                                       v-model="recipient.message_subject"
                                       maxlength="255"
                                >
                                <textarea type="text"
                                          class="input input_textarea form-section-message__text"
                                          v-model="recipient.message_text"
                                          placeholder="Message"
                                          maxlength="500"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <button
                            v-on:click="addRecipient"
                            class="button button_add"
                            :disabled="formData.recipients.length >= 20"
                    >Add Another Recipient</button>
                </div>
            </div>

            <button class="button button_primary form-button"
                    v-on:click="submitS2SForm"
            >
                Create SendToSign
            </button>
        </div>
        <modal
                :showModal="showResultModal"
                modalType="alert"
                modalTitle="SendToSign Created"
                v-on:modal-close="closeResultModal"
                v-on:modal-ok="closeResultModal"
        >
            <div class="modal-body text-center" slot="modal-body">
                We Have Sent Your Document to Be Signed!
            </div>
        </modal>
    </div>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex';
  import { isEmailValid } from '../../helpers/utils';
  import Modal from '../common/Modal.vue';

  export default {
    components: {
      Modal
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
      addAdditionalDocument(e, recipientIndex) {
        const value = e.target.value;
        if (!value) return;

        this.formData.recipients[recipientIndex].additional_documents.push(value);
        e.target.value = '';
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
            phone_authenticate: false,
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

          if (this.formData.security_pin === 'enhanced') {
            return this.validateRecipientsPhone();
          }
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
      },
      validateRecipientsPhone() {
        const recipients = this.formData.recipients;
        const len = recipients.length;

        for (let i = 0; i < len; i++) {
          const recipient = recipients[i];
          if (recipient.phone_authenticate.length < 11) {
            recipient.errors.phone_authenticate = true;
            recipient.isCollapsed = false;
            return false;
          }
        }

        return true;
      }
    },
  };
</script>