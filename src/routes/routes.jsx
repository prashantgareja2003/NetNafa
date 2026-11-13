import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { Portfolio } from '../pages/Portfolio/Portfolio';
import { LivePrices } from '../pages/LivePrices/LivePrices';
import { Transactions } from '../pages/Transactions/Transactions';
import { TaxCenter } from '../pages/TaxCenter/TaxCenter';
import { RuleBook } from '../pages/RuleBook/RuleBook';
import { IPOTracker } from '../pages/IPOTracker/IPOTracker';
import { Reports } from '../pages/Reports/Reports';
import { Settings } from '../pages/Settings/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'portfolio', element: <Portfolio /> },
      { path: 'live-prices', element: <LivePrices /> },
      { path: 'transactions', element: <Transactions /> },
      { path: 'tax-center', element: <TaxCenter /> },
      { path: 'rule-book', element: <RuleBook /> },
      { path: 'ipo-tracker', element: <IPOTracker /> },
      { path: 'reports', element: <Reports /> },
      { path: 'settings', element: <Settings /> },
      { path: '*', element: <Navigate to="/" replace /> }
    ]
  }
]);
