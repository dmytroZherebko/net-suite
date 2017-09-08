<template>
    <div v-if="isLoading">
        <div class="api-wrap-loading">
            <div class="api-loader__window">
                <div class="api-loader">
                    <div class="api-loader__wrapper">
                        <div class="api-loader__layer">
                            <div class="api-loader__circle-clipper api-loader__circle-clipper--left">
                                <div class="api-loader__circle" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="api-loader__label">Loading...</div>
            </div>
        </div>
    </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {

    computed: {
      ...mapState({
        isLoading: state => state.isLoading
      })
    },
  };
</script>