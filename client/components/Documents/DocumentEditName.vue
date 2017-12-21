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
  import constants from '../../constants';

  const { actions } = constants;

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
      ...mapActions([
        actions.UPDATE_DOCUMENT_NAME,
      ]),
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
          this[actions.UPDATE_DOCUMENT_NAME]({
            name: this.value.trim()
          });
        }
      },
    },

    components: {
      ModalComponent
    }
  };
</script>