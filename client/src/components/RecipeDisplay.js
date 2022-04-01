import { useNavigate } from "react-router-dom";

import styles from "../styles/components/RecipeDisplay.module.scss";

const RecipeDisplay = ({ recipes }) => {
    const navigate = useNavigate();

    return recipes ? (
        <div className={styles.container}>
            {recipes.map((r, i) => (
                <div
                    key={i}
                    className={styles.recipe}
                    onClick={() => navigate(`/recipe/${r._id}`)}
                >
                    <h2>{r.title}</h2>
                </div>
            ))}
        </div>
    ) : (
        <p>Loading Recipes...</p>
    );
};

export default RecipeDisplay;
