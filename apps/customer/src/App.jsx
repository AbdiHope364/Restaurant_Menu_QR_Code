import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SettingsProvider } from '@ethio-buna/shared';

import ScanQR from './pages/customer/ScanQR';
import CustomerMenu from './pages/customer/CustomerMenu';

function App() {
  return (
    <SettingsProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          className: 'font-bold text-xs shadow-xl rounded-2xl border border-slate-100',
          duration: 3000,
        }}
      />
      <Router>
        <Routes>
          <Route path="/" element={<ScanQR />} />
          <Route path="/menu/qr/:shortId" element={<CustomerMenu />} />
          <Route path="/menu" element={<CustomerMenu />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </SettingsProvider>
  );
}

export default App;
