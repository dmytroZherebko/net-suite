<template>
    <div class="documents" :class="{'documents_full-size': filepicker}">
        <div class="documents-table">
            <div class="documents__header">
                <div class="document__name">
                    Document Name
                </div>
                <div class="document__date">
                    Last Modified
                </div>
            </div>
            <div class="documents-list">
                <div class="document"
                     v-if="documents.length > 0"
                     :key="document.id"
                     v-for="document in documents"
                     :class="getDocumentClass(document)"
                     @click="changeCurrentDocument(document)"
                     @dblclick="dbListener(document)"
                >
                    <div class="document__name">
                        {{ document.name }}
                    </div>
                    <div class="document__date">
                        {{ document.updated }}
                    </div>
                </div>
                <div class="documents-list__no-documents" v-if="documents.length === 0">
                    No Documents
                </div>
            </div>
        </div>
        <pagination-component :current-page="currentPage"
                              :items-per-page="itemsPerPage"
                              :total-items="totalItems"
                              @page-changed="pageChanged" />
    </div>
</template>

<script>
  import PaginationComponent from './PaginationComponent.vue';

  export default {
    components: {
      PaginationComponent,
    },

    props: {
      currentPage: Number,
      itemsPerPage: Number,
      totalItems: Number,
      currentDocumentId: Number,
      pageChanged: Function,
      documents: Array,
      filepicker: Boolean,
      changeCurrentDocument: Function,
      dbListener: {
        type: Function,
        default: () => {}
      },
    },

    methods: {
      getDocumentClass(document) {
        const currentDocumentClass = document.id === this.currentDocumentId ? 'document_active' : '';
        let documentTypeClass;

        switch (document.type) {
          case 'pdf':
            documentTypeClass = 'document_pdf';
            break;
          case 'doc':
          case 'docx':
            documentTypeClass = 'document_doc';
            break;
          case 'ppt':
          case 'pptx':
            documentTypeClass = 'document_ppt';
            break;
          case 'xsl':
          case 'xslt':
            documentTypeClass = 'document_xsl';
            break;
          default:
            break;
        }

        if (document.fillable) {
          documentTypeClass = 'document_template';
        }

        return `${documentTypeClass} ${currentDocumentClass}`;
      }
    },
  };
</script>