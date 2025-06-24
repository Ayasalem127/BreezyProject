'use client';

import { useContext, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthContext } from './AuthContext';

const PUBLIC_ROUTES = [ '/', '/connection', '/userCreation'];

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (user === null && !PUBLIC_ROUTES.includes(pathname)) {
      router.push('/'); // Redirige vers la page d'accueil si non connecté
    }
  }, [user, pathname]);

  // Pendant la redirection on n'affiche rien
  if (user === null && !PUBLIC_ROUTES.includes(pathname)) return null;

  return children;
};

export default ProtectedRoute;
