import { LoginScreen, RegisterScreen } from "../screens";

export const routesScreen = [
  {
    path: "/",
    element: <LoginScreen />,
  },
  {
    path: "/signup",
    element: <RegisterScreen />,
  },
];
