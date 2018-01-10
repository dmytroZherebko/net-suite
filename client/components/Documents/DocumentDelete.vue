<template>
    <div>
        <button-component
                :disabled="disabled"
                :buttonAction="showConfirmationModal"
                :title="title"
        />
        <modal-component
                :show-modal="showModal"
                modal-title="Delete Document"
                modal-type="confirm"
                @modal-close="onClose"
                @modal-ok="onDelete"
                @modal-cancel="onClose"
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
  import ButtonComponent from '../common/ButtonComponent.vue';

  export default {
    components: {
      ModalComponent,
      ButtonComponent
    },
    props: {
      deleteDocument: {
        type: Function,
        required: true
      },
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
    }
  };
</script>