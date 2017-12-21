<template>
    <div>
        <button class="button button_menu margin-bottom" :disabled="disabled" @click="showConfirmationModal">
            {{title}}
        </button>
        <modal-component
                :show-modal="showModal"
                modal-title="Delete Document"
                modal-type="confirm"
                @modal-close="onClose"
                @modal-ok="onDelete"
                @modal-cancel="onCancel"
        >
            <div slot="modal-body" class="modal-body">
                <p class="text-center">
                    Are you sure you want to delete the document?
                </p>
            </div>
        </modal-component>
    </div>
</template>

<script>
  import ModalComponent from '../common/ModalComponent.vue';

  export default {
    props: {
      deleteDocument: Function,
      disabled: {
        type: Boolean,
        default: true
      },
      title: {
        type: String,
      },
    },

    data() {
      return {
        showModal: false
      };
    },

    methods: {
      showConfirmationModal() {
        this.showModal = true;
      },
      onDelete() {
        this.showModal = false;
        this.deleteDocument();
      },
      onClose() {
        this.showModal = false;
      },
      onCancel() {
        this.showModal = false;
      }
    },

    components: {
      ModalComponent
    }
  };
</script>