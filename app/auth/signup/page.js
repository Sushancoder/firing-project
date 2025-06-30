"use client"

import React, { useState } from 'react'
import { auth, githubAuthProvider } from '@/lib/firebase'; // Linking to my app's auth
import { createUserWithEmailAndPassword, signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');   
    const router = useRouter();

    const handleGithubAuth = async () => {
        try {
            const result = await signInWithPopup(auth, githubAuthProvider);
            // This gives you a GitHub Access Token. You can use it to access the GitHub API.
            // const credential = GithubAuthProvider.credentialFromResult(result);
            // const token = credential.accessToken;
            
            // The signed-in user info
            const user = result.user;
            
            // Redirect to home page after successful sign-in
            router.push('/');

        } catch (error) {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData?.email;
            // The AuthCredential type that was used.
            const credential = GithubAuthProvider.credentialFromError(error);
            
            console.error('GitHub sign-in error:', { errorCode, errorMessage, email });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                router.push('/');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            })

    }
return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
        <h1 className="text-4xl font-bold mb-4 text-white">Sign Up</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 bg-black rounded-md drop-shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] w-[300px]">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="p-2 bg-black border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white border-white" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="p-2 bg-black border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white border-white" /> 
            {password.length > 0 && password.length < 6 && <p className="text-red-500 text-sm">Password must be at least 6 characters long</p>}
            <button type="submit" className="bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded">Sign Up</button>
        </form>
        <button onClick={handleGithubAuth} className="bg-white hover:bg-gray-100 mt-4 text-black font-bold py-2 px-4 rounded">Sign Up with Github</button>

        <div className="login text-gray-500">
            <div>Already have an account? <Link className='text-blue-500 underline' href="/auth/login">Log In</Link></div>
        </div>
    </div>
)
}

export default SignUp
