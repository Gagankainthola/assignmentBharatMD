const mongoose = require('mongoose');

const faqModelSchema = new mongoose.Schema({
    query: {
        type: String,
        required: true,
    },
    response: {
        type: String,
        required: true, 
    },
    localizedTexts: {
        query_hi: String,
        response_hi: String,
        query_bn: String,
        response_bn: String,
    }
});

faqModelSchema.methods.fetchLocalizedContent = function (languageCode) {
    return {
        query: this.localizedTexts[`query_${languageCode}`] || this.query,
        response: this.localizedTexts[`response_${languageCode}`] || this.response
    };
};

module.exports = mongoose.model('FAQ', faqModelSchema);