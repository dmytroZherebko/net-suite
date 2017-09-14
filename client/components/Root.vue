<template>
    <div>
        <nav-menu></nav-menu>
        <loader></loader>
        <error></error>
        <router-view></router-view>
    </div>
</template>

<script>
  import Loader from './common/Loader.vue';
  import Error from './common/ErrorModal.vue';
  import NavMenu from './NavMenu/NavMenu.vue';

  export default {
    components: {
      Loader,
      NavMenu,
      Error
    }
  };
</script>