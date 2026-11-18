import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Movies from './pages/Movies';
import './App.css';

function App() {
  return (
    <div className="app">
      <Navbar />

      <div className="layout">
        <Sidebar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={
            <main className="content">
              <h2>Page not found</h2>
            </main>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default App;