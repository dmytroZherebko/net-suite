<template>
    <div>
        <iframe :src="`https://developers.pdffiller.com/api_access?client_id=${id}&state=${state}&redirect_uri=${uri}`" :style="{width: '100%', height: '500px'}"></iframe>
    </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    computed: {
      ...mapState({
        id: state => state.auth.client_id,
        uri: state => state.auth.redirect_uri,
        state: state => state.auth.state,
        authorize: state => state.auth.authorize
      })
    },
  };
</script>