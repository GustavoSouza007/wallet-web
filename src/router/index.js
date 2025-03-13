import { createBrowserRouter } from "react-router-dom";
import { routesScreen } from "../routes";

export const router = createBrowserRouter([...routesScreen], {
  future: {
    v7_relativeSplatPath: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
    v7_normalizeFormMethod: true,
    v7_fetcherPersist: true,
  },
});
