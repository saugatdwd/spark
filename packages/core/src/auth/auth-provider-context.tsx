import { createContext } from "react";

import { AuthProviderState } from "../models";

const initialState: AuthProviderState = {
  identity: null,
  isAuthenticated: () => false,
  login: () => null,
  logout: () => null,
};

export const AuthProviderContext = createContext<AuthProviderState>(initialState);
