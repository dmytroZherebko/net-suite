<template>
    <modal-component
            :show-modal="showEditModal"
            modal-title="Edit Document Name"
            modal-type="confirm"
            @modal-close="closeEditNameModal"
            @modal-ok="onEditNameConfirm"
            @modal-cancel="closeEditNameModal"
    >
        <div slot="modal-body" class="modal-body">
            <input type="text"
                   class="input"
                   :class="{ 'input_invalid': inputError }"
                   @input="onDocumentNameChange"
                   :value="value"
            >
        </div>
    </modal-component>
</template>

<script>
  import { mapActions } from 'vuex';
  import ModalComponent from '../common/ModalComponent.vue';

  export default {
    props: {
      showEditModal: {
        type: Boolean,
        required: true
      },
      value: {
        type: String
      },
      closeEditNameModal: {
        type: Function,
        required: true
      }
    },
    data() {
      return {
        inputError: false
      };
    },

    methods: {
      onDocumentNameChange(e) {
        const value = e.target.value;
        this.$emit('input', value);
        if (!value.trim() || value.trim().length < 3) {
          this.inputError = true;
        } else {
          this.inputError = false;
        }
      },

      onEditNameConfirm() {
        if (!this.inputError) {
          this.closeEditNameModal();
          this.updateDocumentName({
            newName: this.value.trim()
          });
        }
      },

      ...mapActions([
        'updateDocumentName',
      ])
    },

    components: {
      ModalComponent
    }
  };
</script>