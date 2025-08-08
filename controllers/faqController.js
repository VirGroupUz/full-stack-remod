const FAQ = require('../models/FAQ');

const getFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find();
        res.json(faqs);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const createFAQ = async (req, res) => {
    const { question, answer } = req.body;

    try {
        const faq = new FAQ({ question, answer });
        await faq.save();
        res.status(201).json(faq);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getFAQs, createFAQ };