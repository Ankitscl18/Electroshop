// Check if we're running locally or deployed
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'  // Local development
    : 'https://your-render-backend-url.onrender.com';  // Production (replace with your actual Render URL)

console.log('🔧 Using API:', API_BASE_URL);