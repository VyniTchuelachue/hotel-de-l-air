import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import Layout from './components/Layout.jsx';
import { LanguageProvider } from './i18n/LanguageContext.jsx';
import './index.css';
import Booking from './pages/Booking.jsx';
import Contact from './pages/Contact.jsx';
import Experiences from './pages/Experiences.jsx';
import Home from './pages/Home.jsx';
import Hotel from './pages/Hotel.jsx';
import NotFound from './pages/NotFound.jsx';
import Restaurant from './pages/Restaurant.jsx';
import Rooms from './pages/Rooms.jsx';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/hotel', element: <Hotel /> },
      { path: '/chambres', element: <Rooms /> },
      { path: '/restaurant', element: <Restaurant /> },
      { path: '/experiences', element: <Experiences /> },
      { path: '/contact', element: <Contact /> },
      { path: '/reservation', element: <Booking /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  </StrictMode>,
);
