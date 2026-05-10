import { useState } from 'react';
import TitleScreen from './components/TitleScreen';
import CategorySelect from './components/CategorySelect';
import WordReveal from './components/WordReveal';
import Voting from './components/Voting';
import './index.css';

type Screen = 'title' | 'category' | 'wordReveal' | 'voting';

interface GameState {
  players: string[];
  words: string[];
  category: string;
  imposterIndexes: number[];
  imposterCount: number;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('title');
  const [game, setGame] = useState<GameState | null>(null);

  // Title screen → Category select
  const handlePlayersReady = (players: string[], imposterCount: number) => {
    setGame(prev => ({ ...(prev ?? {} as GameState), players, imposterCount }));
    setScreen('category');
  };

  // Category select → Word reveal
  const handleWordsReady = (words: string[], category: string) => {
    setGame(prev => {
      if (!prev) return null;

      // Pick random unique imposter indexes
      const indexes = [...Array(prev.players.length).keys()];
      const shuffledIndexes = indexes.sort(() => Math.random() - 0.5);
      const imposterIndexes = shuffledIndexes.slice(0, prev.imposterCount);

      // Pick one word for ALL non-imposters (same word)
      const theWord = words[Math.floor(Math.random() * words.length)];

      const assigned = prev.players.map((_, i) =>
        imposterIndexes.includes(i) ? '' : theWord
      );

      return { ...prev, words: assigned, category, imposterIndexes };
    });
    setScreen('wordReveal');
  };

  const handleAllRevealed = () => setScreen('voting');

  const handlePlayAgain = () => {
    setGame(prev => prev ? { ...prev, words: [], category: '', imposterIndexes: [] } : null);
    setScreen('category');
  };

  return (
    <>
      {screen === 'title' && (
        <TitleScreen onStart={handlePlayersReady} />
      )}

      {screen === 'category' && game && (
        <CategorySelect
          players={game.players}
          onWordsReady={handleWordsReady}
        />
      )}

      {screen === 'wordReveal' && game && (
        <WordReveal
          players={game.players}
          words={game.words}
          imposterIndexes={game.imposterIndexes}
          onAllRevealed={handleAllRevealed}
        />
      )}

      {screen === 'voting' && game && (
        <Voting
          players={game.players}
          imposterIndexes={game.imposterIndexes}
          word={game.words.find(w => w !== '') ?? ''}
          category={game.category}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </>
  );
}