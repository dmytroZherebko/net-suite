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
                         :key="document.id"
                         v-for="document in documents"
                         :class="currentDocumentClass(document.id)"
                         @click="changeCurrentDocument(document)"
                         @dblclick="openEditNameModal(document.name)"
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
            <pagination-component :current-page="currentPage"
                        :items-per-page="perPage"
                        :total-items="totalItems"
                        @page-changed="pageChanged" />
        </div>
        <div class="documents-aside column-aside">
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
            <zoho-attachment :document-id="currentDocumentId" />
            <zoho-fields />
            <zoho-fill :document-id="currentDocumentId" />
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
  import { mapState, mapGetters, mapActions } from 'vuex';
  import PaginationComponent from '../common/PaginationComponent.vue';
  import DeleteDocument from './DocumentDelete.vue';
  import OpenDocument from './DocumentOpen.vue';
  import EditName from './DocumentEditName.vue';
  import DownloadDocument from './DocumentDownload.vue';
  import ZohoAttachment from './ZohoAttachment.vue';
  import ZohoFields from './ZohoFields.vue';
  import ZohoFill from './ZohoFill.vue';

  export default {
    components: {
      PaginationComponent,
      DeleteDocument,
      OpenDocument,
      EditName,
      DownloadDocument,
      ZohoAttachment,
      ZohoFields,
      ZohoFill
    },

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
        this.getPageDocuments({ currentPage: page });
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
  };
</script>