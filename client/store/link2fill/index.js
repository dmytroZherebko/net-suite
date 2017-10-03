// import * as actions from './actions';
import * as getters from './getters';

export default {
  state: {
    defaultParams: {
      access: 'full',
      status: 'public',
      email_required: true,
      allow_downloads: false,
      name_required: true,
      custom_message: '',
      notification_emails: [],
      sender_notifications: false,
      enforce_required_fields: true,
      welcome_screen: false,
      signature_stamp: true,
      reusable: true,
      callback_url: '',
      document_id: null,
      additional_documents: []
    }
  },
  getters,
};
