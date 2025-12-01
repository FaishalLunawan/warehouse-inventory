'use client';

import { useState } from 'react';
import {
  Package,
  BarChart3,
  Settings,
  PlusCircle,
  List,
  AlertTriangle,
  Tag,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'All Items', href: '/', icon: Package },
  { name: 'Add New Item', href: '/add', icon: PlusCircle },
  { name: 'Categories', href: '/categories', icon: Tag },
  { name: 'Low Stock', href: '/low-stock', icon: AlertTriangle },
  { name: 'Statistics', href: '/stats', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "bg-white border-r transition-all duration-300",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="p-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 mb-4"
        >
          <List className="h-5 w-5 text-gray-600" />
        </button>
        
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 flex-shrink-0",
                  isActive ? "text-primary-600" : "text-gray-400"
                )} />
                {!collapsed && (
                  <span className="ml-3 font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}