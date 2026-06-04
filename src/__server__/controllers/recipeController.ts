import { NextApiRequest, NextApiResponse } from 'next';
import NodeCache from 'node-cache';
import { deleteFiles } from '../middleware/uploadMiddleware';
import Product from '../model/Product';
import errorResponse from '__server__/utils/error';
import Recipe from '__server__/model/Recipe';
import ProductImage from '__types__/product-image';
import category from '../../../pages/api/category';

// cache instance
const cache = new NodeCache({ stdTTL: 20 });

// next api request extend type
interface ExtendApiRequest extends NextApiRequest {
  files?: Express.MulterS3.File[];
}

type RecipeImage = { key: string; location: string };

const getAllRecipe = async (_: NextApiRequest, res: NextApiResponse) => {
  try {
    if (cache.has('recipes')) {
      return res.status(200).json(JSON.parse(cache.get('recipes')!));
    }

    const getRecipes = await Recipe.find({}).sort('-createdAt');
    cache.set('recipes', JSON.stringify(getRecipes));
    return res.status(200).json(getRecipes);
  } catch (error) {
    errorResponse(error);
  }
};

const getOneRecipe = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;

    if (cache.has(`recipe-${id}`)) {
      return res.status(200).json(JSON.parse(cache.get(`recipe-${id}`)!));
    }

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      res.status(404);
      throw new Error('Recipe Not Found!');
    }

    cache.set(`product-${id}`, JSON.stringify(recipe));
    return res.status(200).json(recipe);
  } catch (error) {
    errorResponse(error);
  }
};

const deleteRecipe = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;
    const recipe = await Recipe.findById(id);

    const images = recipe.recipeDetails.image?.map((item: RecipeImage) => ({
      Key: item.key,
    }));

    if (images?.length > 0) {
      await deleteFiles(images);
    }

    const deleteRecipe = await Recipe.deleteOne({ _id: id });

    cache.del(`recipe-${id}`);
    return res.status(200).json(deleteRecipe);
  } catch (error) {
    errorResponse(error);
  }
};

const searchRecipe = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { search } = req.body;

    if (search) {
      const recipes = await Recipe.find({
        customerName: { $regex: search, $options: 'i' },
      });
      return res.status(200).json(recipes);
    }
    return res.status(200).json([]);
  } catch (error) {
    errorResponse(error);
  }
};

const createNewRecipe = async (req: ExtendApiRequest, res: NextApiResponse) => {
  try {
    const files = req.files;

    let images: RecipeImage[] = [];

    if (files) {
      images = files.map((file) => ({
        key: file.key,
        location: file.location,
      }));
    }

    const {
      customerName,
      phone,
      email,
      quantity,
      price,
      discount,
      addition,
      products,
      cristals,
      graduations,
    } = req.body;

    const recipe = {
      customerName,
      customerContactInformation: {
        phone,
        email,
      },
      recipeDetails: {
        price: { base: price, currency: 'CLP', discount: discount || 0 },
        image: images,
        quantity,
      },
      products: JSON.parse(products),
      cristals: JSON.parse(cristals),
      graduations: JSON.parse(graduations),
      addition,
    };

    const product = new Recipe(recipe);
    const createdRecipe = await product.save();

    cache.del('recipes');
    return res.status(201).json(createdRecipe);
  } catch (error) {
    errorResponse(error);
  }
};

const updateRecipe = async (req: ExtendApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query;

    const {
      customerName,
      phone,
      email,
      quantity,
      price,
      discount,
      addition,
      products,
      cristals,
      graduations,
      deleteImages,
    } = req.body;

    // find product via id
    const recipe = await Recipe.findById(id);

    let images = [...recipe.recipeDetails.image];

    // push new upload images
    if (req.files && req.files.length > 0) {
      req.files.forEach(({ key, location }) => images.push({ key, location }));
    }

    if (recipe) {
      const deleteExistingImage = JSON.parse(deleteImages);

      if (deleteExistingImage && deleteExistingImage.length > 0) {
        await deleteFiles(deleteExistingImage);

        images = images.filter((item) => {
          const find = deleteExistingImage.find(
            (img: any) => img.Key === item.key
          );
          return find ? false : true;
        });
      }

      const recipeData = {
        customerName: customerName || recipe.customerName,
        customerContactInformation: {
          phone: phone || recipe.phone,
          email: email || recipe.email,
        },
        recipeDetails: [
          {
            price: {
              currency: 'CLP',
              base: +price || recipe.price.base,
              discount: +discount || recipe.price.discount,
            },
            image: images,
            quantity:
              +quantity >= 0 ? +quantity : recipe.recipeDetails.quantity,
          },
        ],
        products: products ? JSON.parse(products) : recipe.products,
        cristals: cristals ? JSON.parse(cristals) : recipe.cristals,
        graduations: graduations ? JSON.parse(graduations) : recipe.graduations,
        addition: addition || recipe.addition,
      };

      const updateRecipe = await Recipe.findByIdAndUpdate(
        id,
        { $set: recipeData },
        { new: true, upsert: true }
      );

      cache.del(`recipe-${id}`);
      return res.status(201).json(updateRecipe);
    }
  } catch (error) {
    errorResponse(error);
  }
};

export default {
  getAllRecipe,
  searchRecipe,
  getOneRecipe,
  deleteRecipe,
  updateRecipe,
  createNewRecipe,
};
