import { useContext } from "react";
import { LoginContext } from "../context/LoginContext";

import RichTextEditor from "../components/RichTextEditor";
import RequireAuth from "../components/RequireAuth";

import { toast } from "react-toastify";

import { convertToRaw } from "draft-js";
import { useNavigate } from "react-router-dom";

import { createNewRecipe } from "../utils/db";

import { handleTextEditing } from "../utils/misc";

const Create = () => {
    const { setUser } = useContext(LoginContext);

    const navigate = useNavigate();

    const save = (title, editorState) => {
        const data = convertToRaw(editorState.getCurrentContent());

        const results = handleTextEditing(title, editorState);

        if (!results) return;

        createNewRecipe(title, data).then((res) => {
            if (res) {
                setUser(res);
                toast.success("Created recipe", {
                    toastId: "create",
                });
                navigate("/dashboard");
            }
        });
    };

    return (
        <RequireAuth>
            <RichTextEditor save={save} />
        </RequireAuth>
    );
};

export default Create;
