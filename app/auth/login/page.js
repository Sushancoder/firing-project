"use client"

import React, { useState } from 'react'
import { auth } from '@/lib/firebase'; // Linking to my app's auth
import { signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const LogIn = () => {
    const [email, setEmail] = useState('user@gmail.com');
    const [password, setPassword] = useState('password');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/');
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Login error:', errorCode, errorMessage);
            alert(`Login failed: ${errorMessage}`);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-black">
            <h1 className="text-4xl font-bold mb-4 text-white">Log In</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 bg-black rounded-md drop-shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] w-[300px]">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="p-2 bg-black border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white border-white" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="p-2 bg-black border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white border-white" />
                {password.length > 0 && password.length < 6 && <p className="text-red-500 text-sm">Password must be at least 6 characters long</p>}
                <button type="submit" className="bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded">Log In</button>
            </form>

            <div className="login text-gray-500">
                <div>Don&apos;t have an account yet? <Link className='text-blue-500 underline' href="/auth/signup">Sign Up</Link></div>
            </div>
        </div>
    )
}

export default LogIn
