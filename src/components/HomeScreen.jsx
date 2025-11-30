import React, {useState} from "react";
import {BarChart2, ChevronRight, Film, Grid, Music, Trophy} from "lucide-react";
import {useGameSession} from "../App.jsx";
import {RankingScreen} from "./RankingScreen.jsx";

export const HomeScreen = () => {
    const { startSession } = useGameSession();



    return (
        <div className="flex flex-col h-full w-full animate-fade-in relative z-10 max-w-lg mx-auto pt-6 px-4 pb-4">

            {/* HEADER: User Profile Minimal */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">

                </div>
            </div>

            <div className="mb-10 text-left relative">
                <h1 className="text-5xl font-black text-white tracking-tighter leading-tight mb-2">
                    Pixel
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Guess</span>
                </h1>
                <Grid className="absolute top-0 right-0 text-gray-800/50 w-24 h-24 rotate-12 -z-10" />
            </div>

            <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Modos de Jogo</span>
                </div>

                <button
                    onClick={() => startSession('movie')}
                    className="w-full group relative overflow-hidden bg-gray-900/40 border border-gray-800 hover:border-indigo-500/50 rounded-2xl p-5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] text-left"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-center relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                <Film size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white group-hover:text-indigo-200 transition-colors">Filmes</h3>
                                <p className="text-xs text-gray-500 font-mono mt-0.5">Cinema</p>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center group-hover:bg-indigo-500 group-hover:border-indigo-500 group-hover:text-white transition-all">
                            <ChevronRight size={16} />
                        </div>
                    </div>
                </button>

                <button
                    onClick={() => startSession('album')}
                    className="w-full group relative overflow-hidden bg-gray-900/40 border border-gray-800 hover:border-pink-500/50 rounded-2xl p-5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)] text-left"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-center relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                                <Music size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white group-hover:text-pink-200 transition-colors">Álbuns</h3>
                                <p className="text-xs text-gray-500 font-mono mt-0.5">Música</p>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center group-hover:bg-pink-500 group-hover:border-pink-500 group-hover:text-white transition-all">
                            <ChevronRight size={16} />
                        </div>
                    </div>
                </button>
            </div>

        </div>
    );
};
