import React, { useState } from 'react';
import { Package, Plus, LayoutDashboard, Building2, ClipboardList, CreditCard, Warehouse, Truck, Users, Settings, LogOut } from 'lucide-react';

export function Sidebar({ 
  isSidebarOpen, 
  view, 
  setView, 
  setSelectedOrder, 
  currentUser, 
  hasPermission, 
  PERMISSIONS, 
  handleLogout 
}) {
  const NavItem = ({ icon, label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        active 
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 dark:shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
          : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary'
      }`}
    >
      <span className={`${active ? 'text-emerald-600 dark:text-emerald-400' : 'text-text-muted group-hover:text-text-secondary'} transition-colors`}>
        {React.cloneElement(icon, { size: 20 })}
      </span>
      <span className="text-sm font-semibold tracking-wide">{label}</span>
    </button>
  );

  return (
    <aside className={`${isSidebarOpen ? 'w-72' : 'w-0'} bg-white dark:bg-slate-900/50 border-r border-border transition-all duration-300 flex flex-col overflow-hidden shadow-lg dark:shadow-2xl z-20`}>
      <div className="p-8 pb-4 flex items-center gap-4">
        <div className="w-12 h-12 shadow-lg shadow-emerald-500/10 transition-transform hover:scale-105 active:scale-95 cursor-pointer">
          <img src="/logo.jpg" alt="OMS Logo" className="w-full h-full object-contain rounded-xl" />
        </div>
        <div>
          <h1 className="text-xl font-black text-text-primary tracking-tighter">TECHNOVENTOR</h1>
          <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-[0.2em] opacity-80">{currentUser?.department}</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto pt-6 custom-scrollbar">
        <NavItem 
          icon={<LayoutDashboard />} 
          label="Dashboard" 
          active={view === 'dashboard'} 
          onClick={() => { setView('dashboard'); setSelectedOrder(null); }} 
        />
        <NavItem 
          icon={<Package />} 
          label="All Orders" 
          active={view === 'orders'} 
          onClick={() => { setView('orders'); setSelectedOrder(null); }} 
        />

        {hasPermission(PERMISSIONS.CREATE_ORDER) && (
          <NavItem 
            icon={<Plus />} 
            label="Create Order" 
            active={view === 'create-order'} 
            onClick={() => { setView('create-order'); setSelectedOrder(null); }} 
          />
        )}

        <div className="pt-8 pb-3 px-4">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em]">Departments</p>
        </div>

        {hasPermission(PERMISSIONS.VIEW_PROCUREMENT) && (
          <NavItem icon={<Building2 />} label="Procurement" active={view === 'procurement'} onClick={() => { setView('procurement'); setSelectedOrder(null); }} />
        )}
        {hasPermission(PERMISSIONS.VIEW_PLANNING) && (
          <NavItem icon={<ClipboardList />} label="Planning" active={view === 'planning'} onClick={() => { setView('planning'); setSelectedOrder(null); }} />
        )}
        {hasPermission(PERMISSIONS.VIEW_FINANCE) && (
          <NavItem icon={<CreditCard />} label="Finance" active={view === 'finance'} onClick={() => { setView('finance'); setSelectedOrder(null); }} />
        )}
        {hasPermission(PERMISSIONS.VIEW_STORES) && (
          <NavItem icon={<Warehouse />} label="Stores/Inward" active={view === 'stores'} onClick={() => { setView('stores'); setSelectedOrder(null); }} />
        )}
        {hasPermission(PERMISSIONS.VIEW_DISPATCH) && (
          <NavItem icon={<Truck />} label="Dispatch" active={view === 'dispatch'} onClick={() => { setView('dispatch'); setSelectedOrder(null); }} />
        )}

        {(hasPermission(PERMISSIONS.MANAGE_USERS) || hasPermission(PERMISSIONS.MANAGE_PERMISSIONS)) && (
          <>
            <div className="pt-8 pb-3 px-4">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em]">Management</p>
            </div>
            {hasPermission(PERMISSIONS.MANAGE_USERS) && (
              <NavItem icon={<Users />} label="Users" active={view === 'users'} onClick={() => { setView('users'); setSelectedOrder(null); }} />
            )}
            {hasPermission(PERMISSIONS.MANAGE_PERMISSIONS) && (
              <NavItem icon={<Settings />} label="Permissions" active={view === 'permissions'} onClick={() => { setView('permissions'); setSelectedOrder(null); }} />
            )}
          </>
        )}
      </nav>

      <div className="p-4 bg-surface-raised border-t border-border space-y-2">
        <button 
          onClick={() => setView('settings')} 
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            view === 'settings' 
              ? 'bg-surface-raised text-text-primary shadow-md border border-border' 
              : 'text-text-secondary hover:text-text-primary hover:bg-surface-raised'
          }`}
        >
          <Settings size={20} />
          <span className="text-sm font-semibold tracking-wide">Settings</span>
        </button>
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-secondary hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-all duration-200 group"
        >
          <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-semibold tracking-wide">Logout</span>
        </button>
      </div>
    </aside>
  );
}
