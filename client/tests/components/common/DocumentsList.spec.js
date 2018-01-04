import { mount } from 'vue-test-utils';

import DocumentsList from '../../../components/common/DocumentsList.vue';

const componentConfig = {
  propsData: {
    currentPage: 1,
    itemsPerPage: 4,
    totalItems: 4,
    currentDocumentId: 1,
    pageChanged: jest.fn(),
    documents: [
      {
        id: 1,
        name: 'name',
        type: 'pdf',
        updated: '01/01/2018',
      }
    ],
    filepicker: false,
    changeCurrentDocument: jest.fn(),
    dbListener: jest.fn(),
  },
  stubs: {
    PaginationComponent: '<div>pagination</div>'
  }
};

const wrapper = mount(DocumentsList, componentConfig);


describe('DocumentsList component', () => {
  it('should return class with current document and pdf icon', () => {
    const className = wrapper.vm.getDocumentClass(componentConfig.propsData.documents[0]);
    expect(className).toContain('document_pdf');
    expect(className).toContain('document_active');
  });

  it('should return class with doc', () => {
    componentConfig.propsData.documents[0].type = 'doc';
    const className = wrapper.vm.getDocumentClass(componentConfig.propsData.documents[0]);
    expect(className).toContain('document_doc');
  });

  it('should return class with ppt', () => {
    componentConfig.propsData.documents[0].type = 'ppt';
    const className = wrapper.vm.getDocumentClass(componentConfig.propsData.documents[0]);
    expect(className).toContain('document_ppt');
  });

  it('should return class with xsl', () => {
    componentConfig.propsData.documents[0].type = 'xsl';
    const className = wrapper.vm.getDocumentClass(componentConfig.propsData.documents[0]);
    expect(className).toContain('document_xsl');
  });

  it('should return class with for fillable', () => {
    componentConfig.propsData.documents[0].fillable = true;
    const className = wrapper.vm.getDocumentClass(componentConfig.propsData.documents[0]);
    expect(className).toContain('document_template');
  });

  it('shouldn`t return class with active', () => {
    wrapper.setProps({ currentDocumentId: 2 });
    const className = wrapper.vm.getDocumentClass(componentConfig.propsData.documents[0]);
    expect(className).not.toContain('document_active');
  });

  it('should render documents as in props', () => {
    const documents = wrapper.findAll('.document');
    expect(documents.length).toBe(componentConfig.propsData.documents.length);
  });

  it('should call change current document on click', () => {
    const document = wrapper.find('.document');
    document.trigger('click');
    expect(componentConfig.propsData.changeCurrentDocument).toBeCalledWith(componentConfig.propsData.documents[0]);
  });

  it('should call db click listener', () => {
    const document = wrapper.find('.document');
    document.trigger('dblclick');
    expect(componentConfig.propsData.dbListener).toBeCalledWith(componentConfig.propsData.documents[0]);
  });

  it('should render no documents', () => {
    wrapper.setProps({ documents: [] });
    wrapper.update();
    expect(wrapper.find('.documents-list__no-documents').exists()).toBeTruthy();
  });
});
