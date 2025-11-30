import {RefreshCw, Zap} from "lucide-react";
import React from "react";

export const ActivityResultCard = ({ result, item, onNext }) => {
    const isWin = result.correct;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden">
                {isWin && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-indigo-500 to-emerald-400"></div>
                )}

                <div className="text-center mb-4">
                    <h2 className={`text-2xl font-black font-mono uppercase tracking-tighter ${isWin ? 'text-white' : 'text-red-500'}`}>
                        {isWin ? 'PARABÉNS!' : 'ERROU'}
                    </h2>
                </div>

                <div className="flex flex-col items-center mb-6">
                    <div className={`p-1 rounded-lg border-2 ${isWin ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-red-500'}`}>
                        <img src={item.image} alt={item.title} className="w-32 h-48 object-cover rounded" />
                    </div>
                    <h3 className="text-xl font-bold text-white mt-3 text-center">{item.title}</h3>
                    <p className="text-gray-400 text-sm font-mono">{item.artist || item.year}</p>
                </div>

                {isWin && (
                    <div className="space-y-2 bg-black/40 p-3 rounded-lg border border-gray-800 mb-6 text-xs">
                        <div className="flex justify-between items-center text-gray-300">
                            <span>Pontos Brutos</span>
                            <span className="font-mono">{Math.round(result.breakdown.base * result.breakdown.multiplier)}</span>
                        </div>
                        {result.breakdown.speed > 0 && (
                            <div className="flex justify-between items-center text-emerald-400">
                                <span className="flex items-center gap-1"><Zap size={10}/> Speed Bonus</span>
                                <span className="font-mono">+{result.breakdown.speed}</span>
                            </div>
                        )}
                        <div className="h-px bg-gray-700 my-1"></div>
                        <div className="flex justify-between items-center text-lg font-bold">
                            <span className="text-indigo-400">TOTAL</span>
                            <span className="text-white font-mono text-xl">+{result.pointsEarned}</span>
                        </div>
                    </div>
                )}

                <button
                    onClick={onNext}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold font-mono tracking-wider transition-all rounded-xl shadow-lg flex items-center justify-center gap-2 uppercase"
                >
                    <RefreshCw size={20} />
                    {isWin ? 'Próximo Nível' : 'Continuar'}
                </button>
            </div>
        </div>
    );
};
