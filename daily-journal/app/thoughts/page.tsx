"use client";
import { useState, useEffect } from "react";

type Thought = {
    text: string;
    time: string;
    competencies: number[];
};

type Competency = {
    id: number;
    skill: string;
    description: string;
};

type EntryFromDB = {
    id: number;
    text: string;
    createdAt: string;
    competencies: number[];
}

// A page.tsx file is just a React component similar to DailyThought.tsx
// The difference is it is stored within a directory and the path to that directory will load the component
// In this case, the path is /thoughts
export default function Thoughts() {
    const [thoughts, setThoughts] = useState<Thought[]>([]);
    const [competencies, setCompetencies] = useState<Competency[]>([]);
    const [target, setTarget] = useState<number>(0);
    
    // Delete the entry
    const deleteEntry = () => {
        console.log("del");
        const newThoughts = thoughts
        newThoughts.splice(target, 1);
        setThoughts(newThoughts);
    };

    // Load thoughts from the database using our GET route
    useEffect(() => {
        async function loadThoughts() {
            const res = await fetch("/api/entry");
            
            if (!res.ok) return;
            const data: EntryFromDB[] = await res.json();
            
            // Transform the response into a Thought
            const formatted: Thought[] = data.map((row) => (
                {
                    text: row.text,
                    time: new Date(row.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    competencies: row.competencies,
                }
            ));
            setThoughts(formatted);
        }
        loadThoughts();
    }, []);

    useEffect(() => {
        async function fetchCompetencies() {
            const res = await fetch("/api/competencies");
            const data = await res.json();
            setCompetencies(data);
        }
        fetchCompetencies();
    }, []);

    return (
        <div className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-md mt-5">
            <h2 className="text-2xl font-bold mb-4 text-[#ff0000]">All My Thoughts</h2>
            <div className="space-y-4">
                    {thoughts.length === 0 ? (<p className="italic text-center">No thoughts yet. Start typing!</p>) : (
                        thoughts.map((thought, index) => (
                            <div 
                                key={index}
                                className="bg-white/20 p-3 rounded-lg shadow-sm">
                                <div className="flex justify-between">
                                    <p className="text-lg text-gray-600">{thought.text}</p>
                                    <div className="flex">
                                        <button 
                                            className="bg-gray-100 text-green-500 border-green-500 border-2 rounded-md font-semibold hover:bg-[#000000] transition-colors cursor-pointer"
                                            >
                                            Edit
                                        </button>
                                        <button 
                                            className="bg-gray-100 text-[#ff0000] border-red-500 border-2 rounded-md font-semibold hover:bg-[#000000] transition-colors cursor-pointer"
                                            onClick={() => {setTarget(index); deleteEntry;}}
                                            >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm opacity-80 mt-1 text-gray-600">{thought.time}</p>
                                {thought.competencies.length > 0 && (
                                <p className="text-sm mt-1 text-gray-600">
                                    <strong>Competencies: </strong>
                                    {thought.competencies.map((id) =>
                                        competencies.find((c) => c.id === id)?.skill || `#${id}`).join(", ")
                                    }
                                </p>
                            )}      
                            </div>
                        ))
                    )}
                </div>
        </div>
    );
}