'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hook';
import { getUser } from '../../redux/slices/auth/authThunks';
import { useRouter, usePathname } from 'next/navigation';

const PUBLIC_ROUTES = ['/login'];

export default function AuthChecker({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { loading, isAuthenticated } = useAppSelector((state) => state.auth);

  const isPublic = PUBLIC_ROUTES.includes(pathname);

  // Fetch user only on protected routes
  useEffect(() => {
    if (!isPublic) {
      dispatch(getUser());
    }
  }, [dispatch, isPublic]);

  // Redirect if not authenticated on protected routes
  useEffect(() => {
    if (!isPublic && !loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, isPublic, router]);

  // Show loader only on protected routes while loading
  if (!isPublic && (loading || !isAuthenticated)) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p>Loading...</p>
      </div>
    );
  }

  // Render normally on public routes or if authenticated
  return children;
}
