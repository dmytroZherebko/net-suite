<template>
    <ul class="pagination" v-if="totalItems > itemsPerPage">
        <li class="pagination__item">
            <a href="#" class="pagination__link pagination__link_button" :class="checkLinkIsActive('prev')" @click.prevent="pageChanged(currentPage - 1)">
                &#8592; Previous
            </a>
        </li>
        <li class="pagination__item">
            <a href="#" class="pagination__link" :class="activePage(1)" @click.prevent="pageChanged(1)">
                1
            </a>
        </li>
        <li class="pagination__separator" v-if="start > 2">
            <a href="#" class="pagination__link">
                ...
            </a>
        </li>
        <li class="pagination__item" v-for="n in paginationRange">
            <a href="#" class="pagination__link" :class="activePage(n)" @click.prevent="pageChanged(n)">{{ n }}</a>
        </li>
        <li class="pagination__separator" v-if="lastPage > lastVisible + 1">
            <a href="#" class="pagination__link">
                ...
            </a>
        </li>
        <li class="pagination__item">
            <a href="#" class="pagination__link" :class="activePage(lastPage)" @click.prevent="pageChanged(lastPage)">
                {{ lastPage }}
            </a>
        </li>
        <li class="pagination__item">
            <a href="#" class="pagination__link pagination__link_button" :class="checkLinkIsActive('next')" @click.prevent="pageChanged(currentPage + 1)">
                Next &#8594;
            </a>
        </li>
    </ul>
</template>

<script>
  export default {
    props: {
      currentPage: {
        type: Number,
        default: 1
      },
      itemsPerPage: Number,
      totalItems: Number,
      visiblePages: {
        type: Number,
        default: 5
      }
    },

    data () {
      return {
        start: 1,
        lastVisible: 1
      }
    },

    computed: {
      lastPage () {
        return this.totalItems % this.itemsPerPage === 0
          ? this.totalItems / this.itemsPerPage
          : Math.floor(this.totalItems / this.itemsPerPage) + 1;
      },

      paginationRange () {
        this.start = this.currentPage - this.visiblePages / 2 <= 0
          ? 1 : this.currentPage + this.visiblePages / 2 > this.lastPage
            ? this.lastPage - this.visiblePages + 1 >= 1 ? this.lastPage - this.visiblePages + 1 : 1
            : Math.ceil(this.currentPage - this.visiblePages / 2);

        let range = [];

        for (let i = 0; i < this.visiblePages && i < this.lastPage; i++) {
          const pageNumber = this.start + i;
          if (pageNumber > 1 && pageNumber < this.lastPage) {
            range.push(pageNumber);
          }
        }
        this.lastVisible = range[range.length - 1];
        return range
      }
    },

    methods: {
      checkLinkIsActive(link) {
        switch (link) {
          case 'prev':
            return this.currentPage === 1 ? 'pagination__link_disable': '';
          case 'next':
            return this.currentPage === this.lastPage ? 'pagination__link_disable': '';
          default:
            return '';
        }
      },

      pageChanged (pageNum) {
        this.$emit('page-changed', pageNum)
      },

      activePage (pageNum) {
        return this.currentPage === pageNum ? 'pagination__link_active' : ''
      }
    }
  }
</script>