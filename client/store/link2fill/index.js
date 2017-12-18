import mutations from './mutations';
import * as actions from './actions';
import * as getters from './getters';

export default {
  state: {
    defaultParams: {
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
    }
  },
  getters,
  actions,
  mutations,
};
