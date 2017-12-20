<template>
    <div class="documents-page">
        <documents-list
                :documents="documents"
                :current-page="currentPage"
                :items-per-page="perPage"
                :total-items="totalItems"
                :page-changed="pageChanged"
                :current-document-id="currentDocumentId"
                :change-current-document="changeCurrentDocument"
        />
        <div class="documents-aside column-aside" v-if="!filepicker">
            <button
                    :disabled="documentIsHidden || !currentDocumentId"
                    class="button button_menu margin-bottom"
                    @click="upload"
            >
                Upload to PDFfiller
            </button>
        </div>
        <modal-component
                :show-modal="showSuccessModal"
                modal-title="Successful upload"
                modal-type="alert"
                @modal-close="closeSuccessUploadModal"
                @modal-ok="closeSuccessUploadModal"
        >
            <div class="modal-body text-center" slot="modal-body">
                File was successfully uploaded.
            </div>
        </modal-component>
    </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import DocumentsList from '../common/DocumentsList.vue';
  import ModalComponent from '../common/ModalComponent.vue';
  import constants from '../../constants';

  const { actions } = constants;

  export default {
    components: {
      DocumentsList,
      ModalComponent,
    },

    data() {
      return {
        showSuccessModal: false
      };
    },

    computed: {
      ...mapState({
        currentPage: state => state.integrationDocuments.currentPage,
        documents: state => state.integrationDocuments.documentsList,
        totalItems: state => state.integrationDocuments.total,
        perPage: state => state.integrationDocuments.perPage,
        currentDocumentId: state => state.integrationDocuments.currentDocument.id,
        documentIsHidden: state => state.integrationDocuments.currentDocument.hidden,
      }),
    },

    mounted() {
      this[actions.GET_INTEGRATIONS_PAGE_DOCUMENTS]();
    },

    methods: {
      pageChanged(page) {
        if (page === this.currentPage) return;
        this[actions.GET_INTEGRATIONS_PAGE_DOCUMENTS]({ currentPage: page });
        this[actions.RESET_INTEGRATION_CURRENT_DOCUMENT]();
      },

      changeCurrentDocument(doc) {
        if (this.currentDocumentId !== doc.id) {
          this[actions.SET_INTEGRATION_CURRENT_DOCUMENT](doc);
        }
      },

      closeSuccessUploadModal() {
        this.showSuccessModal = false;
        this.$router.push({ name: 'documents' });
      },

      async upload() {
        try {
          await this[actions.UPLOAD_INTEGRATION_DOCUMENT_TO_PDFFILLER]();
          this.showSuccessModal = true;
        } catch (err) { console.log(err); } // eslint-disable-line
      },

      ...mapActions([
        actions.GET_INTEGRATIONS_PAGE_DOCUMENTS,
        actions.UPLOAD_INTEGRATION_DOCUMENT_TO_PDFFILLER,
        actions.SET_INTEGRATION_CURRENT_DOCUMENT,
        actions.RESET_INTEGRATION_CURRENT_DOCUMENT,
      ])
    },
  };
</script>