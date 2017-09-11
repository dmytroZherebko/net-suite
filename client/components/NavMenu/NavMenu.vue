<template>
    <div class="nav-wrapper" v-if="$route.name !== 'authorize'">
        <ul class="nav">
           <li class="nav__item">
               <router-link to="documents" class="nav__link" active-class="nav__link_active">MY DOCS</router-link>
           </li>
        </ul>
        <upload></upload>
    </div>
</template>

<script>
  import Upload from '../Upload/Upload.vue';

  export default {
    components: {
      Upload
    }
  };
</script>