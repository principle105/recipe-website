import { useContext, useState, useEffect } from "react";
import { LoginContext } from "../context/LoginContext";
import { fetchUserRecipes } from "../utils/db";
import RecipeDisplay from "../components/RecipeDisplay";
import RequireAuth from "../components/RequireAuth";

import styles from "../styles/pages/Dashboard.module.scss";

const Dashboard = () => {
    const [recipes, setRecipes] = useState(null);

    const { user } = useContext(LoginContext);

    useEffect(() => {
        if (user) {
            fetchUserRecipes().then((res) => {
                setRecipes(res);
            });
        }
    }, [user]);

    return (
        <RequireAuth>
            <div className={styles.container}>
                <h1>All Recipes Posted ({recipes ? recipes.length : 0})</h1>
                {recipes && recipes.length > 0 ? (
                    <RecipeDisplay recipes={recipes} />
                ) : (
                    <p>You have not posted any recipes</p>
                )}
            </div>
        </RequireAuth>
    );
};

export default Dashboard;
