const SCORING_RULES = {
    baseScore: {
        alternatives: 10,
        written: 15,
        sorting: 20,
        simple_algorithm: 25,
        algorithm: 30
    },
    multipliers: {
        easy: 1.0,
        medium: 1.3,
        hard: 1.6
    },
    bonuses: {
        speed: 10,
        perfectSession: 50
    },
    penalties: {
        error: -5,
        timeout: -3,
        giveup: 0
    }
};

export const ScoringEngine = {
    calculate: ({ type, timeSpent, isCorrect, gaveUp, timedOut }) => {
        if (gaveUp) return { pointsEarned: 0, reason: 'giveup', correct: false };
        if (timedOut) return { pointsEarned: SCORING_RULES.penalties.timeout, reason: 'timeout', correct: false };
        if (!isCorrect) return { pointsEarned: 0, reason: 'error', correct: false };

        let base = SCORING_RULES.baseScore[type] || 15;
        let multiplier =  1.0;

        let grossPoints = base * multiplier;
        let speedBonus = (timeSpent <= 10) ? SCORING_RULES.bonuses.speed : 0;

        const totalPoints = Math.round(grossPoints + speedBonus);

        return {
            pointsEarned: totalPoints,
            correct: true,
            timeSpent,
            type,
            breakdown: { base, multiplier, speed: speedBonus }
        };
    }
};

