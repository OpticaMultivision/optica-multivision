import mongoose, { model, Schema } from 'mongoose';

const customerInformationSchema = new Schema({
  phone: { type: String, required: true },
  email: { type: String, required: true },
});

const recipeDetailsSchema = new Schema({
  price: {
    base: { type: Number, required: true },
    currency: { type: String, default: 'CLP' },
    discount: { type: Number, default: 0 },
  },
  quantity: { required: true, type: Number },
  image: [],
});

const recipeSchema = new Schema(
  {
    customerName: {
      type: String,
      required: true,
      index: 'text',
    },
    customerContactInformation: customerInformationSchema,
    products: {
      type: [String],
      required: true,
      index: true,
    },
    cristals: {
      type: [String],
      required: true,
      index: true,
    },
    graduations: {
      type: [String],
      required: true,
      index: true,
    },
    recipeDetails: recipeDetailsSchema,
    addition: {
      type: String,
    },
  },
  { timestamps: true }
);

const Recipe = mongoose.models.Recipe || model('Recipe', recipeSchema);
export default Recipe;
