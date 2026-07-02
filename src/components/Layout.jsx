import { Outlet } from 'react-router-dom';
import Header from './Header';
import './Layout.css';

export default function Layout() {
  return (
    <>
      <Header />
      <main className="main" id="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <p>Marketstand — demo storefront built on the Fake Store API. Not a real shop.</p>
      </footer>
    </>
  );
}
