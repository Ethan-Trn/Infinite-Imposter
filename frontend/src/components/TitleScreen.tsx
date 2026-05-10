import { useState } from 'react';
import './TitleScreen.css';

const COLORS = [
  { bg: '#7b2ff7', emoji: '👑' },
  { bg: '#ff6b6b', emoji: '🎭' },
  { bg: '#00c9a7', emoji: '🕵️' },
  { bg: '#ffd93d', emoji: '🎩' },
  { bg: '#ff9f43', emoji: '🦊' },
  { bg: '#48dbfb', emoji: '🦄' },
  { bg: '#ff6fd8', emoji: '🐙' },
  { bg: '#1dd1a1', emoji: '🎯' },
];

const DOT_COLORS = ['#ff6b6b', '#ffd93d', '#00c9a7', '#7b2ff7', '#ff6b6b'];

interface Player {
  id: number;
  name: string;
  colorIdx: number;
}

interface Props {
  onStart: (players: string[], imposterCount: number) => void;
}

let nextId = 0;

export default function TitleScreen({ onStart }: Props) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [btnWiggle, setBtnWiggle] = useState(false);
  const [imposterCount, setImposterCount] = useState(1);

  const maxImposters = Math.max(1, players.length - 1);

  const addPlayer = () => {
    if (players.length >= 10) {
      setBtnWiggle(true);
      setTimeout(() => setBtnWiggle(false), 400);
      return;
    }
    const id = nextId++;
    setPlayers(prev => [...prev, { id, name: '', colorIdx: prev.length % COLORS.length }]);
    setTimeout(() => {
      document.getElementById(`input-${id}`)?.focus();
    }, 60);
  };

  const removePlayer = (id: number) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  const updateName = (id: number, name: string) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, name } : p));
  };

  const allNamed = players.length >= 2 && players.every(p => p.name.trim().length > 0);

  const handleStart = () => {
    if (allNamed) onStart(players.map(p => p.name.trim()), Math.min(imposterCount, maxImposters));
  };

  return (
    <div className="ts-bg">
      <div className="ts-blob" style={{ width: 400, height: 400, background: '#7b2ff7', top: -100, left: -100 }} />
      <div className="ts-blob" style={{ width: 300, height: 300, background: '#ff6b6b', top: 80, right: -60 }} />
      <div className="ts-blob" style={{ width: 350, height: 350, background: '#00c9a7', bottom: -50, left: '35%' }} />

      {Array.from({ length: 35 }).map((_, i) => (
        <div key={i} className="ts-star" style={{
          width: Math.random() * 3 + 1,
          height: Math.random() * 3 + 1,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${1.5 + Math.random() * 2}s`,
        }} />
      ))}

      {players.length >= 2 && (
        <div className="ts-imposter-selector">
          <div className="ts-imposter-label">🕵️ Imposters</div>
          <div className="ts-imposter-controls">
            <button className="ts-imposter-btn" onClick={() => setImposterCount(c => Math.max(1, c - 1))} disabled={imposterCount <= 1}>−</button>
            <div className="ts-imposter-count">{Math.min(imposterCount, maxImposters)}</div>
            <button className="ts-imposter-btn" onClick={() => setImposterCount(c => Math.min(maxImposters, c + 1))} disabled={imposterCount >= maxImposters}>+</button>
          </div>
          <div className="ts-imposter-cap">max {maxImposters}</div>
        </div>
      )}

      <div className="ts-title-section">
        <div className="ts-eyebrow">✦ Party Game ✦</div>
        <h1 className="ts-game-title">Infinite<br />Imposter</h1>
        <p className="ts-subtitle">Who's the odd one out?</p>
        <div className="ts-dots-row">
          {DOT_COLORS.map((c, i) => (
            <div key={i} className="ts-dot" style={{ background: c, animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
        <button className={`ts-add-btn${btnWiggle ? ' wiggle' : ''}`} onClick={addPlayer}>
          <div className="ts-plus-circle">+</div>
          Add Player
        </button>
      </div>

      {players.length > 0 && (
        <div className="ts-players-section">
          <div className="ts-section-label">Players</div>
          <div className="ts-cards-grid">
            {players.map((p, i) => (
              <div key={p.id} className="ts-card">
                <button className="ts-remove-btn" onClick={() => removePlayer(p.id)}>×</button>
                <div className="ts-avatar" style={{ background: COLORS[p.colorIdx].bg }}>
                  {COLORS[p.colorIdx].emoji}
                </div>
                <input
                  id={`input-${p.id}`}
                  className="ts-name-input"
                  type="text"
                  placeholder={`Player ${i + 1}`}
                  maxLength={16}
                  value={p.name}
                  onChange={e => updateName(p.id, e.target.value)}
                />
                <div className="ts-card-num">PLAYER {String(i + 1).padStart(2, '0')}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="ts-start-row">
        {allNamed && (
          <button className="ts-start-btn" onClick={handleStart}>Let's Play! 🎭</button>
        )}
        {players.length > 0 && !allNamed && (
          <p className="ts-hint">
            {players.length < 2 ? 'Need at least 2 players' : `${players.filter(p => !p.name.trim()).length} player(s) still need a name`}
          </p>
        )}
      </div>
    </div>
  );
}