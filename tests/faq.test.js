/* eslint-disable no-undef */
const mongoose = require('mongoose');
const FAQ = require('../models/faq.model');
const request = require('supertest');
const { it,afterAll, expect, beforeAll, describe } = require('@jest/globals');
const app = require('..');

describe('Testing FAQ API Endpoints', () => {
  beforeAll(async () => {
    // Connect to the test database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Clear the FAQ collection and close the connection
    await FAQ.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /api/faqs', () => {
    it('should successfully add a new FAQ entry', async () => {
      const response = await request(app)
        .post('/api/faqs')
        .send({
          question: 'How does Node.js work?',
          answer: "Node.js operates as a runtime built on Chrome's V8 engine.",
        });

      expect(response.status).toBe(201);
      expect(response.body.question).toBe('How does Node.js work?');
      expect(response.body.answer).toBe("Node.js operates as a runtime built on Chrome's V8 engine.");
    });

    it('should return 400 if question is missing', async () => {
      const response = await request(app)
        .post('/api/faqs')
        .send({
          answer: 'This is an answer without a question.',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Question is required.');
    });

    it('should return 400 if answer is missing', async () => {
      const response = await request(app)
        .post('/api/faqs')
        .send({
          question: 'This is a question without an answer.',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Answer is required.');
    });
  });

  describe('GET /api/faqs', () => {
    it('should fetch all FAQ entries', async () => {
      // Add a test FAQ entry
      await FAQ.create({
        question: 'What is Node.js?',
        answer: 'Node.js is a runtime environment for executing JavaScript code.',
      });

      const response = await request(app).get('/api/faqs');

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].question).toBe('What is Node.js?');
      expect(response.body[0].answer).toBe('Node.js is a runtime environment for executing JavaScript code.');
    });
  });

  describe('GET /api/faqs/:id', () => {
    it('should fetch a single FAQ entry by ID', async () => {
      // Add a test FAQ entry
      const faq = await FAQ.create({
        question: 'What is Node.js?',
        answer: 'Node.js is a runtime environment for executing JavaScript code.',
      });

      const response = await request(app).get(`/api/faqs/${faq._id}`);

      expect(response.status).toBe(200);
      expect(response.body.question).toBe('What is Node.js?');
      expect(response.body.answer).toBe('Node.js is a runtime environment for executing JavaScript code.');
    });

    it('should return 404 if FAQ entry is not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/faqs/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('FAQ not found.');
    });
  });

  describe('PUT /api/faqs/:id', () => {
    it('should update an existing FAQ entry', async () => {
      // Add a test FAQ entry
      const faq = await FAQ.create({
        question: 'What is Node.js?',
        answer: 'Node.js is a runtime environment for executing JavaScript code.',
      });

      const response = await request(app)
        .put(`/api/faqs/${faq._id}`)
        .send({
          question: 'What is Node.js used for?',
          answer: 'Node.js is used for building scalable network applications.',
        });

      expect(response.status).toBe(200);
      expect(response.body.question).toBe('What is Node.js used for?');
      expect(response.body.answer).toBe('Node.js is used for building scalable network applications.');
    });

    it('should return 404 if FAQ entry to update is not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/faqs/${nonExistentId}`)
        .send({
          question: 'Updated question',
          answer: 'Updated answer',
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('FAQ not found.');
    });
  });

  describe('DELETE /api/faqs/:id', () => {
    it('should delete an existing FAQ entry', async () => {
      // Add a test FAQ entry
      const faq = await FAQ.create({
        question: 'What is Node.js?',
        answer: 'Node.js is a runtime environment for executing JavaScript code.',
      });

      const response = await request(app).delete(`/api/faqs/${faq._id}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('FAQ deleted successfully.');
    });

    it('should return 404 if FAQ entry to delete is not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app).delete(`/api/faqs/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('FAQ not found.');
    });
  });
});