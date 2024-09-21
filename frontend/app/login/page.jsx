"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import axios from 'axios'; 
import Link from 'next/link';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:1337/api/auth/local', {
        identifier: email,
        password: password,
      });

      const { jwt, user } = response.data;

      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify(user));

      router.push('/');

    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-md p-8">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <Button type="submit" className="w-full bg-blue-500 text-white">
              Login
            </Button>
          </form>
          <Link className="text-blue-500 hover:underline mt-4 block" href="/register">Don't have an account? Register</Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
