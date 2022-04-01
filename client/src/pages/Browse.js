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
            {recipes ? (
                <>
                    <h1>Browse Recipes</h1>
                    <RecipeDisplay recipes={recipes} />
                </>
            ) : (
                <p>Loading recipes...</p>
            )}
        </section>
    );
};

export default Browse;
