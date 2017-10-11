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
                   :class="{ 'input_invalid': inputError }"
                   v-on:input="onDocumentNameChange"
                   :value="value"
            >
        </div>
    </modal>
</template>

<script>
  import { mapActions } from 'vuex';
  import Modal from '../common/Modal.vue';

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
      Modal
    }
  };
</script>