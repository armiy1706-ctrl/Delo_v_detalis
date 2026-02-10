import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// Если ваш файл называется index.css и лежит в корне:
import './index.css' 
// Если файл все еще в папке styles, используйте: import './styles/globals.css'

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Не удалось найти элемент с id 'root'. Проверьте index.html!");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
