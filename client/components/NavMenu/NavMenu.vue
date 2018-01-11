<template>
    <div class="nav-wrapper" v-if="!$route.meta.hideNavBar">
        <ul class="nav">
            <li class="nav__item" v-if="showIntegDocs">
                <router-link to="integration-documents" class="nav__link" active-class="nav__link_active">{{integDocsTitle}}</router-link>
            </li>
            <li class="nav__item" v-if="showMyDocs">
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
        showIntegDocs: state => state.documents.showIntegrationDocumentsPage,
        showMyDocs: state => state.documents.showMyDocumentsPage,
        integDocsTitle: state => state.documents.integrationDocumentsPageName,
      })
    },

    components: {
      UploadDocument
    }
  };
</script>