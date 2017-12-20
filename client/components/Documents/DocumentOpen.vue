<template>
    <div>
        <button class="button button_menu margin-bottom" :disabled="!documentId" @click="openDocumentInEditor">
            open
        </button>
        <div v-if="openMode === 'full' && documentUrl"
             class="document-iframe_full-wrapper">
            <iframe
                    :src="documentUrl"
                    class="document-iframe"></iframe>
        </div>
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
  import constants from '../../constants';

  const { actions } = constants;

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
      ...mapActions([
        actions.OPEN_DOCUMENT_EDITOR,
        actions.CLOSE_DOCUMENT_EDITOR,
      ]),
      openDocumentInEditor() {
        this[actions.OPEN_DOCUMENT_EDITOR]();
      },
      closeModal() {
        this[actions.CLOSE_DOCUMENT_EDITOR]();
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