import {CircleArrowLeft, Trophy} from "lucide-react";
import React from "react";
import {useGameSession} from "../App.jsx";

export const SessionSummaryScreen = () => {
    const { state, exitSession } = useGameSession();
    const { session } = state;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black p-4 animate-fade-in">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="space-y-2">
                    <Trophy size={64} className="mx-auto text-yellow-500 mb-4 animate-bounce" />
                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 tracking-tighter uppercase">
                        SESSÃO COMPLETA
                    </h1>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 grid grid-cols-2 gap-4">
                    <div className="col-span-2 bg-gray-800/50 p-4 rounded-xl">
                        <span className="block text-gray-500 text-xs font-mono uppercase">Pontuação Final</span>
                        <span className="block text-5xl font-bold text-white font-mono">{session.totalPoints.toLocaleString()}</span>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-xl">
                        <span className="block text-gray-500 text-xs font-mono uppercase">Acertos</span>
                        <span className="block text-2xl font-bold text-emerald-400 font-mono">{session.stats.correct}</span>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-xl">
                        <span className="block text-gray-500 text-xs font-mono uppercase">Erros</span>
                        <span className="block text-2xl font-bold text-red-400 font-mono">{session.stats.wrong}</span>
                    </div>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex justify-center items-center gap-2 cursor-pointer" onClick={() => exitSession()}>
                    <CircleArrowLeft className="text-gray-500" />
                    <span className="block text-gray-500 text-xs font-bold uppercase">Voltar</span>
                </div>
            </div>
        </div>
    );
};
