<template>
    <div>
        <button class="button button_menu margin-bottom" :disabled="disabled" @click="downloadDocument">
            {{title}}
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
      disabled: {
        type: Boolean,
        default: true
      },
      title: {
        type: String,
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