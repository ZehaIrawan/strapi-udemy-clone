"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import axios from 'axios';
import AuthCheck from '@/components/AuthCheck';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();


  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:1337/api/auth/local/register', {
        username: username,
        email: email,
        password: password,
      });

      const { jwt, user } = response.data;

      localStorage.setItem('token', jwt);
      localStorage.setItem('user', JSON.stringify(user));

      setSuccess('Registration successful! You can now log in.');
      setError('');
      setUsername('');
      setEmail('');
      setPassword('');
      router.push('/');

    } catch (error) {
      console.error('Registration failed:', error);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <AuthCheck/>
      <Card className="w-full max-w-md p-8">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create a new account by filling in the information below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
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
            {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
            <Button type="submit" className="w-full bg-blue-500 text-white">
              Register
            </Button>
          </form>
          <Link className="text-blue-500 hover:underline mt-4 block" href="/login">Already have an account? Login</Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;