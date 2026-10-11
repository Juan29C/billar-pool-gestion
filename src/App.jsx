import React from 'react';
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
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', backgroundColor: 'var(--bg-canvas)' }}>
      {/* Barra Lateral en Carbón Cálido (#2B2725) */}
      <Sidebar />

      {/* Área Principal de Trabajo */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <Topbar />
        <main style={{ flex: 1, overflowY: 'auto' }}>
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
