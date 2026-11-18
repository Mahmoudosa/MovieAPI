
import { Routes, Route } from 'react-router-dom';

import UserLayout from './layouts/UserLayout';

import Home from './pages/user/Home';
import Movies from './pages/user/Movies';
import Watchlist from './pages/user/Watchlist';
import MyReviews from './pages/user/MyReviews';
import Profile from './pages/user/Profile';
import MovieDetails from './pages/user/MovieDetails';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageMovies from './pages/admin/ManageMovies';
import ManageCategories from './pages/admin/ManageCategories';
import ManageUsers from './pages/admin/ManageUsers';
import ModerateReviews from './pages/admin/ModerateReviews';
import AuthorLayout from './layouts/AuthorLayout';
import AuthorDashboard from './pages/author/AuthorDashboard';
import MyArticles from './pages/author/MyArticles';
import CreateArticle from './pages/author/CreateArticle';
import EditArticle from './pages/author/EditArticle';
import AuthorProfile from './pages/author/AuthorProfile';

import Login from './pages/Login';
import Register from './pages/Register';
import { AppDataProvider } from './context/AppDataContext';
import { mockMovies } from './data/mockMovies';

import './App.css';

function App() {
  return (
    <AppDataProvider movies={mockMovies}>
      <Routes>
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/my-reviews" element={<MyReviews />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="movies" element={<ManageMovies />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="reviews" element={<ModerateReviews />} />
        </Route>

        <Route path="/author" element={<AuthorLayout />}>
          <Route index element={<AuthorDashboard />} />
          <Route path="articles" element={<MyArticles />} />
          <Route path="articles/new" element={<CreateArticle />} />
          <Route path="articles/:id/edit" element={<EditArticle />} />
          <Route path="profile" element={<AuthorProfile />} />
        </Route>

        <Route
          path="/login"
          element={
            <div className="app">
              <Login />
            </div>
          }
        />

        <Route
          path="/register"
          element={
            <div className="app">
              <Register />
            </div>
          }
        />

        <Route
          path="*"
          element={
            <main className="content">
              <h1>404 — Page Not Found</h1>
            </main>
          }
        />
      </Routes>
    </AppDataProvider>
  );
}

export default App;
