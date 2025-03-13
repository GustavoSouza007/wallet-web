import { apiProject } from "../../index";

export const registerCall = (data) => apiProject.post("/users", data);

export const loginCall = (email) => apiProject.get(`users?email=${email}`);
