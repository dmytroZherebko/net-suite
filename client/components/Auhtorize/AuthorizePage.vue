<template>
    <div v-if="!authorizeProcess">
        <iframe :src="`https://developers.pdffiller.com/api_access?client_id=${id}&state=${state}&redirect_uri=${uri}`" :style="{width: '100%', height: '700px'}"></iframe>
    </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'AuthorizePage',
    data() {
      return {
        redirectPatch: this.$route.query.redirect || '/'
      };
    },
    computed: {
      ...mapState({
        id: state => state.auth.client_id,
        uri: state => state.auth.redirect_uri,
        state: state => state.auth.state,
        authorizeProcess: state => state.auth.authorize_process,
        authorize: state => state.auth.authorize
      })
    },

    created() {
      if (this.authorize) {
        this.redirect();
      }
    },

    watch: {
      authorize() {
        this.redirect();
      }
    },

    methods: {
      redirect() {
        this.$router.push(this.redirectPatch);
      }
    }
  };
</script>