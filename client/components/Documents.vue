<template>
    <div>
        <div class="document__row"
             v-for="document in documents"
             :class="{'document__row_active': document.id == currentDocument}"
             v-on:click="changeCurrentDocument(document.id)"
        >
            <div class="document__name">
                {{ document.name }}
            </div>
            <div class="document__date">
                {{ document.updated }}
            </div>
        </div>
        <pagination :current-page="currentPage"
                    :items-per-page="15"
                    :total-items="total"
                    @page-changed="pageChanged">
        </pagination>
    </div>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex';
  import Pagination from './Pagination.vue';

  export default {

    data() {
      return {
        currentDocument: ''
      }
    },

    computed: {
      ...mapState({
        currentPage: (state) => state.documents.currentPage,
        total: (state) => state.documents.total,
      }),
      documents() {
        return this.$store.getters.getDocuments(this.currentPage)
      }
    },

    mounted() {
      if (!this.documents) {
        this.loadDocuments();
      }
    },

    methods: {
      pageChanged(page) {
        if (page === this.currentPage) return;
        this.loadDocuments(page);
      },

      changeCurrentDocument(id) {
        this.currentDocument = id;
      },
      ...mapActions(['loadDocuments'])
    },

    components: {
      Pagination
    }
  };
</script>