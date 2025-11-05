import { createRoot } from 'react-dom/client'
import './index.css'
import React from 'react'
import UtilsApp from './pages/UtilsApp.tsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import NotFound404 from './pages/NotFound.tsx'

const router = createBrowserRouter([
  { path: "/", element: <UtilsApp /> },
  // add more routes here later, e.g. { path: "/tools/uuid", element: <UtilsApp /> }
  { path: "*", element: <NotFound404 /> }, // fallback 404
])

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
