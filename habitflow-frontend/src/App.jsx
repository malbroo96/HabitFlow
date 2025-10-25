// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Home from './pages/Home';
import TrackProgress from './pages/TrackProgress';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/track-progress" element={<TrackProgress />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;