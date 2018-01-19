import Vue from 'vue';
import Vuex from 'vuex';
import { mount } from 'vue-test-utils';

import LinkToFillFormTemplate from '../../../components/LinkToFill/LinkToFillFormTemplate.vue';


import constants from '../../../constants/';
import { isEmailValid, copyToClipboard } from '../../../helpers/utils';

jest.mock('../../../helpers/utils');

Vue.use(Vuex);

const { actions, getters } = constants;

const l2fUrl = 'url';
const storeConfig = {
  state: { filepicker: false },
  modules: {
    documents: {
      state: {
        currentDocument: { id: 1, type: 'pdf', name: 'name' },
      }
    }
  },
  actions: {
    [actions.CREATE_L2F]: jest.fn(() => Promise.resolve(l2fUrl)),
  },
  getters: {
    [getters.GET_L2F_DEFAULT_PARAMS]: () => ({
      access: 'full',
      status: 'public',
      email_required: false,
      allow_downloads: false,
      name_required: false,
      custom_message: '',
      notification_emails: [],
      sender_notifications: true,
      enforce_required_fields: false,
      welcome_screen: true,
      signature_stamp: true,
      reusable: false,
      redirect_url: 'https://www.pdffiller.com',
      document_id: null,
      additional_documents: []
    })
  }
};

const store = new Vuex.Store(storeConfig);

const componentConfig = {
  store,
  stubs: {
    'result-modal': true,
    'switcher-component': true,
    'switcher-radio': true,
    'tags-component': true,
    'form-section': true,
  },
  mocks: {
    $route: {
      query: { prevPage: '/documents' },
      params: {}
    },
    $router: {
      push: jest.fn()
    }
  }
};

const wrapper = mount(LinkToFillFormTemplate, componentConfig);

describe('LinkToFillFormTemplate component', () => {
  afterEach(() => {
    storeConfig.actions[actions.CREATE_L2F].mockClear();
  });

  it('should update redirect url and set redirectUrlError to false | updateRedirectUrl', () => {
    const event = { target: { value: 'https://url' } };
    wrapper.vm.updateRedirectUrl(event);
    expect(wrapper.vm.formData.redirect_uri).toBe(event.target.value);
    expect(wrapper.vm.redirectUrlError).toBeFalsy();
  });

  it('should update redirect url and set redirectUrlError to true | updateRedirectUrl', () => {
    const event = { target: { value: 'url' } };
    wrapper.vm.updateRedirectUrl(event);
    expect(wrapper.vm.formData.redirect_uri).toBe(event.target.value);
    expect(wrapper.vm.redirectUrlError).toBeTruthy();
  });

  it('should add additional document to list | addAdditionalDocument', () => {
    const document = 'document';
    wrapper.vm.addAdditionalDocument(document);
    expect(wrapper.vm.formData.additional_documents[0]).toBe(document);
  });

  it('shouldn`t add additional document to list when no document | addAdditionalDocument function', () => {
    wrapper.vm.addAdditionalDocument();
    expect(wrapper.vm.formData.additional_documents.length).toBe(1);
  });

  it('shouldn`t add additional document to list when no document less then 3 characters, and set error | addAdditionalDocument function', () => {
    const document = 'do';
    wrapper.vm.addAdditionalDocument(document);
    expect(wrapper.vm.formData.additional_documents.length).toBe(1);
    expect(wrapper.vm.additionalDocumentError).toBeTruthy();
  });

  it('should delete additional document from list | removeAdditionalDocument function', () => {
    const index = 0;
    wrapper.vm.removeAdditionalDocument(index);
    expect(wrapper.vm.formData.additional_documents.length).toBe(0);
  });

  it('should reset notification email error | resetNotificationEmailError function', () => {
    wrapper.setData({ notificationEmailError: true });
    wrapper.vm.resetNotificationEmailError();
    expect(wrapper.vm.notificationEmailError).toBeFalsy();
  });

  it('should reset additional document error | resetAdditionalDocumentError function', () => {
    wrapper.setData({ additionalDocumentError: true });
    wrapper.vm.resetAdditionalDocumentError();
    expect(wrapper.vm.additionalDocumentError).toBeFalsy();
  });

  it('should add notification email to list | addNotificationEmail', () => {
    const email = 'easdfsadfmail@gmail.com';
    isEmailValid.mockImplementation(() => true);
    wrapper.vm.addNotificationEmail(email);
    expect(wrapper.vm.formData.notification_emails[0]).toEqual({ email });
  });

  it('shouldn`t add notification email to list when no email | addNotificationEmail function', () => {
    wrapper.vm.addNotificationEmail();
    expect(wrapper.vm.formData.notification_emails.length).toBe(1);
  });

  it('shouldn`t add notification email to list when no valid email and set error | addNotificationEmail function', () => {
    const email = 'do';
    isEmailValid.mockImplementation(() => false);
    wrapper.vm.addNotificationEmail(email);
    expect(wrapper.vm.formData.notification_emails.length).toBe(1);
    expect(wrapper.vm.notificationEmailError).toBeTruthy();
  });

  it('should delete notification email from list | removeNotificationEmail function', () => {
    const index = 0;
    wrapper.vm.removeNotificationEmail(index);
    expect(wrapper.vm.formData.notification_emails.length).toBe(0);
  });

  it('shouldn`t call action create l2f when redirect_uri has error | createL2F function', async () => {
    wrapper.setData({ redirectUrlError: true });
    await wrapper.vm.createL2F();
    expect(storeConfig.actions[actions.CREATE_L2F]).not.toBeCalled();
    expect(wrapper.vm.showSubmitModal).toBeFalsy();
  });

  it('should call action create l2f when redirect_uri hasn`t error | createL2F function', async () => {
    wrapper.setData({ redirectUrlError: false });
    await wrapper.vm.createL2F();
    expect(storeConfig.actions[actions.CREATE_L2F]).toBeCalledWith(expect.any(Object), { ...wrapper.vm.formData }, undefined);
    expect(wrapper.vm.showSubmitModal).toBeTruthy();
  });

  it('should call copy with l2f url | copyUrl', () => {
    wrapper.vm.copyUrl();
    expect(copyToClipboard).toBeCalledWith(l2fUrl);
  });

  it('should close modal, reset l2f url and redirect to prev page | closeSubmitModal', () => {
    wrapper.vm.closeSubmitModal();
    expect(wrapper.vm.showSubmitModal).toBeFalsy();
    expect(wrapper.vm.linkToFillUrl).toBeNull();
    expect(componentConfig.mocks.$router.push).toBeCalledWith(wrapper.vm.prevPage);
  });
});
