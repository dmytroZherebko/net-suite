<template>
    <modal
            :showModal="showEditModal"
            modalTitle="Edit Document Name"
            modalType="confirm"
            @modal-close="closeEditNameModal"
            @modal-ok="onEditNameConfirm"
            @modal-cancel="closeEditNameModal"
    >
        <div slot="modal-body" class="modal-body">
            <input type="text"
                   v-model="currentDocumentName.value"
                   class="input"
                   :class="checkDocumentNameInput()"
                   v-on:input="onDocumentNameChange"
            >
        </div>
    </modal>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import Modal from '../common/Modal.vue';

  export default {
    props: {
      showEditModal: {
        type: Boolean,
        required: true
      },
      documentName: {
        type: String
      },
      closeEditNameModal: {
        type: Function,
        required: true
      }
    },

    computed: {
      currentDocumentName() {
        return {
          value: this.documentName,
          error: null
        };
      },
      ...mapState({
        currentDocumentId: state => state.documents.currentDocument.id
      })
    },

    methods: {
      checkDocumentNameInput() {
        return this.currentDocumentName.error ? 'input_invalid' : '';
      },
      onDocumentNameChange() {
        if (!this.currentDocumentName.value || this.currentDocumentName.value.length < 3) {
          this.currentDocumentName.error = true;
        } else {
          this.currentDocumentName.error = false;
        }
      },

      onEditNameConfirm() {
        if (!this.currentDocumentName.error) {
          this.closeEditNameModal();
          this.updateDocumentName({
            documentId: this.currentDocumentId,
            newName: this.currentDocumentName.value
          });
          this.currentDocumentName.value = null;
        }
      },

      ...mapActions([
        'updateDocumentName',
      ])
    },

    components: {
      Modal
    }
  };
</script>