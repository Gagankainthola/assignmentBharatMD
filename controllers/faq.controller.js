const { redisClient } = require("../lib/redis");
const { translateText } = require("../lib/translateText");
const FAQModel = require("../models/faq.model");

const fetchFAQs = async (req, res) => {
  try {
    const { lang } = req.query;
    const faqList = await FAQModel.find();
    const localizedFAQs = faqList.map((faq) => faq.getTranslatedText(lang));

    await redisClient.set(req.originalUrl, JSON.stringify(localizedFAQs), "EX", 3600);
    res.json(localizedFAQs);
  } catch (err) {
    res.status(500).json({ msg: "Fetch error", err });
  }
};

const createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const translatedQuestionHi = await translateText(question, "hi");
    const translatedQuestionBn = await translateText(question, "bn");
    const translatedAnswerHi = await translateText(answer, "hi");
    const translatedAnswerBn = await translateText(answer, "bn");

    const faqEntry = new FAQModel({
      question,
      answer,
      translations: {
        question_hi: translatedQuestionHi,
        question_bn: translatedQuestionBn,
        answer_hi: translatedAnswerHi,
        answer_bn: translatedAnswerBn,
      },
    });

    await faqEntry.save();
    res.status(201).json(faqEntry);
  } catch (err) {
    res.status(500).json({ msg: "Save error", err });
  }
};

const removeFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const faqEntry = await FAQModel.findById(id);
    if (!faqEntry) {
      return res.status(404).json({ msg: "Not found" });
    }
    await faqEntry.remove();
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Delete error", err });
  }
};

module.exports = { createFAQ, fetchFAQs, removeFAQ };
