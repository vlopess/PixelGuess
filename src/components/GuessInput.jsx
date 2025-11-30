import React, {useState} from "react";
import {Play} from "lucide-react";

export const GuessInput = ({ onGuess, disabled }) => {
    const [input, setInput] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onGuess(input);
            setInput('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md mt-6 relative">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={disabled}
                placeholder="Decodifique..."
                className="w-full px-5 py-4 bg-gray-800 border-2 border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-lg font-mono"
            />
            <button
                type="submit"
                disabled={disabled || !input.trim()}
                className="absolute right-2 top-2 bottom-2 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 text-white rounded-full font-bold transition-colors"
            >
                <Play size={20} fill="currentColor" />
            </button>
        </form>
    );
};
