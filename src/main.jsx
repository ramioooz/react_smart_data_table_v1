import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import '@fontsource/inter';
import { TableDataContextProvider } from './context/TableDataContext.jsx';



ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <TableDataContextProvider>
      <App />
  </TableDataContextProvider>
  // {/* </React.StrictMode>, */}
)
