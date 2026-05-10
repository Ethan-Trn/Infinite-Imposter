import { useState } from 'react';
import './Voting.css';

interface Props {
  players: string[];
  imposterIndexes: number[];
  word: string;
  category: string;
  onPlayAgain: () => void;
}

type Phase = 'voting' | 'result';

const COLORS = ['#7b2ff7','#ff6b6b','#00c9a7','#ffd93d','#ff9f43','#48dbfb','#ff6fd8','#1dd1a1'];
const EMOJIS = ['👑','🎭','🕵️','🎩','🦊','🦄','🐙','🎯'];

export default function Voting({ players, imposterIndexes, word, category, onPlayAgain }: Props) {
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<Phase>('voting');

  const votesIn = Object.keys(votes).length;
  const allVoted = votesIn === players.length;

  const castVote = (voter: string, suspect: string) => {
    if (votes[voter]) return;
    setVotes(prev => ({ ...prev, [voter]: suspect }));
  };

  const tally: Record<string, number> = {};
  players.forEach(p => { tally[p] = 0; });
  Object.values(votes).forEach(s => { tally[s] = (tally[s] || 0) + 1; });

  const maxVotes = Math.max(...Object.values(tally));
  const topSuspects = players.filter(p => tally[p] === maxVotes);
  const votedOutName = topSuspects.length === 1 ? topSuspects[0] : null;
  const votedOutIdx = votedOutName ? players.indexOf(votedOutName) : -1;
  const gotImposter = votedOutIdx !== -1 && imposterIndexes.includes(votedOutIdx);
  const imposterNames = imposterIndexes.map(i => players[i]);
  const imposterLabel = imposterNames.join(' & ');

  if (phase === 'result') {
    return (
      <div className="vt-bg">
        <div className="vt-blob" style={{ width: 400, height: 400, background: gotImposter ? '#00c9a7' : '#ff6b6b', top: -80, left: '20%' }} />
        <div className="vt-inner">
          <div className={`vt-outcome-banner`} style={{
            background: gotImposter ? 'rgba(0,201,167,0.15)' : 'rgba(255,107,107,0.15)',
            border: `2px solid ${gotImposter ? 'rgba(0,201,167,0.4)' : 'rgba(255,107,107,0.4)'}`,
          }}>
            <div className="vt-outcome-emoji">{gotImposter ? '🎉' : '😈'}</div>
            <div className="vt-outcome-title">{gotImposter ? 'Players Win!' : 'Imposter Wins!'}</div>
            <div className="vt-outcome-sub">
              {gotImposter ? `You caught ${imposterLabel}!` : `${imposterLabel} fooled everyone!`}
            </div>
          </div>

          <div className="vt-word-reveal-card">
            <div className="vt-word-reveal-label">The word was</div>
            <div className="vt-word-reveal-word">{word}</div>
            <div className="vt-word-reveal-cat">in category: {category}</div>
          </div>

          <div className="vt-tally-card">
            <div className="vt-tally-title">Vote Tally</div>
            {players.map((p, i) => (
              <div key={p} className="vt-tally-row">
                <div className="vt-tally-name">
                  <span style={{ marginRight: 6 }}>{EMOJIS[i % EMOJIS.length]}</span>
                  {p}
                  {imposterIndexes.includes(i) && <span className="vt-imposter-tag">IMPOSTER</span>}
                </div>
                <div className="vt-tally-bar-wrap">
                  <div className="vt-tally-bar" style={{
                    width: `${(tally[p] / players.length) * 100}%`,
                    background: imposterIndexes.includes(i) ? '#ff6b6b' : '#7b2ff7',
                  }} />
                  <span className="vt-tally-count">{tally[p]}</span>
                </div>
              </div>
            ))}
          </div>

          <button className="vt-play-again-btn" onClick={onPlayAgain}>🔄 Play Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="vt-bg">
      <div className="vt-blob" style={{ width: 320, height: 320, background: '#7b2ff7', top: -80, right: -80 }} />
      <div className="vt-blob" style={{ width: 280, height: 280, background: '#ff6b6b', bottom: -40, left: -60 }} />

      <div className="vt-inner">
        <div className="vt-header">
          <div className="vt-eyebrow">🗳️ Time to Vote</div>
          <h2 className="vt-title">Who's the Imposter?</h2>
          <div className="vt-category-chip">Category: <strong>{category}</strong></div>
        </div>

        <div className="vt-progress-card">
          <div className="vt-progress-label">{votesIn} / {players.length} votes cast</div>
          <div className="vt-progress-bar">
            <div className="vt-progress-fill" style={{ width: `${(votesIn / players.length) * 100}%` }} />
          </div>
        </div>

        <div className="vt-voters-list">
          {players.map((voter, vi) => (
            <div key={voter} className="vt-voter-row">
              <div className="vt-voter-info">
                <div className="vt-voter-avatar" style={{ background: COLORS[vi % COLORS.length] }}>
                  {EMOJIS[vi % EMOJIS.length]}
                </div>
                <div>
                  <div className="vt-voter-name">{voter}</div>
                  <div className="vt-voter-status">
                    {votes[voter] ? `Voted for ${votes[voter]}` : 'Choosing...'}
                  </div>
                </div>
              </div>
              {!votes[voter] && (
                <div className="vt-suspect-btns">
                  {players.filter(p => p !== voter).map((suspect, si) => (
                    <button
                      key={suspect}
                      className="vt-suspect-btn"
                      style={{ borderColor: COLORS[players.indexOf(suspect) % COLORS.length], border: '1.5px solid' }}
                      onClick={() => castVote(voter, suspect)}
                    >
                      {suspect}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {allVoted && (
          <button className="vt-reveal-btn" onClick={() => setPhase('result')}>
            🎭 Reveal the Imposter!
          </button>
        )}
      </div>
    </div>
  );
}