const express = require('express');
const { connectDB } = require('./database/db');
const bodyParser = require('body-parser');
const faqRoutes = require('./routes/faq.route');
const cors = require('cors');
require('dotenv').config({ path: './.env' });
const app = express()
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(bodyParser.json());

connectDB(MONGO_URI);


app.use('/api/faqs', faqRoutes);

app.listen(PORT, () => {
    console.log(`Server is up and running at http://localhost:${PORT}`);
});