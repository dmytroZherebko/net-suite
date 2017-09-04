<template>
    <div>
        <home></home>
        <loader></loader>
    </div>
</template>

<script>
  import Loader from './Loader.vue';
  import Home from './Home.vue';

  export default {
    components: {
      Loader,
      Home
    }
  };
</script>