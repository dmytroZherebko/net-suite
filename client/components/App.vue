<template>
    <div>
        <nav-menu-component></nav-menu-component>
        <loader-component></loader-component>
        <error-component></error-component>
        <router-view></router-view>
    </div>
</template>

<script>
  import LoaderComponent from './common/LoaderComponent.vue';
  import ErrorComponent from './common/ErrorModal.vue';
  import NavMenuComponent from './NavMenu/NavMenu.vue';

  export default {
    components: {
      LoaderComponent,
      ErrorComponent,
      NavMenuComponent
    }
  };
</script>