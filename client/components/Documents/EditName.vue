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
                   class="input"
                   :class="{ 'input_invalid': currentDocumentName.error }"
                   v-on:input="onDocumentNameChange"
                   :value="currentDocumentName.value"
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
    data() {
      const documentName = this.documentName;
      return {
        currentDocumentName: {
          value: documentName,
          error: false
        }
      };
    },

    computed: {
      ...mapState({
        currentDocumentId: state => state.documents.currentDocument.id
      })
    },

    methods: {
      onDocumentNameChange(e) {
        this.currentDocumentName.value = e.target.value;
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