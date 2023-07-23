const API_ROOT = "https://www.themealdb.com/api/json/v1/1";
const API_URLS = {
  search: (query) => `${API_ROOT}/search.php?s=${query}`,
  listMealByFirstLetter: (firstLetter) =>
    `${API_ROOT}/search.php?f=${firstLetter}`,
  getMealDetail: (id) => `${API_ROOT}/lookup.php?i=${id}`,
};

// custom fetch method to make the API call
const customFetch = async (url, { body, ...customConfig }) => {
  const config = {
    ...customConfig,
    headers: {
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
  } catch (err) {
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

// get meal data on searching
const getMeals = async (query) => {
  return await customFetch(API_URLS.search(query), { method: "GET" });
};

// Event handle for search box
const searchBox = document.getElementById("search-meal");
const mealCardCont = document.querySelector("#meal-container .row");
const noCardElem = document.querySelector(".no-cards");
// console.log(mealCardRow);
const handleSearchEvent = async function (e) {
  console.log(e.target.value);
  // Add loader here
  const response = await getMeals(e.target.value);
  const meals = response.meals;
  let html = "";
  if (meals) {
    noCardElem.classList.add("is-hidden");
    html = meals
      .map((meal) => {
        return `<div class="col">
        <div class="meal-card-container">
          <div class="meal-card">
            <a href="#">
              <div class="meal-card-img-container">
                <div class="meal-img">
                  <img
                    src=${meal["strMealThumb"]}
                  />
                </div>
              </div>
              <div class="meal-card-desc-section">
                <div class="meal-tag">
                  <div class="grid-container">
                    <div class="tag">
                    ${meal["strCategory"]}</div>
                    <div class="tag">${meal["strArea"]}</div>
                  </div>
                </div>
                <div class="meal-data">
                  <div>${meal["strMeal"]}</div>
                  <p>${meal["strInstructions"]}</p>
                </div>
              </div>
              <div>
                <a class="primary-btn" style="color: white">Add To Favourite</a>
              </div>
            </a>
          </div>
        </div>
      </div>`;
      })
      .join("");
    mealCardCont.innerHTML = html;
  } else {
    noCardElem.classList.remove("is-hidden");
  }
  // remove loader from here
};
searchBox.addEventListener("keyup", handleSearchEvent);
