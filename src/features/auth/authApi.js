import api from "../../utils/axios";

export const registerAPI = async (data) => {
    const res = await api.post("/users/register", data);
    return res.data;
};

export const loginAPI = async (data) => {
    const res = await api.post("/users/login", data);
    return res.data;
};

export const logoutAPI = async () => {
    const res = await api.post("/users/logout");
    return res.data;
};

export const currentUserAPI = async () => {
    const res = await api.get("/users/currentUser");
    return res.data;
};
