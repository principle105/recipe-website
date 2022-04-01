import axios from "axios";
import { toast } from "react-toastify";
import { url } from "../config";

const api = axios.create({
    withCredentials: true,
});

const toastError = () => {
    toast.error("Something went wrong", {
        toastId: "bad",
    });
};

export const fetchUserData = () => {
    return api
        .get(`${url}/users/me`)
        .then((res) => {
            return res.data;
        })
        .catch((e) => {
            toastError();
            return;
        });
};

export const fetchUserRecipes = () => {
    return api
        .get(`${url}/recipes/me`)
        .then((res) => {
            return res.data;
        })
        .catch((e) => {
            toastError();
            return;
        });
};

export const fetchRecipe = (id) => {
    return api
        .get(`${url}/recipes/find/${id}`)
        .then((res) => {
            return res.data;
        })
        .catch((e) => {
            toastError();
            return;
        });
};

export const createNewRecipe = (title, data) => {
    return api
        .post(`${url}/recipes/new`, { title, data })
        .then((res) => {
            return res.data;
        })
        .catch((e) => {
            toastError();
            return;
        });
};

export const updateRecipe = (id, title, data) => {
    return api
        .post(`${url}/recipes/update`, { id, title, data })
        .then((res) => {
            return res.data;
        })
        .catch((e) => {
            toastError();
            return;
        });
};

export const fetchRandomRecipes = () => {
    return api
        .get(`${url}/recipes/random`)
        .then((res) => {
            return res.data;
        })
        .catch((e) => {
            toastError();
            return;
        });
};
