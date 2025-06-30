"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { auth } from '../lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import Prompts from '../UI/Prompts'

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [])


  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };


  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Firebase + Next.js</h1>
      <div>
        Hey, How are you?
      </div>
      {user ? (
        <div className='text-white  mt-4 '>
          <p>Welcome back, {user?.email}</p>
          <button 
            onClick={handleSignOut}
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className='text-white mt-4'>
          <p>You are not signed in.</p>
          <div>If you haven&apos;t signed up yet, go to the <Link className='text-blue-500 underline' href="/auth/signup">signup page.</Link></div>
          <div>Already have an account? <Link className='text-blue-500 underline' href="/auth/login">Log In</Link></div>
        </div>
      )}
      {user ? (
        <Prompts />
      ) : 
      (
      <div className='bg-gray-700 p-4 rounded-lg mt-4'>
        <p className='text-white'>If you want to store your prompts here, please sign in.</p>
      </div>
      )
      }
    </main>
  )
}