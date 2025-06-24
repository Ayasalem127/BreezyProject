'use client';

import { useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AuthContext } from './AuthContext';

const REDIRECT_ROUTES = ['/','/connection', '/userCreation'];

const RedirectIfAuthenticated = ({ children }) => {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user && REDIRECT_ROUTES.includes(pathname)) {
      router.push('/myProfile'); // redirection si déjà connecté
    }
  }, [user, pathname]);

  return children;
};

export default RedirectIfAuthenticated;
