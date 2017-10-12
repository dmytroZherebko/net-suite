<template>
    <modal
            :showModal="showSubmitModal"
            modalTitle="LinkToFill Url"
            modalType="confirm"
            primaryButton="Copy Link"
            secondaryButton="Go Back"
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
    </modal>
</template>

<script>
  import Modal from '../common/Modal.vue';

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
      Modal
    }
  };
</script>