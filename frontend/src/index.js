import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Registration from './Registration';
import SignIn from './SignIn';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/regisztracio" element={<Registration />} />
        <Route path="/belepes" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);
