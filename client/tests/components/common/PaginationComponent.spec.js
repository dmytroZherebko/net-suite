import { mount } from 'vue-test-utils';

import PaginationComponent from '../../../components/common/PaginationComponent.vue';

const componentConfig = {
  propsData: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 10,
  }
};

const newTotalItems = 70;

const wrapper = mount(PaginationComponent, componentConfig);


describe('PaginationComponent', () => {
  it('shouldn`t render pagination when totalItems is equal itemsPerPage', () => {
    expect(wrapper.findAll('.pagination').length).toBe(0);
  });

  it('should render pagination when totalItems is more then itemsPerPage', () => {
    wrapper.setProps({ totalItems: newTotalItems });
    expect(wrapper.findAll('.pagination').length).toBe(1);
  });

  it('should trigger page changed event with new page', () => {
    wrapper.vm.pageChanged(2);
    expect(wrapper.emitted('page-changed')[0]).toEqual([2]);
  });

  it('should return active class is page is active', () => {
    const className = wrapper.vm.activePage(1);
    expect(className).toContain('pagination__link_active');
  });

  it('should`t return active class is page isn`t active', () => {
    const className = wrapper.vm.activePage(2);
    expect(className).not.toContain('pagination__link_active');
  });

  it('should return disable class for prev link if current page is 1', () => {
    const className = wrapper.vm.checkLinkIsActive('prev');
    expect(className).toContain('pagination__link_disable');
  });

  it('shouldn`t return disable class for prev link if current page isn`t 1', () => {
    wrapper.setProps({ currentPage: 2 });
    const className = wrapper.vm.checkLinkIsActive('prev');
    expect(className).not.toContain('pagination__link_disable');
    wrapper.setProps({ currentPage: 1 });
  });

  it('should return disable class for next link if current page is equel last page', () => {
    wrapper.setProps({ currentPage: 7 }); // should be 7, because new set of total items is 70 and items per page is 10
    const className = wrapper.vm.checkLinkIsActive('next');
    expect(className).toContain('pagination__link_disable');
  });

  it('shouldn`t return disable class for next link if current page isn`t last', () => {
    wrapper.setProps({ currentPage: 2 });
    const className = wrapper.vm.checkLinkIsActive('next');
    expect(className).not.toContain('pagination__link_disable');
    wrapper.setProps({ currentPage: 1 });
  });

  it('should count correct last page', () => {
    expect(wrapper.vm.lastPage).toBe(7);
  });

  it('should count correct pagination range when current page is 3', () => {
    wrapper.setProps({ currentPage: 3 });
    expect(wrapper.vm.paginationRange).toEqual([2, 3, 4, 5]);
  });

  it('should count correct pagination range when current page is 5', () => {
    wrapper.setProps({ currentPage: 5 });
    expect(wrapper.vm.paginationRange).toEqual([3, 4, 5, 6]);
  });
});
