<template>
    <div>
        <header class="link-to-fill-form-header">
            <router-link
                    class="link-to-fill-form-header__back"
                    :to="prevPage"
            >
                &#8678;
            </router-link>
            <h1 class="link-to-fill-form-header__title">
                SendToSign
            </h1>
        </header>
        <div class="link-to-fill-form">
            <h2 class="link-to-fill-form__title">
                {{ this.$route.params.l2f_id ? "Edit SendToSign" : `Create new SendToSign for ${currentDocumentName}.${currentDocumentType} document`}}
            </h2>

            <div class="link-to-fill-form-section">
                <div class="link-to-fill-form-section__title">
                    SendToSign method.
                </div>
                <div class="link-to-fill-form-section__info">
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

            <div class="link-to-fill-form-section">
                <div class="link-to-fill-form-section__title">
                    Send notifications
                </div>
                <div class="link-to-fill-form-section__info">
                    <label class="switch" :class="{'checked': formData.sender_notifications}">
                        <input type="checkbox" v-model="formData.sender_notifications">
                        <div class="slider"></div>
                    </label>
                </div>
            </div>

            <button class="button button_primary link-to-fill-form-button">
                Create LinkToFill
            </button>
        </div>
    </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex';

  export default {
    data() {
      return {
        formData: {
          additional_documents: [],
          notification_emails: []
        },
        prevPage: this.$route.params.prevPage || '/documents',
        showEditModal: false,
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
      if (!this.$route.params.s2s_id) {
        this.formData = this.getS2SDefaultParams();
        this.formData.document_id = this.currentDocumentId;
      }
    },

    methods: {
      ...mapGetters(['getS2SDefaultParams']),
    },

    components: {}
  };
</script>