import { removeUselessS2SKeys, copyToClipboard,
  getFormatedDocuments, isEmailValid,
  getDocumentNameWithoutExtension, getDataFromTimeStamp,
  parseQueryString } from '../../helpers/utils';

const s2sDataMock = {
  document_id: null,
  method: 'sendtogroup',
  envelope_name: 'Envelope #1',
  security_pin: 'standard',
  pin: '1',
  sign_in_order: false,
  sender_notifications: true,
  recipients: [
    {
      order: null,
      errors: {},
      isCollapsed: false,
      email: '',
      name: '',
      require_photo: false,
      message_subject: 'Digital signature request from ',
      message_text: 'Please sign and return the linked document with PDFfiller. If you have any questions, please contact me.',
      access: 'signature',
      phone_authenticate: '',
      additional_documents: ['docs']
    }
  ]
};

describe('helpers utils functions', () => {
  describe('parseQueryString function', () => {
    it('should parse query string', () => {
      const params = parseQueryString('name=name&bla=bla');
      expect(params.name).toBe('name');
      expect(params.bla).toBe('bla');
    });
  });

  describe('getDataFromTimeStamp function', () => {
    it('should get formated data string from time stamp with nulls', () => {
      const dataString = getDataFromTimeStamp(1515055787487);
      expect(dataString).toBe('01/04/2018');
    });
    it('should get formated data string from time stamp', () => {
      const dataString = getDataFromTimeStamp(1507709565000);
      expect(dataString).toBe('10/11/2017');
    });
  });

  describe('getDocumentNameWithoutExtension function', () => {
    it('should get document name without extension when extension in filename', () => {
      const params = {
        name: 'bla.pdf',
        type: 'pdf'
      };
      const name = getDocumentNameWithoutExtension(params);
      expect(name).toBe('bla');
    });

    it('should get document name without extension when not extension in filename', () => {
      const params = {
        name: 'bla.doc',
        type: 'docx'
      };
      const name = getDocumentNameWithoutExtension(params);
      expect(name).toBe('bla.doc');
    });

    it('should get correct document name without extension when has extension in name not in end', () => {
      const params = {
        name: 'bla.docx.docx.docx',
        type: 'docx'
      };
      const name = getDocumentNameWithoutExtension(params);
      expect(name).toBe('bla.docx.docx');
    });
  });

  describe('isEmailValid function', () => {
    it('should return true for valid email', () => {
      const email = 'blabla@gmail.com';
      const isValid = isEmailValid(email);
      expect(isValid).toBeTruthy();
    });

    it('should return true for valid email with +', () => {
      const email = 'blabla+1@gmail.com';
      const isValid = isEmailValid(email);
      expect(isValid).toBeTruthy();
    });

    it('should return true for valid email with .', () => {
      const email = 'bla.bla+1@gmail.com';
      const isValid = isEmailValid(email);
      expect(isValid).toBeTruthy();
    });

    it('should return false for email without @', () => {
      const email = 'bla.bla+1gmail.com';
      const isValid = isEmailValid(email);
      expect(isValid).toBeFalsy();
    });

    it('should return false for email without domain', () => {
      const email = 'bla.bla+@1gmailcom';
      const isValid = isEmailValid(email);
      expect(isValid).toBeFalsy();
    });
  });

  describe('getFormatedDocuments function', () => {
    it('should return formated documents', () => {
      const documents = {
        items: [
          {
            name: 'name.pdf',
            type: 'pdf',
            updated: '1515055787',
            created: '1507709565'
          }
        ]
      };
      const docs = getFormatedDocuments(documents);
      expect(docs[0].name).toBe('name');
      expect(docs[0].updated).toBe('01/04/2018');
      expect(docs[0].created).toBe('10/11/2017');
    });
  });

  describe('copyToClipboard function', () => {
    const createElementMock = {
      style: {},
      value: null,
      select: jest.fn()
    };
    beforeAll(() => {
      jest.spyOn(document, 'createElement').mockImplementation(() => createElementMock);
      jest.spyOn(document.body, 'appendChild').mockImplementation(() => {});
      jest.spyOn(document.body, 'removeChild').mockImplementation(() => {});
      document.execCommand = jest.fn();
    });

    it('should copy to clipboard', () => {
      const text = 'text';
      copyToClipboard(text);
      expect(document.createElement).toBeCalledWith('textarea');
      expect(document.body.appendChild).toBeCalledWith(createElementMock);
      expect(createElementMock.value).toBe(text);
      expect(createElementMock.select).toBeCalled();
      expect(document.execCommand).toBeCalledWith('copy');
      expect(document.body.removeChild).toBeCalledWith(createElementMock);
    });
  });

  describe('removeUselessS2SKeys function', () => {
    it('should remove pin and security_pin from config when sendtogroup', () => {
      const s2sData = removeUselessS2SKeys(s2sDataMock);
      expect(s2sData.pin).toBeUndefined();
      expect(s2sData.security_pin).toBeUndefined();
    });

    it('should remove phone_authenticate from recipient when sendtogroup', () => {
      const s2sData = removeUselessS2SKeys(s2sDataMock);
      expect(s2sData.phone_authenticate).toBeUndefined();
    });

    it('should remove envelope_name and sign_in_order when sendtoeach', () => {
      s2sDataMock.method = 'sendtoeach'; // all next test will run with sendtoeach method
      const s2sData = removeUselessS2SKeys(s2sDataMock);
      expect(s2sData.envelope_name).toBeUndefined();
      expect(s2sData.sign_in_order).toBeUndefined();
    });

    it('should remove pin when sendtoeach and security pin set to standard', () => {
      const s2sData = removeUselessS2SKeys(s2sDataMock);
      expect(s2sData.pin).toBeUndefined();
    });

    it('should remove phone_authenticate from recipient when sendtoeach and security pin set to standard', () => {
      const s2sData = removeUselessS2SKeys(s2sDataMock);
      expect(s2sData.phone_authenticate).toBeUndefined();
    });

    it('shouldn`t remove pin when sendtoeach and security pin set to enhanced', () => {
      s2sDataMock.security_pin = 'enhanced'; // all next test will run with security_pin enhanced
      const s2sData = removeUselessS2SKeys(s2sDataMock);
      expect(s2sData.pin).toBe(s2sDataMock.pin);
    });

    it('should remove fields for view from recipient in s2s config', () => {
      const s2sData = removeUselessS2SKeys(s2sDataMock);
      expect(s2sData.recipients[0].isCollapsed).toBeUndefined();
      expect(s2sData.recipients[0].errors).toBeUndefined();
    });

    it('shouldn`t remove additional documents field for from recipient in s2s config', () => {
      const s2sData = removeUselessS2SKeys(s2sDataMock);
      expect(s2sData.recipients[0].additional_documents.length).toBe(s2sDataMock.recipients[0].additional_documents.length);
    });

    it('should remove additional documents field for from recipient in s2s config', () => {
      s2sDataMock.recipients[0].additional_documents = [];
      const s2sData = removeUselessS2SKeys(s2sDataMock);
      expect(s2sData.recipients[0].additional_documents).toBeUndefined();
    });
  });
});
