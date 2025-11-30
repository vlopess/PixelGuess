import {SessionSummaryScreen} from "./SessionSummaryScreen.jsx";
import {SessionHUD} from "./SessionHUD.jsx";
import {PixelImage} from "./PixelImage.jsx";
import {Activity} from "lucide-react";
import {GuessInput} from "./GuessInput.jsx";
import {ActivityResultCard} from "./ActivityResultCard.jsx";
import React from "react";
import {PIXEL_FACTORS, useGameSession} from "../App.jsx";
import {CustomLoader} from "./Loader.jsx";

export const GameScreen = () => {
    const { state, submitGuess, nextStep } = useGameSession();
    const { game, session } = state;

    if (session.status === 'completed') return <SessionSummaryScreen />;
    //if (!game.currentItem) return <CustomLoader />;

    const isFinished = !!game.lastResult;
    const currentPixelFactor = PIXEL_FACTORS[game.currentLevelIndex];

    return (
        <div className="flex flex-col items-center w-full max-w-lg mx-auto py-2 animate-fade-in relative z-10">
            <SessionHUD />

            <div className="relative group w-full px-8 mt-4">
                <PixelImage
                    image={game.items[game.currentItemIndex]?.image}
                    pixelFactor={currentPixelFactor}
                    revealed={isFinished}
                />

            </div>

            <div className="w-full px-4 mt-6">
                {!isFinished && game.attempts.length > 0 && (
                    <div className="flex justify-center gap-2 mb-4">
                        {game.attempts.map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 bg-red-500 rounded-sm animate-bounce"></div>
                        ))}
                    </div>
                )}

                <GuessInput onGuess={submitGuess} disabled={isFinished} />
            </div>

            {isFinished && (
                <ActivityResultCard
                    result={game.lastResult}
                    item={game.items[game.currentItemIndex]}
                    onNext={() => nextStep()}
                />
            )}
        </div>
    );
};
