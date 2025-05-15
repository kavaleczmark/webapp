import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Registration from './Registration';
import SignIn from './SignIn';
import { AuthContextProvider } from './context/AuthContext';
import { useAuthContext } from './hooks/useAuthContext';
import Notes from './Notes.js';
import Error from './Error.js';

function App() {
  const PrivateRoute = ({ children }) => {
    const { user } = useAuthContext();
    if (!user) {
      return <Navigate to="/" />;
    }
    return children;
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/regisztracio" element={<Registration />} />
        <Route path="/" element={<SignIn />} />
        <Route path="/jegyzetek" element={<PrivateRoute><Notes /></PrivateRoute>} />
         <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider> 
    <App />
  </AuthContextProvider>
);
