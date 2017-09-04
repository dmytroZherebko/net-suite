<template>
    <div>
        <div v-for="document in documents">
            {{ document.name }}
        </div>
    </div>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex';

  export default {

    computed: {
      ...mapGetters({
        documents: 'getDocuments'
      })
    },

    mounted() {
      if (!this.documents) {
        this.loadDocuments();
      }
    },

    methods: {
      ...mapActions(['loadDocuments'])
    }
  };
</script>