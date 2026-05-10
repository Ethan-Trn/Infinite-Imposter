import { useState } from 'react';
import './WordReveal.css';

interface Props {
  players: string[];
  words: string[];
  imposterIndexes: number[];
  onAllRevealed: () => void;
}

type Phase = 'handoff' | 'reveal';

export default function WordReveal({ players, words, imposterIndexes, onAllRevealed }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>('handoff');

  const currentPlayer = players[currentIdx];
  const currentWord = words[currentIdx];
  const isImposter = imposterIndexes.includes(currentIdx);
  const isLast = currentIdx === players.length - 1;

  const handleNext = () => {
    if (isLast) {
      onAllRevealed();
    } else {
      setPhase('handoff');
      setCurrentIdx(i => i + 1);
    }
  };

  return (
    <div className="wr-bg">
      <div className="wr-blob" style={{ width: 300, height: 300, background: '#ff6b6b', top: -60, left: -60 }} />
      <div className="wr-blob" style={{ width: 260, height: 260, background: '#7b2ff7', bottom: 0, right: -40 }} />

      <div className="wr-inner">
        <div className="wr-progress-row">
          {players.map((_, i) => (
            <div key={i} className="wr-progress-dot" style={{
              background: i < currentIdx ? '#00c9a7' : i === currentIdx ? 'white' : 'rgba(255,255,255,0.2)',
              transform: i === currentIdx ? 'scale(1.3)' : 'scale(1)',
            }} />
          ))}
        </div>

        {phase === 'handoff' && (
          <div className="wr-card">
            <div className="wr-pass-icon">📱</div>
            <h2 className="wr-pass-title">Pass to</h2>
            <div className="wr-player-name-big">{currentPlayer}</div>
            <p className="wr-pass-hint">Don't let anyone else see your screen!</p>
            <button className="wr-reveal-btn" onClick={() => setPhase('reveal')}>
              I'm ready 👀
            </button>
          </div>
        )}

        {phase === 'reveal' && (
          <div className="wr-card">
            <div className="wr-player-label">{currentPlayer}</div>

            {isImposter ? (
              <>
                <div className="wr-imposter-badge">🕵️ You're the Imposter!</div>
                <div className="wr-no-word-box">
                  <div className="wr-no-word-icon">?</div>
                  <p className="wr-no-word-text">You have no word.</p>
                  <p className="wr-no-word-sub">Blend in. Don't get caught.</p>
                </div>
              </>
            ) : (
              <>
                <div className="wr-word-label">Your word is</div>
                <div className="wr-word-box">
                  <span className="wr-word-text">{currentWord}</span>
                </div>
                <p className="wr-word-hint">Don't give it away — but prove you know it!</p>
              </>
            )}

            <button className="wr-next-btn" onClick={handleNext}>
              {isLast ? 'Start Game 🎮' : `Done — pass to ${players[currentIdx + 1]}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}