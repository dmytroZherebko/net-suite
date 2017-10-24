<template>
    <div>
        <button class="button button_menu margin-bottom" :disabled="!documentId" @click="uploadDocumentToZoho">
            Add to Zoho Attachment
        </button>
        <modal-component
                :show-modal="showUploadPopUp"
                modal-title="Attachment uploaded"
                modal-type="alert"
                @modal-close="closeModal"
                @modal-ok="closeModal"
        >
            <div class="modal-body text-center" slot="modal-body">
                File was successfully uploaded as attachment to the record. Reload page to see the file in attachments list.
            </div>
        </modal-component>
    </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import ModalComponent from '../common/ModalComponent.vue';

  export default {
    components: {
      ModalComponent
    },

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
    }
  };
</script>