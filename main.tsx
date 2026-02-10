import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'

const renderApp = () => {
  const container = document.getElementById('root');
  if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } else {
    console.error("Критическая ошибка: Элемент #root не найден в HTML!");
  }
};

// Запускаем, когда DOM готов
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}
