<template>
    <modal-component
            :show-modal="showUploadModal"
            modal-title="Successful upload"
            modal-type="alert"
            @modal-close="closeSuccessUploadModal"
            @modal-ok="closeSuccessUploadModal"
    >
        <div class="modal-body text-center" slot="modal-body">
            File was successfully uploaded.
        </div>
    </modal-component>
</template>

<script>
  import ModalComponent from '../common/ModalComponent.vue';

  export default {
    props: {
      showUploadModal: {
        type: Boolean,
        required: true
      },
      value: {
        type: String
      },
      closeSuccessUploadModal: {
        type: Function,
        required: true
      },
    },

    components: {
      ModalComponent
    }
  };
</script>