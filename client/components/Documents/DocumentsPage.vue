<template>
    <div class="documents-page">
        <documents-list
                :documents="documents"
                :current-page="currentPage"
                :items-per-page="perPage"
                :total-items="totalItems"
                :page-changed="pageChanged"
                :filepicker="filepicker"
                :current-document-id="currentDocumentId"
                :change-current-document="changeCurrentDocument"
                :db-listener="dbListener"
        />
        <documents-aside />
        <edit-name
                v-model="currentDocumentName"
                :close-edit-name-modal="closeEditNameModal"
                :show-edit-modal="showEditModal || showEditDocumentNameModal"
                :update-name-action="updateDocumentName"
        />
    </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import DocumentsList from '../common/DocumentsList.vue';
  import DocumentsAside from './DocumentsAside.vue';
  import EditName from '../common/DocumentEditName.vue';
  import constants from '../../constants';

  const { actions, routes } = constants;

  export default {
    components: {
      DocumentsList,
      DocumentsAside,
      EditName,
    },

    data() {
      return {
        currentDocumentName: null,
        showEditModal: false // showEditModal using for page documents
      };
    },

    computed: {
      ...mapState({
        documents: state => state.documents.documentsList,
        currentPage: state => state.documents.currentPage,
        totalItems: state => state.documents.total,
        perPage: state => state.documents.perPage,
        currentDocumentId: state => state.documents.currentDocument.id,
        filepicker: state => state.filepicker,
        currentDocumentStoreName: state => state.documents.currentDocument.name,
        showEditDocumentNameModal: state => state.documents.showEditIntegrationDocumentModal, // state.documents.showEditIntegrationDocumentModal for page integration when open document
        buttons: state => state.buttons
      }),
    },

    mounted() {
      this[actions.RESET_DOCUMENTS_STATE]();
      this[actions.GET_PAGE_DOCUMENTS]();
    },

    methods: {
      ...mapActions([
        actions.GET_PAGE_DOCUMENTS,
        actions.RESET_CURRENT_DOCUMENT,
        actions.SET_CURRENT_DOCUMENT,
        actions.BROADCAST_DOCUMENT_INFO_TO_PARENT,
        actions.RESET_DOCUMENTS_STATE,
        actions.UPDATE_DOCUMENT_NAME,
        actions.ACCEPT_INTEGRATION_DOC_NAME_POPUP,
        actions.REJECT_INTEGRATION_DOC_NAME_POPUP,
      ]),

      pageChanged(page) {
        if (page === this.currentPage) return;
        this[actions.GET_PAGE_DOCUMENTS]({ currentPage: page });
        this[actions.RESET_CURRENT_DOCUMENT]();
      },

      changeCurrentDocument(doc) {
        if (this.currentDocumentId !== doc.id) {
          this[actions.SET_CURRENT_DOCUMENT](doc);
          this.currentDocumentName = doc.name;
        }
      },

      dbListener(document) {
        if (this.$route.name !== routes.DOCUMENTS.name) return;
        if (this.filepicker) {
          this[actions.BROADCAST_DOCUMENT_INFO_TO_PARENT](document);
        } else {
          this.showEditModal = true;
        }
      },

      closeEditNameModal() {
        this.showEditModal = false;
        this.currentDocumentName = this.currentDocumentStoreName;
        if (this.$route.name !== routes.DOCUMENTS.name) {
          this[actions.REJECT_INTEGRATION_DOC_NAME_POPUP]();
        }
      },

      updateDocumentName(name) {
        if (this.$route.name !== routes.DOCUMENTS.name) {
          this.currentDocumentName = this.currentDocumentStoreName;
          this[actions.ACCEPT_INTEGRATION_DOC_NAME_POPUP](name);
        } else {
          this[actions.UPDATE_DOCUMENT_NAME](name);
          this.closeEditNameModal();
        }
      }
    },
  };
</script>