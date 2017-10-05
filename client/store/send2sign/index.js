// import * as actions from './actions';
import * as getters from './getters';

export default {
  state: {
    defaultParams: {
      document_id: null,
      method: 'sendtoeach',
      envelope_name: '',
      security_pin: 'standard',
      pin: null,
      sign_in_order: false,
      sender_notifications: true,
      recipients: []
    },
    defaultRecipient: {
      role: 777,
      email: null,
      name: null,
      require_photo: false,
      message_subject: 'Digital signature request from ',
      message_text: 'Please sign and return the linked document with PDFfiller. If you have any questions, please contact me.',
      access: 'signature',
      phone_authenticate: null,
      additional_documents: []
    }
  },
  getters,
  // actions,
};
