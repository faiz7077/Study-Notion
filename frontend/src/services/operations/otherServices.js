import { toast } from "react-hot-toast"
import { categoriesApi, reviewApi } from "../apis";
import { apiConnector } from "../apiConnector";

// Get all reviews
export const getAllReviews = async () => {
  let result = [];
  try {
    const response = await apiConnector('GET', reviewApi.GET_GET_ALL_REVIEWS_API);
    result = response.data?.data;
  } catch (error) {
    toast.error('Could not fetch course reviews, Refresh the page');
  }
  return result
}

// Get all Categories
export const getAllCategories = async () => {
  let result = [];
  try {
    const response = await apiConnector('GET', categoriesApi.GET_GET_ALL_CATEGORIES_API);
    result = response.data?.data;
  } catch (error) {
    toast.error('Could not fetch course categories, Refresh the page');
  }
  return result
}
