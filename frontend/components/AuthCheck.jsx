import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthCheck = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token'); 
    if (token) {
      router.push('/'); 
    }
  }, [router]); 

  return null; 
};

export default AuthCheck;