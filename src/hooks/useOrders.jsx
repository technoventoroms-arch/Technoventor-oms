import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as api from '../api';
import { ORDER_STAGES } from '../constants';

export function useOrders(currentUser) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const lastNotifRef = useRef();

  const notifications = useMemo(() => {
    const allHistory = orders.flatMap(order => 
      (order.history || []).map(h => ({
        ...h,
        orderId: order.id
      }))
    );
    
    return allHistory
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map((h, idx) => ({
        id: h.id || `notif-${h.date}-${idx}`,
        type: 'info',
        message: (
          <span>
            <span className="font-mono text-emerald-400 font-bold">{h.orderId}</span>: {h.action}
            <span className="block text-[10px] text-slate-500 mt-0.5">by {h.by} ({h.department})</span>
          </span>
        ),
        date: h.date,
        read: true,
        raw: h
      }));
  }, [orders]);

  useEffect(() => {
    if (notifications.length > 0) {
      const newest = notifications[0];
      if (lastNotifRef.current && newest.raw.date !== lastNotifRef.current) {
        setToast({
          message: newest.message,
          type: 'info',
          label: 'New Activity Logged'
        });
      }
      lastNotifRef.current = newest.raw.date;
    }
  }, [notifications]);

  const loadData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const ordersData = await api.fetchOrders({ token });
      setOrders(ordersData);
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async (newOrderData) => {
    const newOrder = {
      ...newOrderData,
      createdDate: new Date().toISOString().split('T')[0],
      createdBy: currentUser.name,
      currentStage: ORDER_STAGES.NEW,
      history: [{
        date: new Date().toISOString(),
        action: 'Order Created',
        by: currentUser.name,
        department: currentUser.department
      }]
    };
    const createdOrder = await api.createOrder(newOrder);
    setOrders(prev => [createdOrder, ...prev]);
    return createdOrder;
  };

  const updateOrder = async (orderId, updatedData) => {
    const updatedOrder = await api.updateOrder(orderId, updatedData);
    setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
    return updatedOrder;
  };

  const deleteOrder = async (orderId) => {
    await api.deleteOrder(orderId);
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  return {
    orders,
    setOrders,
    isLoading,
    setIsLoading,
    notifications,
    toast,
    setToast,
    loadData,
    createOrder,
    updateOrder,
    deleteOrder
  };
}
