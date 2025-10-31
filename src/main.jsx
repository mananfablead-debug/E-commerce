import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css'
import './index.css'
import App from './App.jsx'
import { store } from './App/Store.js';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import {Toaster} from "react-hot-toast";
import "leaflet/dist/leaflet.css";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster position="top-center" reverseOrder={false} />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
