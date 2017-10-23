<template>
    <div>
        <button class="button button_menu margin-bottom" :disabled="!documentId" @click="openDocumentInEditor">
            open
        </button>
        <modal-component
                :show-modal="!!documentUrl"
                :show-buttons="false"
                :show-header="false"
                modal-class="modal_editor"
                @modal-close="closeModal"
        >
            <div slot="modal-body">
                <iframe :src="documentUrl"
                        :style="{width: '100%', height: '700px'}"
                ></iframe>
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
        documentUrl: state => state.documents.documentLink.editorLink
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