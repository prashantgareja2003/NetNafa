import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showSuccess = useCallback((msg) => addToast(msg, 'success'), [addToast]);
  const showError = useCallback((msg) => addToast(msg, 'error', 6000), [addToast]);
  const showWarning = useCallback((msg) => addToast(msg, 'warning', 5000), [addToast]);
  const showInfo = useCallback((msg) => addToast(msg, 'info'), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, showSuccess, showError, showWarning, showInfo }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '420px',
        width: 'calc(100% - 48px)',
        pointerEvents: 'none'
      }}>
        {toasts.map((toast) => {
          const typeConfig = {
            success: {
              icon: <CheckCircle size={18} color="#16845B" />,
              bg: '#FFFFFF',
              border: '#16845B',
              borderLeft: '4px solid #16845B'
            },
            error: {
              icon: <AlertCircle size={18} color="#D94A52" />,
              bg: '#FFFFFF',
              border: '#D94A52',
              borderLeft: '4px solid #D94A52'
            },
            warning: {
              icon: <AlertTriangle size={18} color="#C05621" />,
              bg: '#FFFFFF',
              border: '#C05621',
              borderLeft: '4px solid #C05621'
            },
            info: {
              icon: <Info size={18} color="#0056D2" />,
              bg: '#FFFFFF',
              border: '#0056D2',
              borderLeft: '4px solid #0056D2'
            }
          }[toast.type] || {
            icon: <Info size={18} color="#0056D2" />,
            bg: '#FFFFFF',
            border: '#0056D2',
            borderLeft: '4px solid #0056D2'
          };

          return (
            <div
              key={toast.id}
              style={{
                pointerEvents: 'auto',
                background: typeConfig.bg,
                border: '1px solid #EAE5E4',
                borderLeft: typeConfig.borderLeft,
                borderRadius: '8px',
                padding: '12px 16px',
                boxShadow: '0 6px 18px rgba(39, 35, 38, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                animation: 'slideIn 0.25s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {typeConfig.icon}
                <span style={{ fontSize: '13.5px', color: '#272326', fontWeight: 500 }}>
                  {toast.message}
                </span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#777078',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
