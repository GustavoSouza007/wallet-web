import { LoginScreen, RegisterScreen, HomeScreen } from "../screens";

export const routesScreen = [
  {
    path: "/",
    element: <LoginScreen />,
  },
  {
    path: "/signup",
    element: <RegisterScreen />,
  },
  {
    path: "/home",
    element: <HomeScreen />,
  },
];
