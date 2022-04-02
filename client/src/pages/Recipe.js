import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import { toast } from "react-toastify";

import { useParams } from "react-router-dom";
import { fetchRecipe, updateRecipe, deleteRecipe } from "../utils/db";

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
            if (res) {
                setRecipe(res);
            } else {
                toast.error("Invalid recipe", {
                    toastId: "invalid-recipe",
                });
                navigate("/");
            }
        });
    }, [id, navigate]);

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

    const handleRecipeDelete = () => {
        confirmAlert({
            title: "Confirm Delete",
            message: "Are you sure you want to delete this recipe?",
            closeOnEscape: false,
            closeOnClickOutside: false,
            buttons: [
                {
                    label: "Yes",
                    onClick: () => {
                        deleteRecipe(recipe._id).then((res) => {
                            if (res) {
                                toast.success("Deleted recipe", {
                                    toastId: "deleted",
                                });
                                navigate("/dashboard");
                            }
                        });
                    },
                },
                {
                    label: "No",
                },
            ],
            overlayClassName: styles.modal,
        });
    };

    return (
        <section className={styles.container}>
            <div className={styles.editor}>
                {recipe ? (
                    <RichTextEditor
                        readOnly={!(user && recipe.author === user._id)}
                        initialTitle={recipe.title}
                        initialEditor={recipe.data}
                        save={save}
                        deleteRecipe={handleRecipeDelete}
                    />
                ) : null}
            </div>
        </section>
    );
};

export default Recipe;
