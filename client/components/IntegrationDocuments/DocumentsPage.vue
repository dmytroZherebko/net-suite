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
        <div class="documents-aside column-aside">
            <open-document
                    v-if="buttons.editIntegration.show"
                    :disabled="documentIsHidden || !currentDocumentId"
                    :title="buttons.editIntegration.title"
            />
            <router-link
                    v-if="buttons.l2f.show"
                    tag="button"
                    :disabled="!currentDocumentId"
                    class="button button_menu margin-bottom"
                    :to="{ path: '/link-to-fill/create', query: { prevPage: $route.fullPath }}"
            >
                {{ buttons.l2f.title }}
            </router-link>
            <router-link
                    v-if="buttons.s2s.show"
                    tag="button"
                    :disabled="!currentDocumentId"
                    class="button button_menu margin-bottom"
                    :to="{ path: '/send-to-sign/create', query: { prevPage: $route.fullPath }}"
            >
                {{ buttons.s2s.title }}
            </router-link>
            <button
                    v-if="buttons.uploadToPDFfiller.show"
                    :disabled="documentIsHidden || !currentDocumentId"
                    class="button button_menu margin-bottom"
                    @click="upload"
            >
                {{buttons.uploadToPDFfiller.title}}
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
        <edit-name
                v-model="currentDocumentName"
                :close-edit-name-modal="closeEditNameModal"
                :show-edit-modal="showEditIntegrationDocumentModal"
                :update-name-action="updateDocumentName"
        />
    </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import DocumentsList from '../common/DocumentsList.vue';
  import ModalComponent from '../common/ModalComponent.vue';
  import OpenDocument from '../common/DocumentOpen.vue';
  import EditName from '../common/DocumentEditName.vue';
  import constants from '../../constants';

  const { actions } = constants;

  export default {
    components: {
      DocumentsList,
      ModalComponent,
      OpenDocument,
      EditName,
    },

    data() {
      return {
        showSuccessModal: false,
        currentDocumentName: null,
      };
    },

    computed: {
      ...mapState({
        currentPage: state => state.documents.currentPage,
        documents: state => state.documents.documentsList,
        totalItems: state => state.documents.total,
        perPage: state => state.documents.perPage,
        currentDocumentId: state => state.documents.currentDocument.id,
        currentDocumentStoreName: state => state.documents.currentDocument.name,
        documentIsHidden: state => state.documents.currentDocument.hidden,
        showEditIntegrationDocumentModal: state => state.documents.showEditIntegrationDocumentModal,
        buttons: state => state.buttons,
      }),
    },

    mounted() {
      this[actions.GET_PAGE_DOCUMENTS]();
    },

    beforeDestroy() {
      this[actions.RESET_DOCUMENTS_STATE]();
      this.currentDocumentName = null;
    },

    methods: {
      ...mapActions([
        actions.GET_PAGE_DOCUMENTS,
        actions.UPLOAD_INTEGRATION_DOCUMENT_TO_PDFFILLER,
        actions.SET_CURRENT_DOCUMENT,
        actions.RESET_CURRENT_DOCUMENT,
        actions.RESET_DOCUMENTS_STATE,
        actions.ACCEPT_INTEGRATION_DOC_NAME_POPUP,
        actions.REJECT_INTEGRATION_DOC_NAME_POPUP,
      ]),

      pageChanged(page) {
        if (page === this.currentPage) return;
        this[actions.GET_PAGE_DOCUMENTS]({ currentPage: page });
        this[actions.RESET_CURRENT_DOCUMENT]();
        this.currentDocumentName = null;
      },

      changeCurrentDocument(doc) {
        if (this.currentDocumentId !== doc.id) {
          this[actions.SET_CURRENT_DOCUMENT](doc);
          this.currentDocumentName = doc.name;
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

      closeEditNameModal() {
        this.currentDocumentName = this.currentDocumentStoreName;
        this[actions.REJECT_INTEGRATION_DOC_NAME_POPUP]();
      },
      updateDocumentName(name) {
        this[actions.ACCEPT_INTEGRATION_DOC_NAME_POPUP](name);
      }
    },
  };
</script>