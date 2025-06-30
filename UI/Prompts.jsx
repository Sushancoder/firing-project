"use client"

import React, { useEffect, useState } from 'react'
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const Prompts = () => {
    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Add prompt states
    const [prompt, setPrompt] = useState('');
    const [chatbot, setChatbot] = useState('');

    const [refreshTrigger, setRefreshTrigger] = useState(false); // Like snapshots

    // For updates:
    const [showUpdateButton, setShowUpdateButton] = useState(false);
    const [showAddButton, setShowAddButton] = useState(true);
    const [id, setId] = useState('');

    // Access the collection
    const promptsCollection = collection(db, 'prompts');

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                // Get the collection
                const promptsSnapshot = await getDocs(promptsCollection);

                // Get the data from the snapshot
                const promptsData = promptsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPrompts(promptsData);
                setLoading(false);

                console.log(promptsData);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchPrompts();
    }, [refreshTrigger]);

    const handleAddPrompt = async () => {
        try {
            // Adding the doc to the collection
            let DateAndTime = new Date().toLocaleString();
            await addDoc(promptsCollection, { prompt, chatbot, DateAndTime });
            alert('Prompt added successfully');
            setPrompt('');
            setChatbot('');
            setRefreshTrigger(prev => !prev);
        } catch (error) {
            console.error('Error adding prompt:', error);
            alert('Error adding prompt');
        }
    };

    const handleDeletePrompt = async (promptId) => {
        let dbDoc = doc(db, 'prompts', promptId);
        await deleteDoc(dbDoc);
        alert('Prompt deleted successfully');
        setRefreshTrigger(prev => !prev);
    };

    // Handling Updates
    const handleUpdatePrompt = async () => {
        let dbDoc = doc(db, 'prompts', id);
        await updateDoc(dbDoc, { prompt, chatbot});
        alert('Prompt updated successfully');
        setPrompt('');
        setChatbot('');
        setId('');
        setRefreshTrigger(prev => !prev);
        setShowUpdateButton(false);
        setShowAddButton(true);
    };

    // Handling values for update
    const handleUpdateValues = (id, prompt, chatbot) => {
        if (!showUpdateButton) {
            setShowUpdateButton(true);
            setShowAddButton(false);
            setPrompt(prompt);
            setChatbot(chatbot);
            setId(id);
        }
        else{
            setShowUpdateButton(false);
            setShowAddButton(true);
            setPrompt('');
            setChatbot('');
        }
    }


    return (
        <div className='mt-4 bg-gray-800 p-4 rounded-md'>
            <h2 className='text-2xl font-bold mb-4 text-white'>Prompts</h2>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error.message}</p>
            ) : (<>
                <div className="promptAdder flex flex-col gap-2">
                    <textarea className="bg-gray-700 border border-gray-600 p-2 rounded-md" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                    <select
                        name="chatbot"
                        id=""
                        value={chatbot}
                        onChange={(e) => setChatbot(e.target.value)}
                        className="bg-gray-700 border border-gray-600 p-2 rounded-md"
                    >
                        <option value="">Select Chatbot</option>
                        <option value="Claude">Claude</option>
                        <option value="ChatGPT">ChatGPT</option>
                        <option value="Gemini">Gemini</option>
                        <option value="Qwen">Qwen</option>
                        <option value="Mistral">Mistral</option>
                        <option value="Deepseek">Deepseek</option>
                        <option value="Meta AI">Meta AI</option>

                    </select>
                    {/* Can detect change in focus to show the warning. */}
                    <div className="warn">{((prompt.length === 0) || (chatbot.length === 0)) && <p className="text-red-500 text-sm">Prompt and Chatbot must be filled</p>}</div>
                    <button onClick={handleAddPrompt} className={showAddButton ? "bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" : "hidden"}>Add Prompt</button>
                    <button onClick={handleUpdatePrompt} className={showUpdateButton ? "bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded" : "hidden"}>Update Prompt</button>
                </div>

                <ul className='mt-4'>
                    <h2 className='text-xl font-bold mb-4 text-white'>Saved Prompts</h2>
                    {prompts.map(prompt => (
                        <li key={prompt.id} className='list-disc flex justify-between items-center border-2 rounded-md p-2 my-2'>
                            <div>
                                <p>{prompt.prompt}</p>
                                <p className='text-gray-400'>Chatbot: {prompt.chatbot}</p>
                            </div>
                            <div className='flex gap-2 w-1/4'>
                                <div className="updateButton w-1/2">
                                    <button onClick={() => handleUpdateValues(prompt.id, prompt.prompt, prompt.chatbot)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded text-sm w-full">Update</button>
                                </div>
                                <div className="deleteButton w-1/2">
                                    <button onClick={() => handleDeletePrompt(prompt.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-sm w-full">Delete</button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </>
            )}
        </div>
    )
}

export default Prompts
