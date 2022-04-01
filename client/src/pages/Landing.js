import styles from "../styles/pages/Landing.module.scss";
import { Link } from "react-router-dom";

const Landing = () => {
    return (
        <>
            <section className={styles.hero}>
                <div className={styles.container}>
                    <h2>Find a recipe</h2>
                    <p>
                        Lorem, ipsum dolor sit amet consectetur adipisicing
                        elit. Magnam nemo excepturi, exercitationem at odio
                        tenetur.
                    </p>
                    <Link to="/browse">Browse Recipes</Link>
                </div>
            </section>
        </>
    );
};

export default Landing;
