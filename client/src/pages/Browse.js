import { useEffect, useState } from "react";
import styles from "../styles/pages/Browse.module.scss";
import RecipeDisplay from "../components/RecipeDisplay";

import { fetchRandomRecipes } from "../utils/db";

const Browse = () => {
    const [recipes, setRecipes] = useState(null);
    const [disabled, setDisabled] = useState(false);

    const updateRecipes = () => {
        fetchRandomRecipes().then((res) => {
            if (res) {
                setRecipes(res);
            }
        });
    };

    const refreshRecipes = () => {
        if (!disabled) {
            setDisabled(true);

            updateRecipes();

            setTimeout(() => {
                setDisabled(false);
            }, 2000);
        }
    };

    useEffect(() => {
        updateRecipes();
    }, []);

    return (
        <section className={styles.container}>
            <h1>Browse Recipes</h1>
            {recipes ? (
                <>
                    <RecipeDisplay recipes={recipes} />
                    <button
                        className={styles.refresh}
                        onClick={refreshRecipes}
                        disabled={disabled}
                    >
                        Refresh
                    </button>
                </>
            ) : null}
        </section>
    );
};

export default Browse;
