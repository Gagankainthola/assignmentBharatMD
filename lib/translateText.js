const { translate: googleTranslate } = require('google-translate-api');

const textConverter = async (content, language) => {
  try {
    const translated = await googleTranslate(content, { to: language });
    return translated.text;
  } catch (translationError) {
    console.log('Failed to translate:', translationError);
    return content; // Return original content if translation fails
  }
};

module.exports = { textConverter };