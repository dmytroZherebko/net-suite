<template>
    <div>
        <modal
                :showModal="showError"
                modalTitle="Error"
                modalType="alert"
                @modal-close="onClose"
                @modal-ok="onClose"
        >
            <div slot="modal-body" class="modal-body">
                <p class="text-center pre-line">
                    {{ errorText }}
                </p>
            </div>
        </modal>
    </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import Modal from '../common/Modal.vue';

  export default {
    computed: {
      ...mapState({
        showError: state => state.error.showError,
        errorText: state => state.error.errorText
      })
    },

    methods: {
      onClose() {
        this.resetError();
      },
      ...mapActions(['resetError'])
    },

    components: {
      Modal
    }
  };
</script>