import useSWR from 'swr';
import { Recipe } from '__types__/common';

const useRecipes = () => {
  const {
    data: recipes = [],
    isLoading,
    mutate,
  } = useSWR<Recipe[]>('/api/recipes');
  return { recipes, isLoading, mutate };
};

export default useRecipes;
