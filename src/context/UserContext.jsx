import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await fetch("https://api-pizza-h857.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), 
      });
      console.log({ email, password });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error en el login");
      }
  
      const data = await response.json();
      setToken(data.token); 
      setEmail(data.email); 
    } catch (error) {
      console.error("Error en el login", error);
      throw error;
    }
  };
  
  const register = async (email, password) => {
    try {
      const response = await fetch('https://api-pizza-h857.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        setEmail(data.email);
      } else {
        console.error('Error en el registro');
      }
    } catch (error) {
      console.error('Error al intentar registrar:', error);
    }
  };

  const logout = () => {
    setToken(null);
    setEmail(null);
    console.log('Sesión cerrada. Token y email eliminados.');
  };

  const getProfile = async () => {
    if (!token) {
      console.error('No hay token disponible para autenticar la solicitud');
      return;
    }

    try {
      const response = await fetch('https://api-pizza-h857.onrender.com/api/auth/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEmail(data.email);
        console.log('Perfil de usuario obtenido:', data);
      } else {
        console.error('Error al obtener el perfil del usuario');
      }
    } catch (error) {
      console.error('Error al obtener el perfil del usuario:', error);
    }
  };

  useEffect(() => {
    if (token) {
      getProfile();
    }
  }, [token]);

  return (
    <UserContext.Provider value={{ token, email, login, register, logout, getProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;