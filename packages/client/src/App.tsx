import { useState, useEffect, useCallback } from 'react';
import GameLayout from './components/layout/GameLayout';
import Lobby from './components/layout/Lobby';
import { GameState } from './types/game';

type AppView = 'lobby' | 'game';

function App() {
  const [view, setView] = useState<AppView>('lobby');
  const [gameId, setGameId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState('Marcel');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoinRoom = async (roomId: string) => {
    // Join existing room — create a new player for this room
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/game/${roomId}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setGameId(roomId);
      setGameState(data);
      // Find the human player
      const humanPlayer = data.players.find((p: any) => p.type === 'HUMAN');
      if (humanPlayer) setPlayerId(humanPlayer.id);
      setView('game');
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleCreateRoom = async (bots: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/lobby/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName, botCount: bots }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setGameId(data.gameId);
      setGameState(data.state);
      const humanPlayer = data.state.players.find((p: any) => p.type === 'HUMAN');
      if (humanPlayer) setPlayerId(humanPlayer.id);
      setView('game');
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const reloadState = useCallback(async () => {
    if (!gameId) return;
    try {
      const res = await fetch(`/api/game/${gameId}`);
      const data = await res.json();
      setGameState(data);
    } catch (err: any) {
      setError(err.message);
    }
  }, [gameId]);

  const executeTurn = async () => {
    if (!gameId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/game/${gameId}/turn`, { method: 'POST' });
      const data = await res.json();
      setGameState(data);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const performAction = async (action: string, body: any) => {
    if (!gameId || !playerId) return;
    try {
      const res = await fetch(`/api/game/${gameId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId, ...body }),
      });
      const result = await res.json();
      await reloadState();
      return result;
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleBackToLobby = () => {
    setView('lobby');
    setGameId(null);
    setGameState(null);
    setPlayerId(null);
  };

  if (view === 'lobby' || !gameState) {
    return (
      <Lobby
        playerName={playerName}
        onNameChange={setPlayerName}
        onJoinRoom={handleJoinRoom}
        onCreateRoom={handleCreateRoom}
        loading={loading}
        error={error}
      />
    );
  }

  return (
    <GameLayout
      gameState={gameState}
      playerId={playerId!}
      onTurn={executeTurn}
      onAction={performAction}
      onBackToLobby={handleBackToLobby}
      loading={loading}
    />
  );
}

export default App;