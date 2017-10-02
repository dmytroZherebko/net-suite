<template>
    <div>
        <button class="button button_menu button_margin-bottom" :disabled="buttonIsDisable" v-on:click="downloadDocument">
            download
        </button>
    </div>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    props: {
      deleteDocument: Function,
      buttonIsDisable: {
        type: Boolean,
        default: true
      },
    },

    methods: {
      ...mapActions(['downloadDocument'])
    },
  };
</script>