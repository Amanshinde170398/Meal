const mealContainer = document.getElementById("meal-container");
const mealDetailContainer = document.getElementById("meal-detail-container");
const favouriteMealContainer = document.getElementById(
  "favourite-meal-container"
);
let favourites = "";
let removeFavourite = "";
let mealCardContainer = "";

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
  return await customFetch(API_URLS.getMealDetail(mealId), {
    method: "GET",
  });
};

// get meal data on searching
const getMeals = async (query) => {
  return await customFetch(API_URLS.search(query), { method: "GET" });
};

let pageDetails = "";
// Event handle for search box
const searchBox = document.getElementById("search-meal");
const mealCardCont = document.querySelector("#meal-container .row");
const noCardElem = document.querySelector(".no-cards");
const handleSearchEvent = async function (e) {
  mealDetailContainer.classList.add("is-hidden");
  mealContainer.classList.remove("is-hidden");
  favouriteMealContainer.classList.add("is-hidden");
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
            <a href="#" class="meal-detail-page" data-meal-id=${meal["idMeal"]}>
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
                <a class="primary-btn card-favourite search ${
                  isFavourite(meal["idMeal"]) ? "is-hidden" : ""
                }" data-meal-id=${
          meal["idMeal"]
        } style="color: white">Add To Favourite</a>
                <a class="primary-btn card-remove-favourite search ${
                  isFavourite(meal["idMeal"]) ? "" : "is-hidden"
                }" data-meal-id=${
          meal["idMeal"]
        } style="color: white">Remove From Favourite</a>
              </div>
            </a>
          </div>
        </div>
      </div>`;
      })
      .join("");
    mealCardCont.innerHTML = html;
    pageDetails = document.querySelectorAll(".meal-detail-page");
    for (let pageDetail of pageDetails) {
      pageDetail.addEventListener("click", handlePageDetailEvent);
    }
    favourites = document.querySelectorAll(".card-favourite");
    for (let favourite of favourites) {
      favourite.addEventListener("click", handleAddFavouriteEvent);
    }
    removeFavourite = document.querySelectorAll(".card-remove-favourite");
    for (let remove of removeFavourite) {
      remove.addEventListener("click", handleRemoveFavourite);
    }
  } else {
    noCardElem.classList.remove("is-hidden");
  }
  // remove loader from here
};
searchBox.addEventListener("keyup", handleSearchEvent);

// Event handle for detail meal page
const handlePageDetailEvent = async function (e) {
  e.preventDefault();
  let mealId = this.dataset.mealId;
  const response = await getMealDetail(mealId);
  if (response.meals.length) {
    mealDetailContainer.classList.remove("is-hidden");
    mealContainer.classList.add("is-hidden");
    favouriteMealContainer.classList.add("is-hidden");
    const meal = response.meals[0];
    const html = `<div class="mb-5 ml-3">
    <a class="primary-btn page-back-btn" style="color: white">Back</a>
  </div>
  <div class="row">
    <div class="col-sm-4">
      <img
        height="20rem"
        src=${meal["strMealThumb"]}
      />
    </div>
    <div class="col">
      <p>
        <b class="purple">Name: </b
        ><span class="grey">
        ${meal["strMeal"]}</span>
      </p>
      <p>
        <b class="purple">Category: </b><span class="grey">${
          meal["strCategory"]
        }</span>
      </p>
      <p><b class="purple">Area: </b><span class="grey">${
        meal["strArea"]
      }</span></p>
      <p>
        <b class="purple">Tags: </b><span class="grey mr-2">${
          meal["strTags"] || "Delicious"
        }</span>
      </p>
      <p>
        <b class="purple">Instruction: </b
        ><span class="grey"
          >${meal["strInstructions"]}</span
        >
      </p>
      <div class="favourite mt-5">
        <a class="primary-btn search card-favourite detail ${
          isFavourite(meal["idMeal"]) ? "is-hidden" : ""
        }" data-meal-id=${
      meal["idMeal"]
    } style="color: white">Add To Favourite</a>
        <a class="primary-btn search card-remove-favourite detail ${
          isFavourite(meal["idMeal"]) ? "" : "is-hidden"
        }" data-meal-id=${meal["idMeal"]} style="color: white"
          >Remove From Favourite</a
        >
      </div>
    </div>
  </div>`;
    mealDetailContainer.innerHTML = html;

    let backs = document.querySelectorAll(".page-back-btn");
    for (let back of backs) {
      back.addEventListener("click", function (e) {
        e.preventDefault();
        mealContainer.classList.remove("is-hidden");
        mealDetailContainer.classList.add("is-hidden");
      });
    }
    removeFavourite = document.querySelectorAll(".card-remove-favourite");
    for (let remove of removeFavourite) {
      remove.addEventListener("click", handleRemoveFavourite);
    }

    favourites = document.querySelectorAll(".card-favourite");
    for (let favourite of favourites) {
      favourite.addEventListener("click", handleAddFavouriteEvent);
    }
  }
};

// Event handle for add to favourite
const handleAddFavouriteEvent = function (e) {
  let favouriteMeals = [];
  let mealId = this.dataset.mealId;
  this.classList.add("is-hidden");
  this.nextElementSibling.classList.remove("is-hidden");
  favouriteMeals = JSON.parse(localStorage.getItem("mealIds")) || [];
  if (!favouriteMeals.includes(this.dataset.mealId)) {
    favouriteMeals.push(this.dataset.mealId);
    localStorage.setItem("mealIds", JSON.stringify(favouriteMeals));
  }
  if (this.classList.contains("detail")) {
    const remove = document.querySelector(
      `[data-meal-id="${mealId}"].card-remove-favourite`
    );
    const add = document.querySelector(
      `[data-meal-id="${mealId}"].card-favourite`
    );
    add.classList.add("is-hidden");
    remove.classList.remove("is-hidden");
  }
};

// Event for Favourite page
const handleNavFavouriteEvent = async function (e) {
  e.preventDefault();
  const favouriteMealRow = document.querySelector(
    "#favourite-meal-container .row"
  );
  mealContainer.classList.add("is-hidden");
  mealDetailContainer.classList.add("is-hidden");
  favouriteMealContainer.classList.remove("is-hidden");
  let favouriteMealDetail = [];
  let favouriteMeals = JSON.parse(localStorage.getItem("mealIds")) || [];
  if (favouriteMeals.length > 0) {
    for (let favouriteMeal of favouriteMeals) {
      let response = await getMealDetail(favouriteMeal);
      if (response.meals) {
        let meal = response.meals[0];
        favouriteMealDetail.push(meal);
      }
    }

    let html = "";
    html = favouriteMealDetail
      .map((meal) => {
        return `<div class="col">
        <div class="meal-card-container">
          <div class="meal-card">
            <a href="#" class="meal-detail-page" data-meal-id=${meal["idMeal"]}>
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
              <a class="primary-btn favourite card-remove-favourite" data-meal-id=${meal["idMeal"]} style="color: white">Remove From Favourite</a>
              </div>
            </a>
          </div>
        </div>
      </div>`;
      })
      .join("");
    favouriteMealRow.innerHTML = html;
    pageDetails = document.querySelectorAll(".meal-detail-page");
    for (let pageDetail of pageDetails) {
      pageDetail.addEventListener("click", handlePageDetailEvent);
    }

    removeFavourite = document.querySelectorAll(".card-remove-favourite");
    for (let remove of removeFavourite) {
      remove.addEventListener("click", handleRemoveFavourite);
    }
    mealCardContainer = document.querySelectorAll(".meal-card-container");
    for (let card of mealCardContainer) {
      card.addEventListener("click", handleRemoveCard);
    }
  } else {
    favouriteMealRow.innerHTML = "";
  }
};

const navFavourite = document.getElementById("nav-favourite");
navFavourite.addEventListener("click", handleNavFavouriteEvent);

// handle Remove from favourite
const handleRemoveFavourite = function (e) {
  let mealId = this.dataset.mealId;
  let favouriteMeals = JSON.parse(localStorage.getItem("mealIds")) || [];
  if (this.classList.contains("search")) {
    this.classList.add("is-hidden");
    this.previousElementSibling.classList.remove("is-hidden");
  }
  if (favouriteMeals.length > 0) {
    favouriteMeals = favouriteMeals.filter(
      (favouriteMeal) => favouriteMeal != mealId
    );
    localStorage.setItem("mealIds", JSON.stringify(favouriteMeals));
  }
  if (this.classList.contains("detail")) {
    const remove = document.querySelector(
      `[data-meal-id="${mealId}"].card-remove-favourite`
    );
    const add = document.querySelector(
      `[data-meal-id="${mealId}"].card-favourite`
    );
    add.classList.remove("is-hidden");
    remove.classList.add("is-hidden");
  }
};

// check if meal is added to favourite or not
function isFavourite(mealId) {
  let favouriteMeals = JSON.parse(localStorage.getItem("mealIds")) || [];
  if (favouriteMeals.length > 0) {
    return favouriteMeals.includes(mealId);
  } else {
    return false;
  }
}

// Remove card from Favourite
function handleRemoveCard(e) {
  if (e.target.classList.contains("favourite")) this.remove();
}
