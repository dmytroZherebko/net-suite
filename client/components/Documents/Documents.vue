<template>
    <div class="documents-page">
        <div class="documents">
            <div class="documents-table">
                <div class="documents__header">
                    <div class="document__name">
                        Document Name
                    </div>
                    <div class="document__date">
                        Last Modified
                    </div>
                </div>
                <div class="documents-list">
                    <div class="document"
                         v-if="documents.length > 0"
                         v-for="document in documents"
                         :class="currentDocumentClass(document.id)"
                         v-on:click="changeCurrentDocument(document)"
                         v-on:dblclick="openEditNameModal(document.name)"
                    >
                        <div class="document__name">
                            {{ document.name }}
                        </div>
                        <div class="document__date">
                            {{ document.updated }}
                        </div>
                    </div>
                    <div class="documents-list__no-documents" v-if="documents.length === 0">
                        No Documents
                    </div>
                </div>
            </div>
            <pagination :current-page="currentPage"
                        :items-per-page="perPage"
                        :total-items="totalItems"
                        @page-changed="pageChanged">
            </pagination>
        </div>
        <div class="documents-aside column-aside">
            <open-document
                    :documentId="currentDocumentId"
            >
            </open-document>
            <download-document
                    :buttonIsDisable="!currentDocumentId"
            ></download-document>
            <router-link
                    tag="button"
                    :disabled="!currentDocumentId"
                    class="button button_menu button_margin-bottom"
                    :to="{ path: '/link-to-fill/create', params: { prevPage: $route.fullPath }}"
            >
                LinkToFill
            </router-link>
            <delete-document
                    :deleteDocument="deleteDocument"
                    :buttonIsDisable="!currentDocumentId"
            >
            </delete-document>
        </div>
        <edit-name
                :documentName="currentDocumentName"
                :closeEditNameModal="closeEditNameModal"
                :showEditModal="showEditModal"
        ></edit-name>
    </div>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex';
  import Pagination from '../common/Pagination.vue';
  import DeleteDocument from './Delete.vue';
  import OpenDocument from './Open.vue';
  import EditName from './EditName.vue';
  import DownloadDocument from './DownloadDocument.vue';

  export default {

    data() {
      return {
        currentDocumentName: null,
        showEditModal: false
      };
    },

    computed: {
      ...mapState({
        currentPage: state => state.documents.currentPage,
        totalItems: state => state.documents.total,
        perPage: state => state.documents.perPage,
        currentDocumentId: state => state.documents.currentDocument.id,
        userInfo: state => state.user.userInfo,
      }),
      ...mapGetters({
        documents: 'getDocuments'
      })
    },

    mounted() {
      if (!this.documents.length) {
        this.getPageDocuments();
      }
      if (!this.userInfo) {
        this.getUserInfo();
      }
    },

    methods: {
      currentDocumentClass(documentId) {
        return documentId === this.currentDocumentId ? 'document_active' : '';
      },

      pageChanged(page) {
        if (page === this.currentPage) return;
        this.getPageDocuments(page);
        this.resetCurrentDocument();
      },

      changeCurrentDocument(doc) {
        if (this.currentDocumentId !== doc.id) {
          this.setCurrentDocument(doc);
        }
      },

      deleteDocument() {
        this.deleteDocumentById(this.currentDocumentId);
        this.resetCurrentDocument();
      },

      openEditNameModal(name) {
        this.currentDocumentName = name;
        this.showEditModal = true;
      },

      closeEditNameModal() {
        this.showEditModal = false;
        this.currentDocumentName = null;
      },

      ...mapActions([
        'getPageDocuments',
        'deleteDocumentById',
        'resetCurrentDocument',
        'setCurrentDocument',
        'getUserInfo',
      ])
    },

    components: {
      Pagination,
      DeleteDocument,
      OpenDocument,
      EditName,
      DownloadDocument,
    }
  };
</script>