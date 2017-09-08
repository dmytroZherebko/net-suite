<template>
    <div v-if="showModal" class="modal-wrapper" v-on:click.self="onCloseClick">
        <div class="modal">
            <div class="modal-header">
                <h1 class="modal-header__title">
                    {{modalTitle || '&nbsp;'}}
                </h1>
                <button class="modal-header__close"
                        v-on:click="onCloseClick">
                </button>
            </div>
            <div class="modal-body">
                <slot name="modal-body"></slot>
            </div>
            <div class="modal-buttons">
                <button class="button button_secondary" v-if="modalType === 'confirm'" v-on:click="onSecondaryClick">
                    {{ secondaryButton }}
                </button>
                <button class="button button_primary" v-on:click="onPrimaryClick">
                    {{ primaryButton }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    props: {
      showModal: Boolean,
      modalType: String,
      primaryButton: {
        type: String,
        default: 'OK'
      },
      secondaryButton: {
        type: String,
        default: 'Cancel'
      },
      modalTitle: {
        type: String,
        default: ''
      }
    },

    methods: {
      onPrimaryClick() {
        this.$emit('modal-ok');
      },
      onSecondaryClick() {
        this.$emit('modal-cancel');
      },
      onCloseClick() {
        this.$emit('modal-close');
      }
    }
  };
</script>