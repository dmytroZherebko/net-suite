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
                         v-on:click="changeCurrentDocument(document.id)"
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
            <delete-document
                    :deleteDocument="deleteDocument"
                    :buttonIsDisable="!currentDocumentId"
            >
            </delete-document>
        </div>
        <modal
                :showModal="showEditModal"
                modalTitle="Edit Document Name"
                modalType="confirm"
                @modal-close="closeEditNameModal"
                @modal-ok="onEditNameConfirm"
                @modal-cancel="closeEditNameModal"
        >
            <div slot="modal-body" class="modal-body">
                <input type="text"
                       v-model="currentDocumentName.value"
                       class="input"
                       :class="checkDocumentNameInput()"
                       v-on:input="onDocumentNameChange"
                >
            </div>
        </modal>
    </div>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex';
  import Pagination from '../common/Pagination.vue';
  import DeleteDocument from './Delete.vue';
  import OpenDocument from './Open.vue';
  import Modal from '../common/Modal.vue';

  export default {

    data() {
      return {
        currentDocumentName: {
          value: null,
          error: false
        },
        showEditModal: false
      };
    },

    computed: {
      ...mapState({
        currentPage: state => state.documents.currentPage,
        totalItems: state => state.documents.total,
        perPage: state => state.documents.perPage,
        currentDocumentId: state => state.documents.currentDocumentId,
      }),
      ...mapGetters({
        documents: 'getDocuments'
      })
    },

    mounted() {
      if (!this.documents.length) {
        this.getPageDocuments();
      }
    },

    methods: {
      currentDocumentClass(documentId) {
        return documentId === this.currentDocumentId ? 'document_active' : '';
      },
      checkDocumentNameInput() {
        return this.currentDocumentName.error ? 'input_invalid' : '';
      },
      onDocumentNameChange() {
        if (!this.currentDocumentName.value || this.currentDocumentName.value.length < 3) {
          this.currentDocumentName.error = true;
        } else {
          this.currentDocumentName.error = false;
        }
      },

      pageChanged(page) {
        if (page === this.currentPage) return;
        this.getPageDocuments(page);
        this.resetCurrentDocument();
      },

      changeCurrentDocument(id) {
        if (this.currentDocumentId !== id) {
          this.setCurrentDocument(id);
        }
      },

      deleteDocument() {
        this.deleteDocumentById(this.currentDocumentId);
        this.resetCurrentDocument();
      },
      openEditNameModal(name) {
        this.currentDocumentName.value = name;
        this.showEditModal = true;
      },
      closeEditNameModal() {
        this.showEditModal = false;
      },
      onEditNameConfirm() {
        if (!this.currentDocumentName.error) {
          this.closeEditNameModal();
          this.updateDocumentName({
            documentId: this.currentDocumentId,
            newName: this.currentDocumentName.value
          });
          this.currentDocumentName.value = null;
        }
      },

      ...mapActions([
        'getPageDocuments',
        'deleteDocumentById',
        'updateDocumentName',
        'resetCurrentDocument',
        'setCurrentDocument',
      ])
    },

    components: {
      Pagination,
      DeleteDocument,
      OpenDocument,
      Modal
    }
  };
</script>