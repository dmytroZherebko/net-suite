<template>
    <modal-component
            :show-modal="showSubmitModal"
            modal-title="LinkToFill Url"
            modal-type="confirm"
            primary-button="Copy Link"
            secondary-button="Go Back"
            @modal-close="closeSubmitModal"
            @modal-cancel="closeSubmitModal"
            @modal-ok="copyUrl"
    >
        <div class="modal-body" slot="modal-body">
            <div class="text-center margin-bottom">
                Use this link to access and share your document.
            </div>
            <input type="text" readonly :value="linkToFillUrl" class="input">
        </div>
    </modal-component>
</template>

<script>
  import ModalComponent from '../common/ModalComponent.vue';

  export default {
    props: {
      showSubmitModal: {
        type: Boolean,
        required: true
      },
      closeSubmitModal: {
        type: Function,
        required: true
      },
      copyUrl: {
        type: Function,
        required: true
      },
      linkToFillUrl: String
    },

    components: {
      ModalComponent
    }
  };
</script>