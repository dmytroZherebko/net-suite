<template>
    <div class="documents-page">
        <div class="documents">
            <div class="documents-table">
                <div class="documents__header">
                    <div class="document__name">
                        Name
                    </div>
                    <div class="document__date">
                        Updated
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
            <button class="button" :disabled="!currentDocument">
                delete
            </button>
        </div>
    </div>

</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex';
  import Pagination from './Pagination.vue';

  export default {

    data() {
      return {
        currentDocument: null
      }
    },

    computed: {
      ...mapState({
        currentPage: (state) => state.documents.currentPage,
        totalItems: (state) => state.documents.total,
        perPage: (state) => state.documents.perPage,
      }),
      documents() {
        return this.$store.getters.getDocuments(this.currentPage)
      }
    },

    mounted() {
      if (!this.documents) {
        this.initPage();
      }
    },

    methods: {
      currentDocumentClass(documentId){
          return documentId === this.currentDocument ? 'document_active' : '';
      },
      pageChanged(page) {
        if (page === this.currentPage) return;
        this.initPage(page);
        this.currentDocument = null;
      },

      changeCurrentDocument(id) {
        this.currentDocument = id;
      },
      ...mapActions(['initPage'])
    },

    components: {
      Pagination
    }
  };
</script>