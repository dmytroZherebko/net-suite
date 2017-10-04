import * as actions from './actions';
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
      sender_notifications: true,
      enforce_required_fields: false,
      welcome_screen: true,
      signature_stamp: true,
      reusable: false,
      callback_url: '',
      redirect_url: 'https://www.pdffiller.com',
      document_id: null,
      additional_documents: []
    }
  },
  getters,
  actions,
};
