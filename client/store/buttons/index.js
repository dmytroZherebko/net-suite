import mutations from './mutations';

export default {
  state: {
    open: { show: true, title: 'Open' },
    s2s: { show: true, title: 'SendToSign' },
    l2f: { show: true, title: 'LinkToFill' },
    download: { show: true, title: 'Download' },
    delete: { show: true, title: 'Delete' },
    upload: { show: true, title: 'Upload' },
  },
  mutations
};
