<template>
    <div>
        <button class="button button_menu" :disabled="buttonIsDisable" v-on:click="showConfirmationModal">
            delete
        </button>
        <modal
                :showModal="showModal"
                modalTitle="Delete Document"
                modalType="confirm"
                @modal-close="onClose"
                @modal-ok="onDelete"
                @modal-cancel="onCancel"
        >
            <div slot="modal-body" class="modal-body">
                <p class="text-center">
                    Are you sure you want to delete the document?
                </p>
            </div>
        </modal>
    </div>
</template>

<script>
  import Modal from '../common/Modal.vue';

  export default {
    props: {
      deleteDocument: Function,
      buttonIsDisable: {
        type: Boolean,
        default: true
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
      Modal
    }
  };
</script>