<template>
    <div>
        <div v-if="!authorize_process && !authorize">
            <authorize></authorize>
        </div>
        <div v-if="authorize">
            <documents></documents>
        </div>
    </div>
</template>

<script>
  import { mapState } from 'vuex';
  import Authorize from './Authorize.vue';
  import Documents from './Documents.vue';

  export default {

    computed: {
      ...mapState({
        authorize_process: state => state.auth.authorize_process,
        authorize: state => state.auth.authorize
      })
    },
    components: {
      Authorize,
      Documents
    }
  };
</script>