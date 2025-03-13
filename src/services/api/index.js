import axios from "axios";
import { QueryClient } from "react-query";

export const apiProject = axios.create({
  baseURL: "https://mp-wallet-app-api.herokuapp.com",
});

export const queryClient = new QueryClient();
