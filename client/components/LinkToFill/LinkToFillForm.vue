<template>
    <div>
        <header class="link-to-fill-form-header">
            <router-link
                    class="link-to-fill-form-header__back"
                    :to="$route.params.prevPage || '/documents'"
            >
                &#8678;
            </router-link>
            <h1 class="link-to-fill-form-header__title">
                LinkToFill
            </h1>
        </header>
        <div class="link-to-fill-form">
            <h2 class="link-to-fill-form__title">
                {{ this.$route.params.l2f_id ? "Edit LinkToFill" : `Create new LinkToFill for ${currentDocumentName}.${currentDocumentType} document`}}
            </h2>
            <div class="link-to-fill-form-section">
                <div class="link-to-fill-form-section__title">
                    Access level for the fill request document.
                </div>
                <div class="link-to-fill-form-section__info">
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

            <div class="link-to-fill-form-section">
                <div class="link-to-fill-form-section__title">
                    Document access permission.
                </div>
                <div class="link-to-fill-form-section__info">
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

            <div class="link-to-fill-form-section">
                <div class="link-to-fill-form-section__title">
                    User Can Get a Copy.
                </div>
                <div class="link-to-fill-form-section__info">
                    <label class="switch" :class="{'checked': formData.allow_downloads}">
                        <input type="checkbox" v-model="formData.allow_downloads">
                        <div class="slider"></div>
                    </label>
                </div>
            </div>

            <div class="link-to-fill-form-section">
                <div class="link-to-fill-form-section__title">
                    Require email from recipient
                </div>
                <div class="link-to-fill-form-section__info">
                    <label class="switch" :class="{'checked': formData.email_required}">
                        <input type="checkbox" v-model="formData.email_required">
                        <div class="slider"></div>
                    </label>
                </div>
            </div>

            <div class="link-to-fill-form-section">
                <div class="link-to-fill-form-section__title">
                    Require name from recipient
                </div>
                <div class="link-to-fill-form-section__info">
                    <label class="switch" :class="{'checked': formData.name_required}">
                        <input type="checkbox" v-model="formData.name_required">
                        <div class="slider"></div>
                    </label>
                </div>
            </div>

            <div class="link-to-fill-form-section">
                <div class="link-to-fill-form-section__title">
                    Prevent closing document before filling all fields.
                </div>
                <div class="link-to-fill-form-section__info">
                    <label class="switch" :class="{'checked': formData.enforce_required_fields}">
                        <input type="checkbox" v-model="formData.enforce_required_fields">
                        <div class="slider"></div>
                    </label>
                </div>
            </div>

            <div class="link-to-fill-form-section">
                <div class="link-to-fill-form-section__title">
                    Add a "Verified by PDFfiller" signature stamp.
                </div>
                <div class="link-to-fill-form-section__info">
                    <label class="switch" :class="{'checked': formData.signature_stamp}">
                        <input type="checkbox" v-model="formData.signature_stamp">
                        <div class="slider"></div>
                    </label>
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

            <div class="link-to-fill-form-section">
                <div class="link-to-fill-form-section__title">
                    Shows welcome agreement each time when user will open LinkToFill.
                </div>
                <div class="link-to-fill-form-section__info">
                    <label class="switch" :class="{'checked': formData.welcome_screen}">
                        <input type="checkbox" v-model="formData.welcome_screen">
                        <div class="slider"></div>
                    </label>
                </div>
            </div>

            <div class="link-to-fill-form-section">
                <div class="link-to-fill-form-section__title">
                    LinkToFill Complete Callback Url
                </div>
                <div class="link-to-fill-form-section__info">
                    <input class="input" type="text" v-model="formData.callback_url">
                </div>
            </div>

            <div class="link-to-fill-form-section">
                <div class="link-to-fill-form-section__title">
                    LinkToFill Custom Message
                </div>
                <div class="link-to-fill-form-section__info">
                    <textarea class="input input_textarea" type="text" v-model="formData.custom_message"></textarea>
                </div>
            </div>

            <div class="link-to-fill-form-section">
                <div class="link-to-fill-form-section__title">
                    After filling the form it will be copied to the owner as the fillable form.
                </div>
                <div class="link-to-fill-form-section__info">
                    <label class="switch" :class="{'checked': formData.reusable}">
                        <input type="checkbox" v-model="formData.reusable">
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
        formData: {},
        showEditModal: false
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
        this.formData = this.getDefaultParams();
        this.formData.document_id = this.currentDocumentId;
      }
    },

    methods: {
      ...mapGetters(['getDefaultParams']),
    },

    components: {}
  };
</script>