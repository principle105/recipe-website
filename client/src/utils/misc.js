import { toast } from "react-toastify";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

TimeAgo.addDefaultLocale(en);

const timeAgo = new TimeAgo("en-US");

export const handleTextEditing = (title, editorState) => {
    if (!title) {
        toast.error("You are missing a title", {
            toastId: "missing-title",
        });
        return;
    }

    if (title.length >= 25) {
        toast.error("The title can be maximum of 25 characters long", {
            toastId: "title-too-long",
        });
        return;
    }

    return true;
};

export const recipeCreation = (value) => {
    const date = new Date(parseInt(value.toString().slice(0, 8), 16) * 1000);

    return timeAgo.format(date);
};
