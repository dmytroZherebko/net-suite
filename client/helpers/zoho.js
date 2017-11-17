export const filterZohoFields = (fields) => {
  const pageFields = fields;
  delete pageFields.id;
  Object.keys(pageFields).forEach((key) => {
    if (/^\$/.test(key) || typeof pageFields[key] === 'object') {
      delete pageFields[key];
    }

    if (typeof pageFields[key] === 'boolean') {
      pageFields[key] = pageFields[key] ? 'ON' : 'OFF';
    }

    if (pageFields[key] !== undefined && typeof pageFields[key] !== 'string') {
      pageFields[key] = pageFields[key].toString();
    }
  });
  return pageFields;
};

export const getMappedFields = (pdffillerFields, zohoFields) => {
  const mappedFields = {};
  pdffillerFields.forEach((field) => {
    if (zohoFields[field.name]) {
      mappedFields[field.name] = zohoFields[field.name];
    }
  });

  return mappedFields;
};
