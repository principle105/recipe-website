import { useEffect, useState } from "react";
import styles from "../styles/pages/Browse.module.scss";
import RecipeDisplay from "../components/RecipeDisplay";
import { fetchRandomRecipes } from "../utils/db";

const Browse = () => {
    const [recipes, setRecipes] = useState(null);

    const updateRecipes = () => {
        fetchRandomRecipes().then((res) => {
            if (res) {
                setRecipes(res);
            }
        });
    };

    useEffect(() => {
        updateRecipes();
    }, []);

    return (
        <section className={styles.container}>
            <h1>Browse Recipes</h1>
            <p>Results update every 5 minutes</p>

            {recipes ? <RecipeDisplay recipes={recipes} /> : null}
            <button className={styles.refresh} onClick={updateRecipes}>
                Refresh
            </button>
        </section>
    );
};

export default Browse;
