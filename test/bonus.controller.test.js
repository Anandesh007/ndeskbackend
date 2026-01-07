import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import express from 'express';

import { createBonusController } from '../src/controllers/bonus.controller.js';

describe('Bonus Controller', () => {
  let app;
  let serviceMocks;
  let controller;

  beforeEach(() => {
    serviceMocks = {
      applyPerformanceBonus: sinon.stub().resolves(),
      applyFestivalBonus: sinon.stub().resolves()
    };

    controller = createBonusController(serviceMocks);

    app = express();
    app.use(express.json());
    app.post('/performance', controller.performanceBonus);
    app.post('/festival', controller.festivalBonus);
    sinon.stub(console, 'error')
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('POST /performance', () => {
    it('should apply performance bonus successfully', async () => {
      const res = await request(app)
        .post('/performance')
        .send();

      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.message).to.equal('Performance bonus applied');
      expect(serviceMocks.applyPerformanceBonus.calledOnce).to.be.true;
    });

    it('should return 500 if service throws error', async () => {
      serviceMocks.applyPerformanceBonus.rejects(new Error('Service error'));

      const res = await request(app)
        .post('/performance')
        .send();

      expect(res.status).to.equal(500);
      expect(res.body.success).to.be.false;
    });
  });

  describe('POST /festival', () => {
    it('should apply festival bonus successfully', async () => {
      const payload = {
        amount: 5000.00,
        festivalName: 'Diwali',
        month:9,
        year:2025
      };

      const res = await request(app)
        .post('/festival')
        .send(payload);

      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.message).to.equal('Festival bonus applied');
      expect(serviceMocks.applyFestivalBonus.calledOnceWith(payload)).to.be.true;
    });

    it('should return 400 if validation fails', async () => {
      const res = await request(app)
        .post('/festival')
        .send({});

      expect(res.status).to.equal(400);
      expect(res.body.success).to.be.false;
    });

    it('should return 400 if service throws error', async () => {
      serviceMocks.applyFestivalBonus.rejects(new Error('Service error'));

      const payload = {
        bonusAmount: 5000,
        festivalName: 'Diwali'
      };

      const res = await request(app)
        .post('/festival')
        .send(payload);

      expect(res.status).to.equal(400);
      expect(res.body.success).to.be.false;
    });
  });
});
