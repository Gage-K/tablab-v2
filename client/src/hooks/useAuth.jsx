import { useContext } from "react";
import AuthContext from "../context/authProvider";

export default function useAuth() {
  // intent is to take info from AuthProvider
  // helps us avoid having to import the context on any component that requires authorization
  // custom hook makes this easier and more streamlined
  return useContext(AuthContext);
}
