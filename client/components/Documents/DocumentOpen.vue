<template>
    <div>
        <button class="button button_menu margin-bottom" :disabled="!documentId" @click="openDocumentInEditor">
            open
        </button>
        <iframe
                v-if="openMode === 'full' && documentUrl"
                :src="documentUrl"
                class="document-iframe document-iframe_full"></iframe>
        <modal-component
                v-else
                :show-modal="showOpenDocumentPopUp"
                :show-buttons="false"
                :show-header="!documentUrl"
                :modalClass="getModalClass()"
                modal-title="Editor is open"
                :close-by-outside-click="false"
                @modal-close="closeModal"
        >
            <div slot="modal-body" class="modal-body-editor" v-if="documentUrl">
                <iframe :src="documentUrl"
                        class="document-iframe document-iframe_modal"
                ></iframe>
            </div>
            <div slot="modal-body" class="modal-body text-center" v-else>
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
        showOpenDocumentPopUp: state => state.documents.openDocument.showOpenDocumentPopUp,
        openMode: state => state.documents.openDocument.openDocumentMode,
        documentUrl: state => state.documents.openDocument.documentUrl,
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
      getModalClass() {
        return this.documentUrl ? 'modal_editor' : '';
      }
    },
    components: {
      ModalComponent
    }
  };
</script>