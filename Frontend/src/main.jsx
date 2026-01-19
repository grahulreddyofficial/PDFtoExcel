import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Header from './Header.jsx'
import QueryBox from './QueryBox.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header />
    <QueryBox />
  </StrictMode>,
)
