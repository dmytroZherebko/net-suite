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
        <div class="documents-aside column-aside" v-if="!filepicker">
            <open-document :document-id="currentDocumentId" />
            <download-document :button-is-disable="!currentDocumentId" />
            <router-link
                    tag="button"
                    :disabled="!currentDocumentId"
                    class="button button_menu margin-bottom"
                    :to="{ path: '/link-to-fill/create', params: { prevPage: $route.fullPath }}"
            >
                LinkToFill
            </router-link>
            <router-link
                    tag="button"
                    :disabled="!currentDocumentId"
                    class="button button_menu margin-bottom"
                    :to="{ path: '/send-to-sign/create', params: { prevPage: $route.fullPath }}"
            >
                SendToSign
            </router-link>
            <delete-document
                    :delete-document="deleteDocument"
                    :button-is-disable="!currentDocumentId"
            />
        </div>
        <edit-name
                v-model="currentDocumentName"
                :close-edit-name-modal="closeEditNameModal"
                :show-edit-modal="showEditModal"
        />
    </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import DocumentsList from '../common/DocumentsList.vue';
  import DeleteDocument from './DocumentDelete.vue';
  import OpenDocument from './DocumentOpen.vue';
  import EditName from './DocumentEditName.vue';
  import DownloadDocument from './DocumentDownload.vue';
  import constants from '../../constants';

  const { actions } = constants;

  export default {
    components: {
      DocumentsList,
      DeleteDocument,
      OpenDocument,
      EditName,
      DownloadDocument,
    },

    data() {
      return {
        currentDocumentName: null,
        showEditModal: false
      };
    },

    computed: {
      ...mapState({
        documents: state => state.documents.documentsList,
        currentPage: state => state.documents.currentPage,
        totalItems: state => state.documents.total,
        perPage: state => state.documents.perPage,
        currentDocumentId: state => state.documents.currentDocument.id,
        userInfo: state => state.user.userInfo,
        filepicker: state => state.filepicker,
        currentDocumentIsFillable: state => state.documents.currentDocument.fillable,
      }),
    },

    mounted() {
      this[actions.GET_PAGE_DOCUMENTS]();
      if (!this.userInfo) {
        this[actions.GET_USER_INFO]();
      }
    },

    methods: {
      ...mapActions([
        actions.GET_PAGE_DOCUMENTS,
        actions.DELETE_DOCUMENT_BY_ID,
        actions.RESET_CURRENT_DOCUMENT,
        actions.SET_CURRENT_DOCUMENT,
        actions.GET_USER_INFO,
        actions.BROADCAST_DOCUMENT_INFO_TO_PARRENT,
      ]),

      pageChanged(page) {
        if (page === this.currentPage) return;
        this[actions.GET_PAGE_DOCUMENTS]({ currentPage: page });
        this[actions.RESET_CURRENT_DOCUMENT]();
      },

      changeCurrentDocument(doc) {
        if (this.currentDocumentId !== doc.id) {
          this[actions.SET_CURRENT_DOCUMENT](doc);
        }
      },

      deleteDocument() {
        this[actions.DELETE_DOCUMENT_BY_ID]();
        this[actions.RESET_CURRENT_DOCUMENT]();
      },

      dbListener(document) {
        if (this.filepicker) {
          this.broadcastDocumentInfoToParent(document);
        } else {
          this.currentDocumentName = document.name;
          this.showEditModal = true;
        }
      },

      closeEditNameModal() {
        this.showEditModal = false;
        this.currentDocumentName = null;
      },
    },
  };
</script>