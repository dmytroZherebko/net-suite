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
            <open-document
                    v-if="buttons.open.show"
                    :disabled="!currentDocumentId"
                    :title="buttons.open.title"
            />
            <download-document
                    v-if="buttons.download.show"
                    :disabled="!currentDocumentId"
                    :title="buttons.download.title"
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
            <delete-document
                    v-if="buttons.delete.show"
                    :delete-document="deleteDocument"
                    :disabled="!currentDocumentId"
                    :title="buttons.delete.title"
            />
        </div>
        <edit-name
                v-model="currentDocumentName"
                :close-edit-name-modal="closeEditNameModal"
                :show-edit-modal="showEditModal"
                :update-name-action="updateDocumentName"
        />
    </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import DocumentsList from '../common/DocumentsList.vue';
  import DeleteDocument from './DocumentDelete.vue';
  import OpenDocument from '../common/DocumentOpen.vue';
  import EditName from '../common/DocumentEditName.vue';
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
        buttons: state => state.buttons,
        currentDocumentIsFillable: state => state.documents.currentDocument.fillable,
      }),
    },

    mounted() {
      this[actions.RESET_DOCUMENTS_STATE]();
      this[actions.GET_PAGE_DOCUMENTS]();
    },

    methods: {
      ...mapActions([
        actions.GET_PAGE_DOCUMENTS,
        actions.DELETE_DOCUMENT_BY_ID,
        actions.RESET_CURRENT_DOCUMENT,
        actions.SET_CURRENT_DOCUMENT,
        actions.BROADCAST_DOCUMENT_INFO_TO_PARRENT,
        actions.RESET_DOCUMENTS_STATE,
        actions.UPDATE_DOCUMENT_NAME,
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

      updateDocumentName(name) {
        this[actions.UPDATE_DOCUMENT_NAME](name);
        this.closeEditNameModal();
      }
    },
  };
</script>