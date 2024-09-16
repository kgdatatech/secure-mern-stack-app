// utils/csrfUtils.js

const csrf = require('csrf');
const tokens = new csrf();

const generateCsrfToken = () => {
  return tokens.create(process.env.CSRF_SECRET);
};

const verifyCsrfToken = (token) => {
  return tokens.verify(process.env.CSRF_SECRET, token);
};

module.exports = { generateCsrfToken, verifyCsrfToken };
