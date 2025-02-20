//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App.jsx';

import AuthProvider from "./context/AuthProvider.jsx";
import './index.css';

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <App />
    </AuthProvider>
);
