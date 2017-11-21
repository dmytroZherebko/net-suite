<template>
    <div>
        <button class="button button_menu margin-bottom" :disabled="!documentId || !fillable" @click="fillTemplate">
            Fill from Zoho
        </button>
        <modal-component
                :show-modal="showUploadPopUp"
                modal-title="Filled template"
                modal-type="alert"
                @modal-close="closeModal"
                @modal-ok="closeModal"
        >
            <div class="modal-body text-center" slot="modal-body">
                Template was filled successfully and uploaded as attachment. Reload page to see the file in attachments list.
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
      fillable: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        showUploadPopUp: false
      };
    },

    methods: {
      ...mapActions(['fillFromZohoRecord']),
      async fillTemplate() {
        try {
          await this.fillFromZohoRecord();
          this.showUploadPopUp = true;
        } catch (err) { console.log(err); } // eslint-disable-line
      },
      closeModal() {
        this.showUploadPopUp = false;
      }
    }
  };
</script>