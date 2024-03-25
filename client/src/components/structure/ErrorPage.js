import React from 'react';
import ErrorPage from '../pages/Error/expiredPage';

const MyComponent = () => {
  // Example error message
  const errorMessage = 'Shortened URL has expired';

  return (
    <div>
      <h1 className="text-center mt-5">My Main Component</h1>
      {/* Use the ErrorPage component */}
      <ErrorPage errorMessage={errorMessage} />
    </div>
  );
};

export default MyComponent;
