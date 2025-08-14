import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  // Check if it's an API error
  if (event.reason && event.reason.response) {
    const { status, data } = event.reason.response;
    
    // If it's an HTML response (like a 404 page), provide a better error message
    if (typeof data === 'string' && data.includes('<html')) {
      console.error('Received HTML error page instead of JSON');
      event.reason.message = 'Server returned an error page. Please check your API configuration.';
    }
  }
  
  // Prevent the default browser error handling
  event.preventDefault();
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
) 
