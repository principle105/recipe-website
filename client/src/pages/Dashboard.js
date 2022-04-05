import { useContext, useState, useEffect } from "react";
import { LoginContext } from "../context/LoginContext";
import { fetchUserRecipes } from "../utils/db";
import RecipeDisplay from "../components/RecipeDisplay";
import RequireAuth from "../components/RequireAuth";

import styles from "../styles/pages/Dashboard.module.scss";

const Dashboard = () => {
    const [recipes, setRecipes] = useState(null);

    const { user, setUser } = useContext(LoginContext);

    useEffect(() => {
        if (user) {
            fetchUserRecipes().then((res) => {
                if (res !== null) {
                    setRecipes(res);
                } else {
                    setUser(null);
                }
            });
        }
    }, [user, setUser]);

    return (
        <RequireAuth>
            {recipes ? (
                <div className={styles.container}>
                    <h1>All Recipes Posted ({recipes ? recipes.length : 0})</h1>
                    {recipes && recipes.length > 0 ? (
                        <RecipeDisplay recipes={recipes} />
                    ) : (
                        <p>You have not posted any recipes</p>
                    )}
                </div>
            ) : null}
        </RequireAuth>
    );
};

export default Dashboard;
