import React, { useEffect, useState } from 'react';
import { AuthData } from '../../auth/AuthWrapper';

export const Protected = () => {
  const { user } = AuthData();
  const [isAuthenticated, setIsAuthenticated] = useState(user.isAuthenticated);

  useEffect(() => {
    // Set isAuthenticated to true if user is logged in
    if (user.isAuthenticated) {
      setIsAuthenticated(true);
    } else {
      // Retrieve the stored user object from sessionStorage
      const storedUser = sessionStorage.getItem('user');
      // Parse the storedUser string to convert it back to an object
      const parsedUser = JSON.parse(storedUser);
      // Set isAuthenticated based on stored user data
      setIsAuthenticated(parsedUser.isAuthenticated);
    }
  }, [user.isAuthenticated]);

  return (
    <div className="protected">
      <h2>Protected page</h2>
      {/* Your protected page content here */}
    </div>
  );
};
