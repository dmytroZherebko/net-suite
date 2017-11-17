<template>
    <div>
        <button class="button button_menu margin-bottom" :disabled="!documentId" @click="openDocumentInEditor">
            open
        </button>
        <modal-component
                :show-modal="showOpenDocumentPopUp"
                :show-buttons="false"
                modal-title="Editor is open"
                :close-by-outside-click="false"
                @modal-close="closeModal"
        >
            <div slot="modal-body" class="modal-body text-center">
                Your document is open in editor. If you close pop-up editor window will closed.
            </div>
        </modal-component>
    </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import ModalComponent from '../common/ModalComponent.vue';

  export default {
    props: {
      documentId: {
        type: Number,
        default: null
      },
    },
    computed: {
      ...mapState({
        showOpenDocumentPopUp: state => state.documents.showOpenDocumentPopUp
      })
    },

    methods: {
      ...mapActions(['openDocumentEditor', 'closeDocumentEditor']),
      openDocumentInEditor() {
        this.openDocumentEditor();
      },
      closeModal() {
        this.closeDocumentEditor();
      },
    },
    components: {
      ModalComponent
    }
  };
</script>