<template>
    <div>
        <button class="button button_menu margin-bottom" @click="getZohoFields">
            Show Zoho Record Fields
        </button>
        <modal-component
                :show-modal="showUploadPopUp"
                modal-title="Zoho Fields List"
                :show-buttons="false"
                modal-class="modal_uploader"
                @modal-close="closeModal"
                @modal-ok="closeModal"
        >
            <div class="modal-body" slot="modal-body">
                <pre>
                    {{zohoFields}}
                </pre>
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

    data() {
      return {
        showUploadPopUp: false,
        zohoFields: {}
      };
    },

    methods: {
      ...mapActions(['getZohoFieldsData']),
      getZohoFields() {
        this.getZohoFieldsData()
          .then((zohoFields) => {
            this.zohoFields = zohoFields;
            this.showUploadPopUp = true;
          }).catch(() => {});
      },
      closeModal() {
        this.showUploadPopUp = false;
      }
    }
  };
</script>