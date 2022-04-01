import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";

import { toast } from "react-toastify";

import { useParams } from "react-router-dom";
import { fetchRecipe, updateRecipe } from "../utils/db";

import RichTextEditor from "../components/RichTextEditor";
import { convertToRaw } from "draft-js";

import { deepEqual } from "fast-equals";

import styles from "../styles/pages/Recipe.module.scss";

const Recipe = () => {
    const { id } = useParams();

    const [recipe, setRecipe] = useState(null);
    const { user } = useContext(LoginContext);

    const navigate = useNavigate();

    useEffect(() => {
        fetchRecipe(id).then((res) => {
            setRecipe(res);
        });
    }, [id]);

    const save = (title, editorState) => {
        const data = convertToRaw(editorState.getCurrentContent());

        if (!title) {
            toast.error("You are missing a title", {
                toastId: "missing-title",
            });
            return;
        }

        if (deepEqual(data, recipe.data) && title === recipe.title) {
            toast.error("You haven't made any changes", {
                toastId: "no-changes",
            });
            return;
        }

        updateRecipe(recipe._id, title, data).then((res) => {
            toast.success("Updated recipe", {
                toastId: "create",
            });
            navigate("/dashboard");
        });
    };

    return recipe ? (
        <section className={styles.container}>
            <div className={styles.editor}>
                <RichTextEditor
                    readOnly={!(user && recipe.author === user._id)}
                    initialTitle={recipe.title}
                    initialEditor={recipe.data}
                    save={save}
                />
            </div>
        </section>
    ) : (
        <p>Loading Recipe...</p>
    );
};

export default Recipe;