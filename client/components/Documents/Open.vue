<template>
    <div>
        <button class="button button_menu margin-bottom" :disabled="!documentId" v-on:click="openDocumentInEditor">
            open
        </button>
        <modal
                :showModal="!!documentUrl"
                :showButtons="false"
                :showHeader="false"
                modalClass="modal_editor"
                v-on:modal-close="closeModal"
        >
            <div slot="modal-body">
                <iframe :src="documentUrl"
                        :style="{width: '100%', height: '700px'}"
                ></iframe>
            </div>
        </modal>
    </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import Modal from '../common/Modal.vue';

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
      Modal
    }
  };
</script>