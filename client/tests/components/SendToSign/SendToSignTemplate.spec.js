import Vue from 'vue';
import Vuex from 'vuex';
import { mount } from 'vue-test-utils';

import SendToSignFormTemplate from '../../../components/SendToSign/SendToSignFormTemplate.vue';


import constants from '../../../constants/';
import { isEmailValid } from '../../../helpers/utils';

jest.mock('../../../helpers/utils');

Vue.use(Vuex);

const { actions, getters } = constants;

const storeConfig = {
  state: {},
  modules: {
    documents: {
      state: {
        currentDocument: { id: 1, type: 'pdf', name: 'name' },
      }
    }
  },
  actions: {
    [actions.CREATE_S2S]: jest.fn(() => Promise.resolve()),
    [actions.CREATE_INTEGRATION_DOCUMENT_IN_PDFFILLER]: jest.fn(() => Promise.resolve()),
  },
  getters: {
    [getters.GET_S2S_DEFAULT_PARAMS]: () => ({
      document_id: null,
      method: 'sendtoeach',
      envelope_name: 'Envelope #1',
      security_pin: 'standard',
      pin: '',
      sign_in_order: false,
      sender_notifications: true,
      recipients: []
    }),
    [getters.GET_S2S_DEFAULT_RECIPIENT]: () => ({
      order: null,
      email: '',
      name: '',
      require_photo: false,
      message_subject: 'Digital signature request from ',
      message_text: 'Please sign and return the linked document with PDFfiller. If you have any questions, please contact me.',
      access: 'signature',
      phone_authenticate: '',
      additional_documents: []
    })
  }
};

const store = new Vuex.Store(storeConfig);

const componentConfig = {
  store,
  stubs: {
    'modal-component': true,
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

const wrapper = mount(SendToSignFormTemplate, componentConfig);

describe('SendToSignFormTemplate component', () => {
  afterEach(() => {
    storeConfig.actions[actions.CREATE_S2S].mockClear();
  });

  it('should add defaultRecipient to recipients list | addDefaultRecipient', () => {
    wrapper.vm.addDefaultRecipient();
    expect(wrapper.vm.formData.recipients[1]).toEqual({
      ...wrapper.vm.s2sRecipientDefaultParams,
      additional_documents: [],
      isCollapsed: false,
      order: 2,
      errors: {
        name: false,
        email: false,
        additional_documents: false,
        order: false
      }
    });
  });

  it('should add recipient to recipients list and collapse other recipients blocks | addRecipient', () => {
    jest.spyOn(wrapper.vm, 'addDefaultRecipient').mockImplementation(() => {});
    wrapper.vm.addRecipient();
    expect(wrapper.vm.addDefaultRecipient).toBeCalled();
    expect(wrapper.vm.formData.recipients[0].isCollapsed).toBeTruthy();
    expect(wrapper.vm.formData.recipients[1].isCollapsed).toBeTruthy();
    wrapper.vm.addDefaultRecipient.mockRestore();
  });

  it('should delete recipient | deleteRecipient', () => {
    const index = 1;
    wrapper.vm.deleteRecipient(index);
    expect(wrapper.vm.formData.recipients.length).toBe(1);
  });

  it('should add additional document to recipient | addAdditionalDocument', () => {
    const index = 0;
    const doc = 'doc';
    wrapper.vm.addAdditionalDocument(doc, index);
    expect(wrapper.vm.formData.recipients[index].additional_documents[0]).toBe(doc);
  });

  it('shouldn`t add additional document to recipient when no value | addAdditionalDocument', () => {
    const index = 0;
    wrapper.vm.addAdditionalDocument(null, index);
    expect(wrapper.vm.formData.recipients[index].additional_documents.length).toBe(1);
  });

  it('shouldn`t add additional document to recipient when value less then 3 characters and should set error | addAdditionalDocument', () => {
    const index = 0;
    const doc = 'do';
    wrapper.vm.addAdditionalDocument(doc, index);
    expect(wrapper.vm.formData.recipients[index].additional_documents.length).toBe(1);
    expect(wrapper.vm.formData.recipients[index].errors.additional_documents).toBeTruthy();
  });

  it('should remove additional document in recipient | removeAdditionalDocument', () => {
    const indexRec = 0;
    const indexDoc = 0;
    wrapper.vm.removeAdditionalDocument(indexDoc, indexRec);
    expect(wrapper.vm.formData.recipients[indexRec].additional_documents.length).toBe(0);
  });

  it('should toggle recipient section | toggleRecipientSection', () => {
    const indexRec = 0;
    const currentValue = wrapper.vm.formData.recipients[indexRec].isCollapsed;
    wrapper.vm.toggleRecipientSection(indexRec);
    expect(wrapper.vm.formData.recipients[indexRec].isCollapsed).toBe(!currentValue);
  });

  it('should reset form error | resetFormError', () => {
    const fieldName = 'envelope_name';
    wrapper.vm.resetFormError(fieldName);
    expect(wrapper.vm.formErrors[fieldName]).toBeFalsy();
  });

  it('should reset recipient form error | resetRecipientFormError', () => {
    const fieldName = 'additional_documents';
    const index = 0;
    wrapper.vm.resetRecipientFormError(fieldName, index);
    expect(wrapper.vm.formData.recipients[index].errors[fieldName]).toBeFalsy();
  });

  it('should call create s2s action when data is valid | submitS2SForm', async () => {
    jest.spyOn(wrapper.vm, 'checkFormValid').mockImplementation(() => true);
    await wrapper.vm.submitS2SForm();
    expect(storeConfig.actions[actions.CREATE_S2S]).toBeCalledWith(expect.any(Object), { ...wrapper.vm.formData }, undefined);
    expect(wrapper.vm.showResultModal).toBeTruthy();
    wrapper.vm.checkFormValid.mockRestore();
  });

  it('shouldn`t call create s2s action when data isn`t valid | submitS2SForm', async () => {
    jest.spyOn(wrapper.vm, 'checkFormValid').mockImplementation(() => false);
    await wrapper.vm.submitS2SForm();
    expect(storeConfig.actions[actions.CREATE_S2S]).not.toBeCalled();
    wrapper.vm.checkFormValid.mockRestore();
  });

  it('should call create s2s action when data isn`t valid | closeResultModal', () => {
    wrapper.vm.closeResultModal();
    expect(componentConfig.mocks.$router.push).toBeCalledWith(wrapper.vm.prevPage);
    expect(wrapper.vm.showResultModal).toBeFalsy();
  });

  it('should return true when recipients have correct order | validateRecipientsOrder', () => {
    expect(wrapper.vm.validateRecipientsOrder()).toBeTruthy();
  });

  it('should return false when recipients have order with less then 1 | validateRecipientsOrder', () => {
    wrapper.vm.formData.recipients[0].order = -1;
    expect(wrapper.vm.validateRecipientsOrder()).toBeFalsy();
    wrapper.vm.formData.recipients[0].order = 1;
  });

  it('should return false when recipients have order with not number value | validateRecipientsOrder', () => {
    wrapper.vm.formData.recipients[0].order = 'bla';
    expect(wrapper.vm.validateRecipientsOrder()).toBeFalsy();
    wrapper.vm.formData.recipients[0].order = 1;
  });

  it('should return false and set error to true when recipients have 2 recipient with the save order number | validateRecipientsOrder', () => {
    wrapper.vm.addDefaultRecipient();
    wrapper.vm.formData.recipients[1].order = 1;
    expect(wrapper.vm.validateRecipientsOrder()).toBeFalsy();
    wrapper.vm.deleteRecipient(1);
  });

  it('should return false and set error to true when no recipient name | validateRecipients', () => {
    expect(wrapper.vm.validateRecipients()).toBeFalsy();
    expect(wrapper.vm.formData.recipients[0].errors.name).toBeTruthy();
  });

  it('should return false and set error to true when not valid recipient email | validateRecipients', () => {
    wrapper.vm.formData.recipients[0].name = 'name';
    isEmailValid.mockImplementation(() => false);
    expect(wrapper.vm.validateRecipients()).toBeFalsy();
    expect(wrapper.vm.formData.recipients[0].errors.email).toBeTruthy();
  });

  it('should return true when name and email is valid | validateRecipients', () => {
    isEmailValid.mockImplementation(() => true);
    expect(wrapper.vm.validateRecipients()).toBeTruthy();
  });

  it('should return false when securiti_pin enhanced and no phone_authenticate number | validateRecipients', () => {
    isEmailValid.mockImplementation(() => true);
    wrapper.vm.formData.security_pin = 'enhanced';
    wrapper.vm.formData.recipients[0].phone_authenticate = '';
    expect(wrapper.vm.validateRecipients()).toBeFalsy();
    expect(wrapper.vm.formData.recipients[0].errors.phone_authenticate).toBeTruthy();
    wrapper.vm.formData.security_pin = 'standard';
  });

  it('should return true when securiti_pin enhanced and no phone_authenticate number | validateRecipients', () => {
    isEmailValid.mockImplementation(() => true);
    wrapper.vm.formData.recipients[0].phone_authenticate = '111';
    expect(wrapper.vm.validateRecipients()).toBeTruthy();
  });

  it('should return true for s2e when all data is valid | checkFormValid', () => {
    jest.spyOn(wrapper.vm, 'validateRecipients').mockImplementation(() => true);
    expect(wrapper.vm.checkFormValid()).toBeTruthy();
  });

  it('should return false for s2e when validateRecipients function return false | checkFormValid', () => {
    jest.spyOn(wrapper.vm, 'validateRecipients').mockImplementation(() => false);
    expect(wrapper.vm.checkFormValid()).toBeFalsy();
  });

  it('should return false for s2e and set error when security_pin enhanced and no pin is presented | checkFormValid', () => {
    wrapper.vm.formData.security_pin = 'enhanced';
    wrapper.vm.formData.pin = '';
    expect(wrapper.vm.checkFormValid()).toBeFalsy();
    expect(wrapper.vm.formErrors.pin).toBeTruthy();
  });

  it('should return true for s2e when security_pin enhanced and pin is presented | checkFormValid', () => {
    jest.spyOn(wrapper.vm, 'validateRecipients').mockImplementation(() => true);
    wrapper.vm.formData.security_pin = 'enhanced';
    wrapper.vm.formData.pin = '1';
    expect(wrapper.vm.checkFormValid()).toBeTruthy();
  });

  it('should return true for s2g when all data is valid | checkFormValid', () => {
    wrapper.vm.formData.method = 'sendtogroup';
    expect(wrapper.vm.checkFormValid()).toBeTruthy();
  });

  it('should return false for s2g validateRecipients function return false | checkFormValid', () => {
    jest.spyOn(wrapper.vm, 'validateRecipients').mockImplementation(() => false);
    expect(wrapper.vm.checkFormValid()).toBeFalsy();
  });

  it('should return false for s2g when envelope_name isn`t presented | checkFormValid', () => {
    wrapper.vm.formData.envelope_name = '';
    expect(wrapper.vm.checkFormValid()).toBeFalsy();
    expect(wrapper.vm.formErrors.envelope_name).toBeTruthy();
  });

  it('should return false for s2g when sign_in_order and validateRecipientsOrder return false | checkFormValid', () => {
    wrapper.vm.formData.envelope_name = 'any';
    jest.spyOn(wrapper.vm, 'validateRecipientsOrder').mockImplementation(() => false);
    wrapper.vm.formData.sign_in_order = true;
    expect(wrapper.vm.checkFormValid()).toBeFalsy();
  });
});
