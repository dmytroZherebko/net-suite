<template>
    <div class="documents-aside column-aside" v-if="!filepicker">
        <open-document
                v-if="buttons.open.show"
                :disabled="documentIsHidden || !currentDocumentId"
                :title="buttons.open.title"
        />
        <button-component
                v-if="buttons.download.show"
                :disabled="documentIsHidden || !currentDocumentId"
                :buttonAction="downloadDocument"
                :title="buttons.download.title"
        />
        <button-component
                v-if="buttons.l2f.show"
                :disabled="documentIsHidden || !currentDocumentId"
                :title="buttons.l2f.title"
                :route="true"
                url="/link-to-fill/create"
        />
        <button-component
                v-if="buttons.s2s.show"
                :disabled="documentIsHidden || !currentDocumentId"
                :title="buttons.s2s.title"
                :route="true"
                url="/send-to-sign/create"
        />
        <button-component
                v-if="buttons.uploadToIntegration.show"
                :disabled="!currentDocumentId"
                :title="buttons.uploadToIntegration.title"
        />
        <delete-document
                v-if="buttons.delete.show"
                :delete-document="deleteDocument"
                :disabled="documentIsHidden || !currentDocumentId"
                :title="buttons.delete.title"
        />
        <button-component
                v-if="buttons.uploadToPDFfiller.show"
                :disabled="documentIsHidden || !currentDocumentId"
                :buttonAction="uploadFromIntegration"
                :title="buttons.uploadToPDFfiller.title"
        />
        <success-upload-modal
                :show-upload-modal="showSuccessUploadToIntegrationModal"
                :close-success-upload-modal="closeSuccessUploadToIntegrationModal"
        />
    </div>
</template>

<script>
  import { mapState, mapActions, mapGetters } from 'vuex';
  import DeleteDocument from './DocumentDelete.vue';
  import OpenDocument from '../common/DocumentOpen.vue';
  import ButtonComponent from '../common/ButtonComponent.vue';
  import SuccessUploadModal from '../common/SuccessUploadModal.vue';
  import constants from '../../constants';

  const { actions, getters, routes } = constants;

  export default {
    components: {
      DeleteDocument,
      OpenDocument,
      ButtonComponent,
      SuccessUploadModal,
    },

    data() {
      return {
        showSuccessUploadToIntegrationModal: false
      };
    },

    computed: {
      ...mapState({
        currentDocumentId: state => state.documents.currentDocument.id,
        documentIsHidden: state => state.documents.currentDocument.hidden,
        filepicker: state => state.filepicker,
      }),
      ...mapGetters({
        buttons: getters.GET_BUTTONS_FOR_PAGE
      })
    },

    methods: {
      ...mapActions([
        actions.DELETE_DOCUMENT_BY_ID,
        actions.RESET_CURRENT_DOCUMENT,
        actions.DOWNLOAD_DOCUMENT,
        actions.UPLOAD_INTEGRATION_DOCUMENT_TO_PDFFILLER,
      ]),

      deleteDocument() {
        this[actions.DELETE_DOCUMENT_BY_ID]();
        this[actions.RESET_CURRENT_DOCUMENT]();
      },

      downloadDocument() {
        this[actions.DOWNLOAD_DOCUMENT]();
      },

      async uploadFromIntegration() {
        try {
          await this[actions.UPLOAD_INTEGRATION_DOCUMENT_TO_PDFFILLER]();
          this.showSuccessUploadToIntegrationModal = true;
        } catch (err) { console.log(err); } // eslint-disable-line
      },

      closeSuccessUploadToIntegrationModal() {
        this.showSuccessUploadToIntegrationModal = false;
        this.$router.push({ name: routes.DOCUMENTS.name });
      },

      async uploadToIntegration() {
        try {
          await this[actions.UPLOAD_DOCUMENT_TO_INTEGRATION]();
          this.showSuccessUploadToIntegrationModal = true;
        } catch (err) { console.log(err); } // eslint-disable-line
      },
    },
  };
</script>