import React, {useContext, useEffect, useReducer} from 'react';
import './App.css'
import {HomeScreen} from "./components/HomeScreen.jsx";
import {GameScreen} from "./components/GameScreen.jsx";
import {useMovies} from "./hooks/useMovies.jsx";
import {ScoringEngine} from "./services/Engine/ScoringEngine.js";
import {RankingEngine} from "./services/Engine/RankingEngine.js";
import {useMusic} from "./hooks/useMusic.jsx";

export const PIXEL_FACTORS = [40, 25, 15, 10, 5, 1];
export const MAX_ATTEMPTS = 5;
export const GAMES_PER_SESSION = 6;





const MOCK_DB = {
  albums: [
    { id: 201, title: "Abbey Road", image: "https://i.scdn.co/image/ab67616d0000b273dc30583ba717007b00cceb25", year: "1969", artist: "The Beatles", difficulty: "easy", type: "written" },
    { id: 202, title: "Dark Side of the Moon", image: "https://i.scdn.co/image/ab67616d0000b273ea7caaff71dea1051d49b2fe", year: "1973", artist: "Pink Floyd", difficulty: "medium", type: "written" },
    { id: 203, title: "Thriller", image: "https://i.scdn.co/image/ab67616d0000b2734121faee8df82c526cbab2be", year: "1982", artist: "Michael Jackson", difficulty: "easy", type: "written" },
    { id: 204, title: "Nevermind", image: "https://i.scdn.co/image/ab67616d0000b273e175a19e530c898d167d39bf", year: "1991", artist: "Nirvana", difficulty: "medium", type: "written" },
    { id: 205, title: "Random Access Memories", image: "https://i.scdn.co/image/ab67616d0000b2737039054ab06e7610c149eb03", year: "2013", artist: "Daft Punk", difficulty: "easy", type: "written" },
    { id: 206, title: "Back in Black", image: "https://i.scdn.co/image/ab67616d0000b2730b51f8d91f3a21e8426361ae", year: "1980", artist: "AC/DC", difficulty: "medium", type: "written" },
    { id: 207, title: "Rumours", image: "https://i.scdn.co/image/ab67616d0000b2738b4b6009139ee57790b050a4", year: "1977", artist: "Fleetwood Mac", difficulty: "hard", type: "written" }
  ]
};

const checkSimilarity = (input, target) => {
  const normalize = (str) =>
      str
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();    const s1 = normalize(input);
  const s2 = normalize(target);
  if (s1 === s2) return 1;
  if (s2.includes(s1) && s1.length > 3) return 1;
  return 0;
};


const initialState = {
  session: {
    id: null,
    mode: 'movie',
    status: 'idle',
    startedAt: null,
    activities: [],
    totalPoints: 0,
    stats: { correct: 0, wrong: 0 }
  },
  game: {
    attempts: [],
    items: [],
    currentLevelIndex: 0,
    activityStartTime: null,
    lastResult: null
  },
};

const sessionReducer = (state, action) => {
  switch (action.type) {
    case 'INIT_SESSION':
      return {
        ...state,
        session: {
          id: `sess_${Date.now()}`,
          mode: action.payload.mode,
          status: 'in_progress',
          startedAt: new Date().toISOString(),
          activities: [],
          totalPoints: 0,
          stats: { correct: 0, wrong: 0 }
        },
        game: { ...initialState.game, items: [] }
      };
    
    case 'COMPLETE_SESSION':
      return {
        ...state,
        session: { ...state.session, status: 'completed', finishedAt: new Date().toISOString() },
        game: { ...initialState.game }
      };

    case 'RESUME_SESSION':
      return { ...state, session: { ...state.session, status: 'in_progress' } };

    case 'LOAD_ACTIVITY':
      return {
        ...state,
        game: {
          items: action.payload,
          attempts: [],
          currentLevelIndex: 0,
          currentItemIndex: 0,
          activityStartTime: Date.now(),
          lastResult: null
        }
      };

    case 'NEXT_ACTIVITY':
      return {
        ...state,
        game: {
          items: state.game.items,
          attempts: [],
          currentLevelIndex: 0,
          currentItemIndex: (state.game.currentItemIndex + 1),
          activityStartTime: Date.now(),
          lastResult: null
        }
      };

    case 'EVALUATE_ACTIVITY':
      { const { result } = action.payload;
      const isWin = result.correct;

      const newTotalPoints = state.session.totalPoints + result.pointsEarned;

      const newStats = {
        correct: state.session.stats.correct + (isWin ? 1 : 0),
        wrong: state.session.stats.wrong + (isWin ? 0 : 1)
      };

      return {
        ...state,
        session: {
          ...state.session,
          totalPoints: newTotalPoints,
          stats: newStats,
          activities: [...state.session.activities, result]
        },
        game: {
          ...state.game,
          lastResult: result
        }
      }; }

    case 'UPDATE_ATTEMPTS':
      return {
        ...state,
        game: {
          ...state.game,
          attempts: action.payload.attempts,
          currentLevelIndex: action.payload.levelIndex
        }
      };
      
    case 'EXIT_SESSION':
      return {
        ...state,
        session: { ...initialState.session },
        game: { ...initialState.game }
      };

    default:
      return state;
  }
};


const GameContext = React.createContext();

export const useGameSession = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGameSession must be used within GameProvider");
  return context;
};

const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  const { loadRandomMovies } = useMovies();
  const { loadInitialData } = useMusic();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && state.session.status === 'in_progress') {
        dispatch({ type: 'PAUSE_SESSION' });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [state.session.status]);

  const startSession = async (mode) => {
    dispatch({ type: 'INIT_SESSION', payload: { mode } });
    await loadNextActivity(mode);
  };


  const loadNextActivity = async (mode = null) => {

    if (state.session.activities.length >= GAMES_PER_SESSION) {
      dispatch({ type: 'COMPLETE_SESSION' });
      return;
    }



    await new Promise(r => setTimeout(r, 400));

    let items;
    if(mode === 'movie'){
      items = await loadRandomMovies();
    }else{
      items = await loadInitialData();
    }
    dispatch({ type: 'LOAD_ACTIVITY', payload: items });
  };

  const submitGuess = (guess) => {
    const { activityStartTime, attempts, currentLevelIndex, currentItemIndex, items } = state.game;

    const timeSpent = (Date.now() - activityStartTime) / 1000;
    const isCorrect = checkSimilarity(guess, items[currentItemIndex].title);

    if (isCorrect) {
      const result = ScoringEngine.calculate({
        type: items[currentItemIndex].type,
        timeSpent,
        isCorrect: true,
        gaveUp: false
      });
      dispatch({ type: 'EVALUATE_ACTIVITY', payload: { result, item: items[currentItemIndex] } });
    } else {
      const newAttempts = [...attempts, guess];
      const newLevel = Math.min(currentLevelIndex + 1, PIXEL_FACTORS.length - 1);
      
      if (newLevel >= MAX_ATTEMPTS) {
        const result = ScoringEngine.calculate({
          type: items[currentItemIndex].type,
          timeSpent,
          isCorrect: false,
          gaveUp: false
        });
        dispatch({ type: 'EVALUATE_ACTIVITY', payload: { result, item: items[currentItemIndex] } });
      } else {
        dispatch({
          type: 'UPDATE_ATTEMPTS',
          payload: { attempts: newAttempts, levelIndex: newLevel }
        });
      }
    }
  };

  const nextStep = () => {
    if (state.session.activities.length >= GAMES_PER_SESSION) {
      dispatch({ type: 'COMPLETE_SESSION' });
      return;
    }
    dispatch({type: 'NEXT_ACTIVITY'});
  }
  const resumeSession = () => dispatch({ type: 'RESUME_SESSION' });
  const exitSession = () => dispatch({ type: 'EXIT_SESSION' });

  return (
    <GameContext.Provider value={{ state, startSession, loadNextActivity, submitGuess, resumeSession, exitSession, nextStep }}>
      {children}
    </GameContext.Provider>
  );
};

const AppContent = () => {
  const { state } = useGameSession();

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-indigo-500/90 selection:text-white overflow-hidden flex flex-col">
      <div 
        className="fixed inset-0 z-0 opacity-10 pointer-events-none"
        style={{ 
          backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', 
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
        }} 
      />
      
      <div className="container mx-auto h-screen flex flex-col relative z-10">
        {state.session.status === 'idle' ? <HomeScreen /> : <GameScreen />}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
};

export default App;