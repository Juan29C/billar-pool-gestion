import React, { useState, useEffect } from 'react';
import { BillarProvider, useBillar } from './context/BillarContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardView from './views/DashboardView';
import TablesView from './views/TablesView';
import POSView from './views/POSView';
import InventoryView from './views/InventoryView';
import CashRegisterView from './views/CashRegisterView';
import HistoryView from './views/HistoryView';
import ReportsView from './views/ReportsView';
import SettingsView from './views/SettingsView';
import PublicDisplayView from './views/PublicDisplayView';
import './styles/global.css';
import './styles/components.css';

function MainLayout() {
  const { currentView } = useBillar();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Prevenir scroll en el fondo cuando el menú móvil está desplegado
  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileSidebarOpen]);

  // Si está en la vista pública de pantalla (ej. TV o quiosco vertical), no mostramos la barra administrativa
  if (currentView === 'public') {
    return <PublicDisplayView />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'tables':
        return <TablesView />;
      case 'pos':
        return <POSView />;
      case 'inventory':
        return <InventoryView />;
      case 'cash':
        return <CashRegisterView />;
      case 'history':
        return <HistoryView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <TablesView />;
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100dvh',
      width: '100%',
      backgroundColor: 'var(--bg-canvas)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Backdrop para Drawer Móvil */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="sidebar-mobile-backdrop"
          aria-label="Cerrar menú"
        />
      )}

      {/* Barra Lateral (Adaptada con clase responsive e independiente) */}
      <div className={`sidebar-wrapper ${mobileSidebarOpen ? 'sidebar-mobile-open' : ''}`}>
        <Sidebar onNavClick={() => setMobileSidebarOpen(false)} />
      </div>

      {/* Área Principal de Trabajo con scroll propio e independiente */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minWidth: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}>
        <Topbar onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        <main style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BillarProvider>
      <MainLayout />
    </BillarProvider>
  );
}
