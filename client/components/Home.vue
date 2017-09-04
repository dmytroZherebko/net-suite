<template>
    <div>
        <div v-if="!authorize_process">
            <authorize></authorize>
        </div>
        <div v-if="authorize">
            <documents-list></documents-list>
        </div>
    </div>
</template>

<script>
  import { mapState } from 'vuex';
  import Authorize from './Authorize.vue';
  import DocumentsList from './DocumentsList.vue';

  export default {

    computed: {
      ...mapState({
        authorize_process: state => state.auth.authorize_process,
        authorize: state => state.auth.authorize
      })
    },
    components: {
      Authorize,
      DocumentsList
    }
  };
</script>