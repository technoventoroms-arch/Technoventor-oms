import React, { useState, useEffect } from 'react';
import { Menu, Bell } from 'lucide-react';
import { PERMISSIONS, ORDER_STAGES, DEPARTMENTS, MODULE_LABELS } from './constants';
import { formatDateTime } from './utils';
import * as api from './api';
import { usePermissions } from './hooks/usePermissions';
import { useOrders } from './hooks/useOrders';
import { LoginScreen } from './components/auth/LoginScreen';
import { NotificationPanel, AccessDenied, Toast } from './components/common';
import { Dashboard } from './components/dashboard/Dashboard';
import { OrdersList } from './components/orders/OrdersList';
import { CreateOrder } from './components/orders/CreateOrder';
import { OrderDetail } from './components/orders/OrderDetail';
import { DepartmentView } from './components/department/DepartmentView';
import { UserManagement } from './components/admin/UserManagement';
import { PermissionManagement } from './components/admin/PermissionManagement';
import { SettingsView } from './components/admin/SettingsView';
import { PlanningView } from './components/planning/PlanningView';
import { EditOrder } from './components/orders/EditOrder';
import { Sidebar } from './components/layout/Sidebar';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openOrderTab, setOpenOrderTab] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isEditingOrder, setIsEditingOrder] = useState(false);

  const {
    orders,
    setOrders,
    isLoading: isOrdersLoading,
    notifications,
    toast,
    setToast,
    loadData,
    createOrder,
    updateOrder,
    deleteOrder
  } = useOrders(currentUser);

  const { hasPermission } = usePermissions(currentUser);

  // Initialize App
  useEffect(() => {
    const initApp = async () => {
      setIsAuthLoading(true);
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const user = await api.getMe({ token });
          setCurrentUser(user);
          // Initial background load
          api.fetchUsers({ token }).then(setUsers).catch(console.error);
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setIsAuthLoading(false);
    };
    initApp();
  }, []);

  // Sync data when user loggs in or state resets
  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  // Real-time updates with SSE
  useEffect(() => {
    if (!currentUser) return;
    const eventSource = new EventSource('/api/events');
    eventSource.onmessage = (event) => {
      const { type } = JSON.parse(event.data);
      const token = localStorage.getItem('token');
      if (type === 'orders_updated') loadData();
      else if (type === 'users_updated') api.fetchUsers({ token }).then(setUsers);
    };
    return () => eventSource.close();
  }, [currentUser]);

  const handleLogin = async (email, password) => {
    try {
      const { user, token } = await api.loginUser(email, password);
      localStorage.setItem('token', token);
      setCurrentUser(user);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setView('dashboard');
    setSelectedOrder(null);
  };

  const handleUpdateOrder = async (updatedData) => {
    const updated = await updateOrder(selectedOrder.id, updatedData);
    setSelectedOrder(updated);
    setIsEditingOrder(false);
    setToast({ message: 'Order updated successfully!' });
  };

  const handleEscalateOrder = async (toStage, isDeescalation = false) => {
    const historyEntry = {
      date: new Date().toISOString(),
      action: isDeescalation ? `Sent back to ${toStage}` : `Escalated to ${toStage}`,
      by: currentUser.name,
      department: currentUser.department
    };
    
    const updatedData = {
      currentStage: toStage,
      history: [...selectedOrder.history, historyEntry]
    };

    if (isDeescalation) {
      const STAGES = Object.values(ORDER_STAGES);
      const toIndex = STAGES.indexOf(toStage);
      if (toIndex <= STAGES.indexOf(ORDER_STAGES.PROCUREMENT)) {
        updatedData.procurement = { ...selectedOrder.procurement, boqPurchases: (selectedOrder.procurement?.boqPurchases || []).map(p => ({ ...p, poDetails: { ...p.poDetails, poStatus: p.poDetails?.poStatus === 'Pending Approval' ? 'Draft' : p.poDetails?.poStatus } })) };
      }
      if (toIndex <= STAGES.indexOf(ORDER_STAGES.FINANCE)) {
        updatedData.finance = (selectedOrder.finance || []).map(f => ({ ...f, paymentStatus: f.paymentStatus === 'Completed' ? 'Pending' : f.paymentStatus }));
      }
      if (toIndex <= STAGES.indexOf(ORDER_STAGES.STORES_INWARD)) {
        updatedData.stores = { ...selectedOrder.stores, boqInwards: (selectedOrder.stores?.boqInwards || []).map(i => ({ ...i, inwardDate: '', receivedQuantity: '' })) };
      }
    }
    await handleUpdateOrder(updatedData);
  };

  const handleCreateOrder = async (data) => {
    const created = await createOrder(data);
    setSelectedOrder(created);
    setOpenOrderTab('planning');
    setView('orders');
    setToast({ message: 'Order placed successfully!' });
  };

  const renderContent = () => {
    if (selectedOrder && isEditingOrder) return <EditOrder order={selectedOrder} currentUser={currentUser} onSubmit={handleUpdateOrder} onCancel={() => setIsEditingOrder(false)} />;
    if (selectedOrder) return <OrderDetail order={selectedOrder} currentUser={currentUser} hasPermission={hasPermission} onUpdate={handleUpdateOrder} onEscalate={handleEscalateOrder} openTab={openOrderTab} onDelete={deleteOrder} onEdit={() => setIsEditingOrder(true)} onBack={() => { setSelectedOrder(null); setOpenOrderTab(null); setIsEditingOrder(false); }} />;

    switch (view) {
      case 'dashboard': return hasPermission(PERMISSIONS.VIEW_DASHBOARD) ? <Dashboard orders={orders} currentUser={currentUser} hasPermission={hasPermission} onSelectOrder={setSelectedOrder} /> : <AccessDenied />;
      case 'orders': return (hasPermission(PERMISSIONS.VIEW_ALL_ORDERS) || hasPermission(PERMISSIONS.VIEW_ASSIGNED_ORDERS)) ? <OrdersList orders={orders} currentUser={currentUser} hasPermission={hasPermission} onSelectOrder={setSelectedOrder} /> : <AccessDenied />;
      case 'create-order': return hasPermission(PERMISSIONS.CREATE_ORDER) ? <CreateOrder onSubmit={handleCreateOrder} onCancel={() => setView('orders')} /> : <AccessDenied />;
      case 'procurement': return hasPermission(PERMISSIONS.VIEW_PROCUREMENT) ? <DepartmentView department="procurement" orders={orders.filter(o => o.currentStage === ORDER_STAGES.PROCUREMENT)} pastOrders={orders.filter(o => o.currentStage !== ORDER_STAGES.PROCUREMENT && ((o.history || []).some(h => (h.department || '').toLowerCase().includes('procurement'))))} onSelectOrder={(o) => { setSelectedOrder(o); setOpenOrderTab('procurement'); }} onSelectOrderWithPlanning={(o) => { setSelectedOrder(o); setOpenOrderTab('planning'); }} currentUser={currentUser} hasPermission={hasPermission} /> : <AccessDenied />;
      case 'finance': return hasPermission(PERMISSIONS.VIEW_FINANCE) ? <DepartmentView department="finance" orders={orders.filter(o => o.currentStage === ORDER_STAGES.FINANCE || (o.procurement?.boqPurchases || []).some(p => p.poDetails?.poStatus === 'Pending Approval' && !(o.finance || []).some(f => f.poNumber === p.poDetails?.poNumber && f.paymentStatus === 'Completed')))} pastOrders={orders.filter(o => (o.history || []).some(h => (h.department || '').toLowerCase().includes('finance')))} onSelectOrder={(o) => { setSelectedOrder(o); setOpenOrderTab(currentUser.department === 'finance' ? 'payments' : 'finance'); }} onSelectOrderWithPlanning={(o) => { setSelectedOrder(o); setOpenOrderTab('planning'); }} currentUser={currentUser} hasPermission={hasPermission} /> : <AccessDenied />;
      case 'stores': return hasPermission(PERMISSIONS.VIEW_STORES) ? <DepartmentView department="stores" orders={orders.filter(o => o.currentStage === ORDER_STAGES.STORES || o.currentStage === ORDER_STAGES.STORES_INWARD || (o.finance || []).some(f => f.paymentStatus === 'Completed'))} pastOrders={orders.filter(o => (o.history || []).some(h => (h.department || '').toLowerCase().includes('store')))} onSelectOrder={(o) => { setSelectedOrder(o); setOpenOrderTab(o.currentStage === ORDER_STAGES.STORES ? 'inventory' : 'stores'); }} onSelectOrderWithPlanning={(o) => { setSelectedOrder(o); setOpenOrderTab('planning'); }} currentUser={currentUser} hasPermission={hasPermission} /> : <AccessDenied />;
      case 'dispatch': return hasPermission(PERMISSIONS.VIEW_DISPATCH) ? <DepartmentView department="dispatch" orders={orders.filter(o => o.currentStage === ORDER_STAGES.DISPATCH)} pastOrders={orders.filter(o => (o.history || []).some(h => (h.department || '').toLowerCase().includes('dispatch')))} onSelectOrder={(o) => { setSelectedOrder(o); setOpenOrderTab('dispatch'); }} onSelectOrderWithPlanning={(o) => { setSelectedOrder(o); setOpenOrderTab('planning'); }} currentUser={currentUser} hasPermission={hasPermission} /> : <AccessDenied />;
      case 'planning': return hasPermission(PERMISSIONS.VIEW_PLANNING) ? <PlanningView orders={orders} onSelectOrder={(o) => { setSelectedOrder(o); setOpenOrderTab('planning'); }} currentUser={currentUser} hasPermission={hasPermission} /> : <AccessDenied />;
      case 'users': return hasPermission(PERMISSIONS.MANAGE_USERS) ? <UserManagement users={users} onAddUser={api.createUser} onUpdateUser={api.updateUser} onDeleteUser={api.deleteUser} currentUser={currentUser} hasPermission={hasPermission} /> : <AccessDenied />;
      case 'permissions': return hasPermission(PERMISSIONS.MANAGE_PERMISSIONS) ? <PermissionManagement users={users} currentUser={currentUser} onUpdateUser={api.updateUser} /> : <AccessDenied />;
      case 'settings': return hasPermission(PERMISSIONS.VIEW_SETTINGS) ? <SettingsView currentUser={currentUser} onUpdateUser={api.updateUser} hasPermission={hasPermission} /> : <AccessDenied />;
      default: return <Dashboard orders={orders} currentUser={currentUser} hasPermission={hasPermission} onSelectOrder={setSelectedOrder} />;
    }
  };

  if (isAuthLoading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center"><div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!currentUser) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-emerald-500/30">
      <div className="flex h-screen overflow-hidden">
        <Sidebar isSidebarOpen={isSidebarOpen} view={view} setView={setView} setSelectedOrder={setSelectedOrder} currentUser={currentUser} hasPermission={hasPermission} PERMISSIONS={PERMISSIONS} handleLogout={handleLogout} />
        <main className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-[#020617]">
          <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/30 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400"><Menu className="w-5 h-5" /></button>
              <h1 className="text-lg font-bold text-white uppercase tracking-widest">{MODULE_LABELS[view] || 'Overview'}</h1>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 relative"><Bell className="w-5 h-5" /><span className="absolute top-2 right-2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#020617] text-[10px] flex items-center justify-center font-bold text-white">{notifications.length}</span></button>
                {showNotifications && <NotificationPanel notifications={notifications} onClose={() => setShowNotifications(false)} />}
              </div>
              <div className="flex items-center gap-3 px-4 py-1.5 bg-slate-800/40 border border-slate-700/50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-xs font-bold text-white">{(currentUser?.name || '').split(' ').filter(Boolean).map(n => n[0]).join('')}</div>
                <div className="hidden md:block"><p className="text-sm font-bold text-white leading-none">{currentUser?.name}</p><p className="text-[10px] text-slate-500 font-medium uppercase mt-0.5">{currentUser?.department}</p></div>
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto animate-in fade-in duration-500 ease-out">{renderContent()}</div>
          </div>
        </main>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} label={toast.label} onClose={() => setToast(null)} />}
    </div>
  );
}

export default App;
