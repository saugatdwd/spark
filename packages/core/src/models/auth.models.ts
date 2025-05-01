import React from "react";
import { CurrentIdentity } from "./common.models";

export type AuthProviderProps = {
  children: React.ReactNode;
  storageKey: string;
  onLogin?: (identity: CurrentIdentity) => void;
  onLogout?: () => void;
};

export type AuthProviderState = {
  identity: null | CurrentIdentity;
  isAuthenticated: () => boolean;
  login: (identity: CurrentIdentity) => void;
  logout: () => void;
};
