import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// 👉 Add font loading class immediately
document.documentElement.classList.add("font-loading")

// 👉 Wait for fonts to be ready before showing content
document.fonts.ready.then(() => {
  document.documentElement.classList.remove("font-loading")
  document.documentElement.classList.add("font-ready")
})

// Optionally: delay rendering app until fonts are ready
// Only do this if font delay is short and splash screen matters
// document.fonts.ready.then(() => {
//   createRoot(document.getElementById('root')).render(
//     <StrictMode>
//       <App />
//     </StrictMode>,
//   )
// })

// 👇 OR render app immediately if you're using CSS to hide it until font loads
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
