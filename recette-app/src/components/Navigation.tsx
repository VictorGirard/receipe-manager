import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, BookmarkIcon, UserIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const location = useLocation();
  useAuth(); // On garde l'appel pour maintenir la connexion

  const navigationItems = [
    { name: 'Accueil', href: '/', icon: HomeIcon },
    { name: 'Favoris', href: '/favoris', icon: BookmarkIcon },
    { name: 'Profil', href: '/profil', icon: UserIcon },
    { name: 'Paramètres', href: '/parametres', icon: Cog6ToothIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'text-amber-500'
                    : 'text-gray-500 dark:text-gray-100 hover:text-amber-500 dark:hover:text-amber-400'
                }`}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
} 