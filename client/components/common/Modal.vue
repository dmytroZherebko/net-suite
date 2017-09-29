<template>
    <div v-if="showModal" class="modal-wrapper" v-on:click.self="onCloseClick">
        <div class="modal" :class="modalClass">
            <div class="modal-header" v-if="showHeader">
                <h1 class="modal-header__title">
                    {{modalTitle || '&nbsp;'}}
                </h1>
                <button class="modal-header__close"
                        v-on:click="onCloseClick">
                </button>
            </div>
            <slot name="modal-body"></slot>
            <div class="modal-buttons" v-if="showButtons">
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
      modalType: {
        type: String,
        default: 'alert'
      },
      modalClass: {
        type: String,
        default: ''
      },
      showButtons: {
        type: Boolean,
        default: true
      },
      showHeader: {
        type: Boolean,
        default: true
      },
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