'use client';

import React, { useState } from 'react';
import { Download, Upload, Database, RefreshCw, AlertTriangle } from 'lucide-react';
import { db } from '@/lib/database';
import toast from 'react-hot-toast';

interface DatabaseAdminProps {
  onDataChange?: () => void;
}

export const DatabaseAdmin: React.FC<DatabaseAdminProps> = ({ onDataChange }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleExportDatabase = async () => {
    try {
      setIsExporting(true);
      const data = await db.exportData();
      
      // Create download link
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vertixhub-database-${new Date().toISOString().split('T')[0]}.db`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Database exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export database');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportDatabase = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      
      await db.importData(data);
      toast.success('Database imported successfully!');
      
      // Trigger data refresh
      if (onDataChange) {
        onDataChange();
      }
    } catch (error) {
      console.error('Import failed:', error);
      toast.error('Failed to import database. Make sure the file is a valid SQLite database.');
    } finally {
      setIsImporting(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleResetDatabase = async () => {
    if (!confirm('Are you sure you want to reset the database? This will delete ALL data and restore defaults.')) {
      return;
    }

    try {
      setIsResetting(true);
      await db.resetDatabase();
      toast.success('Database reset successfully!');
      
      // Trigger data refresh
      if (onDataChange) {
        onDataChange();
      }
    } catch (error) {
      console.error('Reset failed:', error);
      toast.error('Failed to reset database');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center mb-6">
        <Database className="w-6 h-6 text-blue-400 mr-3" />
        <h3 className="text-xl font-semibold text-white">Database Management</h3>
      </div>

      <div className="space-y-4">
        {/* Export Database */}
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
          <div>
            <h4 className="text-white font-medium">Export Database</h4>
            <p className="text-white/60 text-sm">Download a backup of your database</p>
          </div>
          <button
            onClick={handleExportDatabase}
            disabled={isExporting}
            className="flex items-center space-x-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-lg hover:bg-green-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Exporting...' : 'Export'}</span>
          </button>
        </div>

        {/* Import Database */}
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
          <div>
            <h4 className="text-white font-medium">Import Database</h4>
            <p className="text-white/60 text-sm">Restore from a database backup file</p>
          </div>
          <div className="relative">
            <input
              type="file"
              accept=".db,.sqlite,.sqlite3"
              onChange={handleImportDatabase}
              disabled={isImporting}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <button
              disabled={isImporting}
              className="flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4" />
              <span>{isImporting ? 'Importing...' : 'Import'}</span>
            </button>
          </div>
        </div>

        {/* Load from API */}
        <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
          <div>
            <h4 className="text-white font-medium">Load from APIs</h4>
            <p className="text-blue-300 text-sm">Load fresh PC parts data from external APIs</p>
          </div>
          <button
            onClick={() => db.loadProductsFromAPI().then(() => onDataChange?.())}
            className="flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Load API Data</span>
          </button>
        </div>

        {/* Reset Database */}
        <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-xl border border-red-500/20">
          <div>
            <h4 className="text-white font-medium">Reset Database</h4>
            <p className="text-red-300 text-sm">⚠️ This will delete all data and restore defaults</p>
          </div>
          <button
            onClick={handleResetDatabase}
            disabled={isResetting}
            className="flex items-center space-x-2 bg-red-500/20 text-red-300 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{isResetting ? 'Resetting...' : 'Reset'}</span>
          </button>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="mt-6 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-yellow-300 font-medium text-sm">Database Information</h4>
            <ul className="text-yellow-200/80 text-xs mt-2 space-y-1">
              <li>• Data is stored in browser using SQLite via sql.js</li>
              <li>• Export your data regularly to prevent loss</li>
              <li>• Import files must be valid SQLite databases</li>
              <li>• Reset will restore all products and admin user</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}; 