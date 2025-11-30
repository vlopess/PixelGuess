import {Activity, Zap} from "lucide-react";
import React from "react";
import {GAMES_PER_SESSION, useGameSession} from "../App.jsx";

export const SessionHUD = () => {
    const { state } = useGameSession();
    const { session } = state;
    const progress = (session.activities.length / GAMES_PER_SESSION) * 100;

    return (
        <div className="w-full max-w-lg mb-4 space-y-2">
            <div className="flex items-center justify-between bg-gray-900/90 p-3 rounded-xl border border-gray-800 backdrop-blur-md shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Score</span>
                        <span className="text-xl font-bold text-indigo-400 font-mono leading-none">
                          {session.totalPoints.toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="h-8 w-[1px] bg-gray-800 mx-2"></div>

                <div className="h-8 w-[1px] bg-gray-800 mx-2"></div>

                <div className="flex items-center gap-2">
                    <Activity size={16} className="text-emerald-500" />
                    <div className="flex flex-col text-right">
                        <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">Progresso</span>
                        <span className="text-xs font-bold text-white font-mono uppercase">
               {session.activities.length}/{GAMES_PER_SESSION}
             </span>
                    </div>
                </div>
            </div>
            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
};
