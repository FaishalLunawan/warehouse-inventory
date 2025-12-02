import { Warehouse } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Warehouse className="h-8 w-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Warehouse Manager</h1>
              <p className="text-sm text-gray-500">Inventory Management System</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Welcome, Faishal Lunawan</p>
              <p className="text-xs text-gray-500">Warehouse Manager</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-800 font-semibold">A</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}