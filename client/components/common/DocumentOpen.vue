<template>
    <div>
        <button-component
                :disabled="disabled"
                :buttonAction="openDocumentInEditor"
                :title="title"
        />
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
        <modal-component
                v-else
                :show-modal="showUpdateOpenedDocumentPopUp"
                :modalClass="getModalClass()"
                modal-title="Updating document"
                @modal-close="closeUpdatedDocumentPopUp"
                @modal-ok="closeUpdatedDocumentPopUp"
        >
            <div slot="modal-body" class="modal-body text-center">
                {{updateOpenedDocumentMessage}}
            </div>
        </modal-component>
    </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import ModalComponent from '../common/ModalComponent.vue';
  import ButtonComponent from '../common/ButtonComponent.vue';
  import constants from '../../constants';

  const { actions } = constants;

  export default {
    props: {
      disabled: {
        type: Boolean,
        default: null
      },
      title: {
        type: String,
        default: null
      },
    },
    computed: {
      ...mapState({
        showOpenDocumentPopUp: state => state.documents.openDocument.showOpenDocumentPopUp,
        openMode: state => state.documents.openDocument.openDocumentMode,
        documentUrl: state => state.documents.openDocument.documentUrl,
        updateOpenedDocumentMessage: state => state.documents.updateOpenedDocumentMessage,
        showUpdateOpenedDocumentPopUp: state => state.documents.showUpdateOpenedDocumentPopUp,
      })
    },

    methods: {
      ...mapActions([
        actions.OPEN_DOCUMENT_EDITOR,
        actions.CLOSE_DOCUMENT_EDITOR,
        actions.HIDE_UPDATE_OPENED_DOCUMENT_POP_UP,
      ]),
      openDocumentInEditor() {
        this[actions.OPEN_DOCUMENT_EDITOR]();
      },
      closeModal() {
        this[actions.CLOSE_DOCUMENT_EDITOR]();
      },
      getModalClass() {
        return this.documentUrl ? 'modal_editor' : '';
      },
      closeUpdatedDocumentPopUp() {
        this[actions.HIDE_UPDATE_OPENED_DOCUMENT_POP_UP]();
      }
    },
    components: {
      ModalComponent,
      ButtonComponent,
    }
  };
</script>