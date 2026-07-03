import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import './AppLayout.css';

export default function AppLayout() {
  return (
    <div className="app-layout">
      <Header />

      <main className="main" id="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>QuickCart — demo store, cart saved in your browser.</p>
      </footer>
    </div>
  );
}
