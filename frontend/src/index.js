import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Registration from './Registration';
import SignIn from './SignIn';
import { AuthContextProvider } from './context/AuthContext';
import { useAuthContext } from './hooks/useAuthContext';
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/regisztracio" element={<Registration />} />
        <Route path="/" element={<SignIn />} />
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
