
import { createContext, useContext } from 'react';

export const AuthContext = createContext({
  user: null,
  profileName: '',
  signOutUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);
