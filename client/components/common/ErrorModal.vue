<template>
    <div>
        <modal-component
                :show-modal="showError"
                modal-title="Error"
                modal-type="alert"
                @modal-close="onClose"
                @modal-ok="onClose"
        >
            <div slot="modal-body" class="modal-body">
                <p class="text-center pre-line">
                    {{ errorText }}
                </p>
            </div>
        </modal-component>
    </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import ModalComponent from './ModalComponent.vue';
  import constants from '../../constants';

  const { actions } = constants;

  export default {
    computed: {
      ...mapState({
        showError: state => state.error.showError,
        errorText: state => state.error.errorText
      })
    },

    methods: {
      ...mapActions([actions.RESET_ERROR]),
      onClose() {
        this[actions.RESET_ERROR]();
      },
    },

    components: {
      ModalComponent
    }
  };
</script>