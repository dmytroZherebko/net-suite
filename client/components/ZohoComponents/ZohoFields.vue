<template>
    <div>
        <button class="button button_menu margin-bottom" @click="getZohoFields">
            Zoho Record Fields
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
                <div class="zoho-fields__title">
                    List of fields current ZOHO record.
                </div>
                <div class="zoho-field zoho-field_title">
                    <div class="zoho-field__name ">
                        Field Name
                    </div>
                    <div class="zoho-field__value">
                        Field Value
                    </div>
                </div>
                <div v-for="(value, key) in zohoFields" class="zoho-field">
                    <div class="zoho-field__name">
                        {{key}}
                    </div>
                    <div class="zoho-field__value">
                        {{value}}
                    </div>
                </div>
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
      async getZohoFields() {
        try {
          this.zohoFields = await this.getZohoFieldsData();
          this.showUploadPopUp = true;
        } catch (err) { console.log(err); } // eslint-disable-line
      },
      closeModal() {
        this.showUploadPopUp = false;
        this.zohoFields = null;
      }
    }
  };
</script>