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
                         v-for="document in documents"
                         :class="currentDocumentClass(document.id)"
                         v-on:click="changeCurrentDocument(document.id)"
                    >
                        <div class="document__name">
                            {{ document.name }}
                        </div>
                        <div class="document__date">
                            {{ document.updated }}
                        </div>
                    </div>
                </div>
            </div>
            <pagination :current-page="currentPage"
                        :items-per-page="perPage"
                        :total-items="totalItems"
                        @page-changed="pageChanged">
            </pagination>
        </div>
        <div class="documents-aside">
            <delete-document
                    :deleteDocument="deleteDocument"
                    :buttonIsDisable="!currentDocumentId"
            >
            </delete-document>
        </div>
    </div>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex';
  import Pagination from '../common/Pagination.vue';
  import DeleteDocument from './Delete.vue'

  export default {

    data() {
      return {
        currentDocumentId: null
      }
    },

    computed: {
      ...mapState({
        currentPage: (state) => state.documents.currentPage,
        totalItems: (state) => state.documents.total,
        perPage: (state) => state.documents.perPage,
      }),
      ...mapGetters({
        documents: 'getDocuments'
      })
    },

    mounted() {
      if (!this.documents) {
        this.getPageDocuments();
      }
    },

    methods: {
      currentDocumentClass(documentId){
          return documentId === this.currentDocumentId ? 'document_active' : '';
      },

      pageChanged(page) {
        if (page === this.currentPage) return;
        this.getPageDocuments(page);
        this.currentDocumentId = null;
      },

      changeCurrentDocument(id) {
        this.currentDocumentId = id;
      },

      deleteDocument() {
        console.log(this);
        this.deleteDocumentById(this.currentDocumentId);
      },

      ...mapActions(['getPageDocuments', 'deleteDocumentById'])
    },

    components: {
      Pagination,
      DeleteDocument
    }
  };
</script>