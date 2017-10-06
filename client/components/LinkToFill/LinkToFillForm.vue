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
                LinkToFill
            </h1>
        </header>
        <div class="form">
            <h2 class="form__title">
                {{ this.$route.params.l2f_id ? "Edit LinkToFill" : `Create new LinkToFill for ${currentDocumentName}.${currentDocumentType} document`}}
            </h2>
            <div class="form-section">
                <div class="form-section__title">
                    Access level for the fill request document.
                </div>
                <div class="form-section__info">
                    <div class="switch-radio">
                        <label class="switch-radio__item" :class="formData.access === 'full' ? 'switch-radio__item_active' : ''">
                            <input type="radio" value="full" v-model="formData.access" name="access">
                            Edit & Sign
                        </label>
                        <label class="switch-radio__item" :class="formData.access === 'signature' ? 'switch-radio__item_active' : ''">
                            <input type="radio" value="signature" v-model="formData.access" name="access">
                            Sign only
                        </label>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <div class="form-section__title">
                    Document access permission.
                </div>
                <div class="form-section__info">
                    <div class="switch-radio">
                        <label class="switch-radio__item" :class="formData.status === 'public' ? 'switch-radio__item_active' : ''">
                            <input type="radio" value="public" v-model="formData.status" name="status">
                            Public
                        </label>
                        <label class="switch-radio__item" :class="formData.status === 'private' ? 'switch-radio__item_active' : ''">
                            <input type="radio" value="private" v-model="formData.status" name="status">
                            Private
                        </label>
                    </div>
                </div>
            </div>

            <div class="form-section">
                <div class="form-section__title">
                    User Can Get a Copy.
                </div>
                <div class="form-section__info">
                    <label class="switch" :class="{'checked': formData.allow_downloads}">
                        <input type="checkbox" v-model="formData.allow_downloads">
                        <div class="slider"></div>
                    </label>
                </div>
            </div>

            <div class="form-section">
                <div class="form-section__title">
                    Require email from recipient
                </div>
                <div class="form-section__info">
                    <label class="switch" :class="{'checked': formData.email_required}">
                        <input type="checkbox" v-model="formData.email_required">
                        <div class="slider"></div>
                    </label>
                </div>
            </div>

            <div class="form-section">
                <div class="form-section__title">
                    Require name from recipient
                </div>
                <div class="form-section__info">
                    <label class="switch" :class="{'checked': formData.name_required}">
                        <input type="checkbox" v-model="formData.name_required">
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
                        <div v-for="(document, index) in formData.additional_documents"
                             class="tags__tag"
                        >
                            <div class="tags__name">
                                {{ document }}
                            </div>
                            <div class="tags__remove"
                                 v-on:click="removeAdditionalDocument(index)"
                            ></div>
                        </div>
                        <input v-if="formData.additional_documents.length < 5"
                               type="text"
                               autocomplete="off"
                               class="input tags__input"
                               maxlength="70"
                               v-on:blur="addAdditionalDocument"
                               v-on:keyup.enter="addAdditionalDocument"
                               placeholder="Add document name">
                    </div>
                </div>
            </div>

            <div class="form-section">
                <div class="form-section__title">
                    Prevent closing document before filling all fields.
                </div>
                <div class="form-section__info">
                    <label class="switch" :class="{'checked': formData.enforce_required_fields}">
                        <input type="checkbox" v-model="formData.enforce_required_fields">
                        <div class="slider"></div>
                    </label>
                </div>
            </div>

            <div class="form-section">
                <div class="form-section__title">
                    Add a "Verified by PDFfiller" signature stamp.
                </div>
                <div class="form-section__info">
                    <label class="switch" :class="{'checked': formData.signature_stamp}">
                        <input type="checkbox" v-model="formData.signature_stamp">
                        <div class="slider"></div>
                    </label>
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

            <div class="form-section">
                <div class="form-section__title">
                    Send Notification to
                </div>
                <div class="form-section__info">
                    <div class="input tags-wrapper ">
                        <div v-for="(user, index) in formData.notification_emails"
                             class="tags__tag"
                        >
                            <div class="tags__name">
                                {{ user.email }}
                            </div>
                            <div class="tags__remove"
                                 v-on:click="removeNotificationEmail(index)"
                            ></div>
                        </div>
                        <input v-if="formData.notification_emails.length < 10"
                               type="text"
                               autocomplete="off"
                               class="input tags__input"
                               :class="notificationEmailError ? 'tags__input_invalid' : ''"
                               maxlength="70"
                               v-on:blur="addNotificationEmail"
                               v-on:keyup.enter="addNotificationEmail"
                               v-on:input="resetNotificationEmailError"
                               placeholder="Add Email Address">
                    </div>
                </div>
            </div>

            <div class="form-section">
                <div class="form-section__title">
                    Shows welcome agreement each time when user will open LinkToFill.
                </div>
                <div class="form-section__info">
                    <label class="switch" :class="{'checked': formData.welcome_screen}">
                        <input type="checkbox" v-model="formData.welcome_screen">
                        <div class="slider"></div>
                    </label>
                </div>
            </div>

            <div class="form-section">
                <div class="form-section__title">
                    LinkToFill Complete Callback Url
                </div>
                <div class="form-section__info">
                    <input class="input" type="text" v-model="formData.callback_url">
                </div>
            </div>

            <div class="form-section">
                <div class="form-section__title">
                    Redirect After Submission
                </div>
                <div class="form-section__info">
                    <input class="input" type="text" v-model="formData.redirect_url">
                </div>
            </div>

            <div class="form-section">
                <div class="form-section__title">
                    LinkToFill Custom Message
                </div>
                <div class="form-section__info">
                    <textarea class="input input_textarea" type="text" v-model="formData.custom_message"></textarea>
                </div>
            </div>

            <div class="form-section">
                <div class="form-section__title">
                    After filling the form it will be copied to the owner as the fillable form.
                </div>
                <div class="form-section__info">
                    <label class="switch" :class="{'checked': formData.reusable}">
                        <input type="checkbox" v-model="formData.reusable">
                        <div class="slider"></div>
                    </label>
                </div>
            </div>
            <button class="button button_primary form-button"
                    v-on:click="createL2F"
            >
                Create LinkToFill
            </button>
        </div>

        <modal
                :showModal="showSubmitModal"
                modalTitle="LinkToFill Url"
                modalType="confirm"
                primaryButton="Copy Link"
                secondaryButton="Go Back"
                @modal-close="closeSubmitModal"
                @modal-cancel="closeSubmitModal"
                @modal-confirm="copyUrl"
        >
            <div class="modal-body" slot="modal-body">
                <div class="text-center margin-bottom">
                    Use this link to access and share your document.
                </div>
                <input type="text" readonly :value="linkToFillUrl" class="input">
            </div>
        </modal>
    </div>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex';
  import { isEmailValid, copyToClipboard } from '../../helpers/utils';
  import Modal from '../common/Modal.vue';

  export default {
    data() {
      return {
        formData: {
          additional_documents: [],
          notification_emails: []
        },
        prevPage: this.$route.params.prevPage || '/documents',
        notificationEmailError: false,
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
        this.formData = this.getL2FDefaultParams();
        this.formData.document_id = this.currentDocumentId;
        this.formData.additional_documents = [];
        const defaultMail = this.formData.notification_emails[0];
        this.formData.notification_emails = [defaultMail];
      }
    },

    methods: {
      ...mapGetters(['getL2FDefaultParams']),
      ...mapActions(['createLinkToFill']),
      addAdditionalDocument(e) {
        const value = e.target.value;
        if (!value) return;

        this.formData.additional_documents.push(value);
        e.target.value = '';
      },

      removeAdditionalDocument(index) {
        this.formData.additional_documents.splice(index, 1);
      },
      resetNotificationEmailError() {
        this.notificationEmailError = false;
      },
      removeNotificationEmail(index) {
        this.formData.notification_emails.splice(index, 1);
      },
      addNotificationEmail(e) {
        const value = e.target.value.trim();
        if (!value) return;

        if (isEmailValid(value)) {
          this.formData.notification_emails.push({ email: value });
          e.target.value = '';
          this.notificationEmailError = false;
        } else {
          this.notificationEmailError = true;
        }
      },
      createL2F() {
        this.createLinkToFill(this.formData)
          .then((url) => {
            this.linkToFillUrl = url;
            this.showSubmitModal = true;
          });
      },
      copyUrl() {
        copyToClipboard(this.linkToFillUrl);
      },
      closeSubmitModal() {
        this.showSubmitModal = false;
        this.$router.push(this.prevPage);
        this.linkToFillUrl = null;
      }
    },

    components: {
      Modal
    }
  };
</script>