<template>
    <div>
        <button
                v-if="!route"
                class="button button_menu margin-bottom"
                :disabled="disabled"
                @click="buttonAction"
        >
            {{title}}
        </button>
        <router-link
                v-else
                tag="button"
                :disabled="disabled"
                class="button button_menu margin-bottom"
                :to="{ path: url, query: { prevPage: $route.fullPath }}"
        >
            {{title}}
        </router-link>
    </div>
</template>

<script>
  export default {
    props: {
      buttonAction: {
        type: Function,
      },
      disabled: {
        type: Boolean,
        default: true
      },
      title: {
        type: String,
      },
      route: {
        type: Boolean,
        default: false
      },
      url: {
        type: String,
      },
    },
  };
</script>