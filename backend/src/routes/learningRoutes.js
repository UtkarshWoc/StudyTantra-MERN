import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { aiRateLimit } from '../middlewares/aiRateLimit.js';
import { validate } from '../middlewares/validate.js';
import { getReviewQueue, submitReview } from '../controllers/reviewController.js';
import { getOverview, getTopics } from '../controllers/insightsController.js';
import { listCollections, createCollection, getCollection, updateCollection, deleteCollection } from '../controllers/collectionController.js';
import { createPlan, listPlans, getPlan, updatePlanTask, deletePlan } from '../controllers/planController.js';
import {
  reviewSchema,
  reviewQueueQuery,
  collectionSchema,
  collectionUpdateSchema,
  createPlanSchema,
  planTaskSchema,
} from '../validators/learningSchemas.js';
import { z } from 'zod';

// Spaced repetition
export const reviewRoutes = express.Router()
  .get('/queue', protect, validate({ query: reviewQueueQuery }), getReviewQueue)
  .post('/:id', protect, validate({ body: reviewSchema }), submitReview);

// Streaks, heatmap, weak topics
export const insightsRoutes = express.Router()
  .get('/overview', protect, getOverview)
  .get('/topics', protect, validate({ query: z.object({ document: z.string().regex(/^[a-f0-9]{24}$/i).optional() }) }), getTopics);

export const collectionRoutes = express.Router()
  .get('/', protect, listCollections)
  .post('/', protect, validate({ body: collectionSchema }), createCollection)
  .get('/:id', protect, getCollection)
  .put('/:id', protect, validate({ body: collectionUpdateSchema }), updateCollection)
  .delete('/:id', protect, deleteCollection);

// Exam study planner
export const planRoutes = express.Router()
  .get('/', protect, listPlans)
  .post('/', protect, aiRateLimit, validate({ body: createPlanSchema }), createPlan)
  .get('/:id', protect, getPlan)
  .patch('/:id/tasks/:taskId', protect, validate({ body: planTaskSchema }), updatePlanTask)
  .delete('/:id', protect, deletePlan);
