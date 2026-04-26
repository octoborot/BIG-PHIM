import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FavoriteProvider } from './context/FavoriteContext.jsx'

// Đã xóa chữ ReactDOM. ở đầu dòng này đi
createRoot(document.getElementById('root')).render(
  // <StrictMode>
    // 2. Bọc FavoriteProvider ra bên ngoài App
    <FavoriteProvider>
        <App />
    </FavoriteProvider>
  // </StrictMode>,
)