const API_ROOT = "https://www.themealdb.com/api/json/v1/1";
const API_URLS = {
  search: (query) => `${API_ROOT}/search.php?s=${query}`,
  listMealByFirstLetter: (firstLetter) =>
    `${API_ROOT}/search.php?f=${firstLetter}`,
  getMealDetail: (id) => `${API_ROOT}/lookup.php?i=${id}`,
};

// custom fetch method to make the API call
const customFetch = async (url, { body, ...customConfig }) => {
  const headers = {
    "content-type": "application/json",
    accept: "application/json",
  };
  const config = {
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };
  if (body) {
    config.body = JSON.stringify(body);
  }
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      message: err.message,
      success: false,
    };
  }
};

// get meal detail for pass ID
const getMealDetail = async (mealId) => {
  const data = await customFetch(API_URLS.getMealDetail(mealId), {
    method: "GET",
  });
  if (data.meals) {
    console.log(data.meals);
  }
};
