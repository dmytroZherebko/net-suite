import mutations from './mutations';
import getters from './getters';

export default {
  state: {
    open: { show: true, title: 'Open' },
    s2s: { show: true, title: 'SendToSign' },
    l2f: { show: true, title: 'LinkToFill' },
    download: { show: true, title: 'Download' },
    delete: { show: true, title: 'Delete' },
    upload: { show: true, title: 'Upload' },
    s2sIntegration: { show: true, title: 'SendToSign' },
    l2fIntegration: { show: true, title: 'LinkToFill' },
    editIntegration: { show: true, title: 'Edit' },
    uploadToPDFfiller: { show: true, title: 'Upload to PDFfiller' },
    uploadToIntegration: { show: false, title: 'Upload to Integration' },
  },
  mutations,
  getters,
};
