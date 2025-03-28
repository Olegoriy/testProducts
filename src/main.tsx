// main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import ProductPage from './pages/ProductsPage'
import ProductDetail from './pages/ProductDetail'
import CreateProduct from './pages/CreateProduct'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <ProductPage /> },
      { path: 'products', element: <ProductPage /> },
      { path: 'products/:id', element: <ProductDetail /> },
      { path: 'create-product', element: <CreateProduct /> },
      { path: '*', element: <ProductPage /> } 
    ]
  }
], {
  basename: '/testProducts' 
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)