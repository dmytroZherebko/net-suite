<template>
    <div class="nav-wrapper" v-if="!$route.meta.hideNavBar">
        <ul class="nav">
           <li class="nav__item">
               <router-link to="documents" class="nav__link" active-class="nav__link_active">MY DOCS</router-link>
           </li>
        </ul>
        <upload-document v-if="!filepicker"/>
    </div>
</template>

<script>
  import { mapState } from 'vuex';
  import UploadDocument from '../Upload/UploadDocument.vue';

  export default {
    computed: {
      ...mapState({
        filepicker: state => state.filepicker,
      })
    },

    components: {
      UploadDocument
    }
  };
</script>