'use client';

import { useContext, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthContext } from './AuthContext';

// Routes publiques accessibles sans connexion
const PUBLIC_ROUTES = ['/home', '/connection', '/userCreation'];

// Routes protégées par rôle spécifique
const ROLE_PROTECTED_ROUTES = {
  '/suspend': ['moderator', 'admin'],
  // tu peux ajouter d'autres routes ici si besoin
};

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const pathname = usePathname();
  const router = useRouter();

  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const requiredRoles = ROLE_PROTECTED_ROUTES[pathname];

  useEffect(() => {
    // Si l'utilisateur n'est pas connecté et la page n'est pas publique → redirection
    if (!user && !isPublic) {
      router.push('/home');
    }

    // Si la page est protégée par rôle et l'utilisateur n'a pas le bon rôle
    if (user && requiredRoles && !requiredRoles.includes(user.role)) {
      router.push('/home'); // ou afficher une 403 si tu veux
    }
  }, [user, pathname]);

  // Pendant le chargement, éviter le clignotement
  if (!user && !isPublic) return null;

  return children;
};

export default ProtectedRoute;
