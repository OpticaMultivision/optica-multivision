import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import recipeController from '__server__/controllers/recipeController';
import connectDB from '__server__/db';
import errorHandler from '__server__/lib/errorHandler';
import noMatchHandler from '__server__/lib/noMatchHandler';

// create api router with next-connect
const router = createRouter<NextApiRequest, NextApiResponse>();

// connect database
connectDB();

// get all products
router.get(recipeController.getAllRecipe);

// searching products
router.post(recipeController.searchRecipe);

// create a handler from router with custom onError and onNoMatch
export default router.handler({
  onError: errorHandler,
  onNoMatch: noMatchHandler,
});
