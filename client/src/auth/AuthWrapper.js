import { createContext, useContext, useState } from "react";
import axios from "axios";
import { RenderHeader } from "../components/structure/Header";
import { RenderMenu, RenderRoutes } from "../components/structure/RenderNavigation";

const AuthContext = createContext();
export const AuthData = () => useContext(AuthContext);

export const AuthWrapper = () => {
  const [user, setUser] = useState({ name: "", isAuthenticated: false });

  const login = async (email, password) => {
    try {
      const response = await axios.post("http://localhost:8000/api/login", { email, password });

      if (response.status === 200) {
        setUser({ name: email, isAuthenticated: true });
        return "success"; // Return success if login is successful
      } else if (response.status === 401) {
        throw new Error("Incorrect password"); // Throw error if password is incorrect
      } else if (response.status === 404) {
        throw new Error("User not found"); // Throw error if user is not found
      } else {
        throw new Error("Unexpected error occurred"); // Throw error for other unexpected errors
      }
    } catch (error) {
      throw error.response?.data?.error || "An error occurred";
    }
  };

  const logout = () => {
    setUser({ ...user, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <>
        <RenderHeader />
        <RenderMenu />
        <RenderRoutes />
      </>
    </AuthContext.Provider>
  );
};
