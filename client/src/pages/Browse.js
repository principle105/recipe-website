import { useEffect, useState } from "react";
import styles from "../styles/pages/Browse.module.scss";
import RecipeDisplay from "../components/RecipeDisplay";
import { fetchRandomRecipes } from "../utils/db";

const Browse = () => {
    const [recipes, setRecipes] = useState(null);

    useEffect(() => {
        fetchRandomRecipes().then((res) => {
            if (res) {
                setRecipes(res);
            }
        });
    }, []);

    return (
        <section className={styles.container}>
            <h1>Browse Recipes</h1>
            {recipes ? <RecipeDisplay recipes={recipes} /> : null}
        </section>
    );
};

export default Browse;
