<template>
    <div>
        <nav-menu></nav-menu>
        <loader></loader>
        <router-view></router-view>
    </div>
</template>

<script>
  import Loader from './Loader.vue';
  import NavMenu from './NavMenu.vue';

  export default {
    components: {
      Loader,
      NavMenu
    }
  };
</script>