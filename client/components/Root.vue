<template>
    <div>
        <nav-menu></nav-menu>
        <loader></loader>
        <router-view></router-view>
    </div>
</template>

<script>
  import Loader from './common/Loader.vue';
  import NavMenu from './NavMenu/NavMenu.vue';

  export default {
    components: {
      Loader,
      NavMenu
    }
  };
</script>