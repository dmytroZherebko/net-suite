<template>
    <div>
        <button class="button button_menu margin-bottom" :disabled="buttonIsDisable" @click="downloadDocument">
            download
        </button>
    </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import constants from '../../constants';

  const { actions } = constants;

  export default {
    props: {
      deleteDocument: Function,
      buttonIsDisable: {
        type: Boolean,
        default: true
      },
    },

    methods: {
      ...mapActions([actions.DOWNLOAD_DOCUMENT]),
      downloadDocument() {
        this[actions.DOWNLOAD_DOCUMENT]();
      }
    },
  };
</script>