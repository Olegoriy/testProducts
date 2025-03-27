import { Link, Outlet } from 'react-router-dom';
import './app.scss';

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <nav className="app-nav">
          <Link to="/products" className="app-logo">
            Products App
          </Link>
        </nav>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}