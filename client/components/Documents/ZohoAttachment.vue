<template>
    <div>
        <button class="button button_menu margin-bottom" :disabled="!documentId" v-on:click="uploadDocumentToZoho">
            Add to Zoho Attachment
        </button>
        <modal
                :showModal="showUploadPopUp"
                modalTitle="Attachment uploaded"
                modalType="alert"
                @modal-close="closeModal"
                @modal-ok="closeModal"
        >
            <div class="modal-body text-center" slot="modal-body">
                File was successfully uploaded as attachment to the record. Reload page to see the file in attachments list.
            </div>
        </modal>
    </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import Modal from '../common/Modal.vue';

  export default {
    props: {
      documentId: {
        type: Number,
        default: null
      },
    },
    data() {
      return {
        showUploadPopUp: false
      };
    },

    methods: {
      ...mapActions(['uploadToZoho']),
      uploadDocumentToZoho() {
        this.uploadToZoho()
          .then(() => {
            this.showUploadPopUp = true;
          }).catch(() => {});
      },
      closeModal() {
        this.showUploadPopUp = false;
      }
    },
    components: {
      Modal
    }
  };
</script>