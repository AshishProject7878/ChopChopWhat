import React, { useState } from "react";
import "../Styles/style.css";
import "../Styles/search.css";
import { useNavigate } from "react-router-dom";

// The API key is now securely accessed from an environment variable.
const apiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [vegFilter, setVegFilter] = useState("");
  const [cardContent, setCardContent] = useState(null);
  const [cardVisible, setCardVisible] = useState(false);
  const navigate = useNavigate();

  const searchRecipe = async () => {
    setCardVisible(true);
    setCardContent("Searching...");

    if (!apiKey) {
      setCardContent(<p style={{ color: "red" }}>Error: API key is missing. Please check your .env configuration.</p>);
      return;
    }
    
    try {
      const params = new URLSearchParams({
        apiKey: apiKey,
        number: 1,
      });

      if (!query && !cuisine && !vegFilter) {
        const randomOffset = Math.floor(Math.random() * 900);
        params.append("offset", randomOffset);
      }

      if (query) params.append("query", query);
      if (cuisine) params.append("cuisine", cuisine);
      if (vegFilter === "vegetarian") {
        params.append("diet", "vegetarian");
      } else if (vegFilter === "non-veg") {
        params.append("excludeIngredients", "tofu, seitan, tempeh, lentils");
      }

      const searchUrl = `https://api.spoonacular.com/recipes/complexSearch?${params.toString()}`;

      const searchRes = await fetch(searchUrl);
      if (!searchRes.ok) {
        throw new Error(`Search failed: ${searchRes.statusText} (${searchRes.status})`);
      }
      const searchData = await searchRes.json();

      if (!searchData.results || searchData.results.length === 0) {
        setCardContent(<p>No recipes found. Please try a different search. 🤔</p>);
        return;
      }

      const recipeId = searchData.results[0].id;
      const infoUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}&includeNutrition=false`;
      
      const infoRes = await fetch(infoUrl);
      if (!infoRes.ok) {
        throw new Error(`Could not fetch recipe details: ${infoRes.statusText} (${infoRes.status})`);
      }
      const recipe = await infoRes.json();

      const ingredients = recipe.extendedIngredients?.length
        ? recipe.extendedIngredients.map(ing => <li key={ing.id}>{ing.original}</li>)
        : <li>No ingredients listed.</li>;
        
      const steps = recipe.analyzedInstructions?.[0]?.steps.length
        ? recipe.analyzedInstructions[0].steps.map(step => <li key={step.number}>{step.step}</li>)
        : <li>No instructions available.</li>;

      setCardContent(
        <>
          <h2 className="recipe-title">{recipe.title || "Untitled Recipe"}</h2>
          <div className="card-layout">
            <div className="left-side">
              <img src={recipe.image || "https://via.placeholder.com/300"} alt={recipe.title || "Recipe Image"} />
              <p className="info-text">
                Ready In: {recipe.readyInMinutes || "N/A"} mins | Servings: {recipe.servings || "N/A"}
              </p>
            </div>
            <div className="right-side">
              <h3>🥦 Ingredients:</h3>
              <ul>{ingredients}</ul>
            </div>
          </div>
          <div className="summary-section">
            <h3>Summary:</h3>
            <p dangerouslySetInnerHTML={{ __html: recipe.summary || "No summary available." }}></p>
          </div>
          <div className="steps-section">
            <h3>📋 Steps:</h3>
            <ol>{steps}</ol>
          </div>
        </>
      );
    } catch (error) {
      console.error("Error during recipe search:", error);
      setCardContent(<p style={{ color: "red" }}>Error: {error.message}. Please try again later.</p>);
    }
  };

  return (
    <>
      <div className="home-btn-container">
        <button className="cta-btn" onClick={() => navigate("/")}>Home</button>
      </div>
      <section className="hero search-hero">
        <h1 className="main-title search-title" id="animated-title">
          <span className="word">Chop</span>
          <span className="word"> Chop!</span><br />
          <span className="word black-text">Tell</span>
          <span className="word black-text"> Us</span>
          <span className="word"> What</span>
          <span className="word"> You</span>
          <span className="word black-text"> Got</span>
        </h1>
        <form className="recipe" onSubmit={(e) => { e.preventDefault(); searchRecipe(); }}>
          <div className="form-group">
            <input type="text" id="query" placeholder="e.g., chicken, biryani" value={query} onChange={e => setQuery(e.target.value)} />
            <select id="cuisine" value={cuisine} onChange={e => setCuisine(e.target.value)}>
              <option value="">All Cuisines</option>
              <option value="Indian">Indian</option>
              <option value="Mexican">Mexican</option>
              <option value="Italian">Italian</option>
              <option value="Chinese">Chinese</option>
            </select>
            <select id="vegFilter" value={vegFilter} onChange={e => setVegFilter(e.target.value)}>
              <option value="">Any</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="non-veg">Non-Vegetarian</option>
            </select>
            <button type="submit">Search</button>
          </div>
        </form>
      </section>
      {cardVisible && <div id="recipeCard" className="card">{cardContent}</div>}
    </>
  );
};

export default SearchPage;