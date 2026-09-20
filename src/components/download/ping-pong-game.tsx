'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { RotateCcw, Trophy, Sparkles } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export function PingPongGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [cpuScore, setCpuScore] = useState(0);
  const [rallyCount, setRallyCount] = useState(0);
  const [highRally, setHighRally] = useState(0);

  // Game state stored in ref for zero-latency frame loop
  const gameState = useRef({
    // Canvas dimensions
    width: 440,
    height: 180,

    // Paddle dimensions
    paddleWidth: 8,
    paddleHeight: 46,

    // Player (left)
    playerY: 67,
    playerTargetY: 67,

    // CPU (right)
    cpuY: 67,
    cpuSpeed: 3.2,

    // Ball
    ballX: 220,
    ballY: 90,
    ballRadius: 5,
    ballSpeedX: 4,
    ballSpeedY: 2.2,
    baseSpeed: 4.2,

    // Game loop
    particles: [] as Particle[],
    isPaused: false,
    rally: 0,
  });

  const resetBall = useCallback((towardsPlayer: boolean) => {
    const s = gameState.current;
    s.ballX = s.width / 2;
    s.ballY = s.height / 2;
    s.ballSpeedX = (towardsPlayer ? -1 : 1) * s.baseSpeed;
    s.ballSpeedY = (Math.random() - 0.5) * 4;
    s.rally = 0;
    setRallyCount(0);
  }, []);

  const resetGame = () => {
    setPlayerScore(0);
    setCpuScore(0);
    setRallyCount(0);
    resetBall(Math.random() > 0.5);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const spawnParticles = (x: number, y: number, color: string, count = 8) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        gameState.current.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.0,
          color,
        });
      }
    };

    const render = () => {
      const s = gameState.current;
      const width = s.width;
      const height = s.height;

      // 1. Clear background
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, width, height);

      // Subtle center net
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.setLineDash([4, 6]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. Physics & Ball movement
      s.ballX += s.ballSpeedX;
      s.ballY += s.ballSpeedY;

      // Wall bounce (Top & Bottom)
      if (s.ballY - s.ballRadius <= 0) {
        s.ballY = s.ballRadius;
        s.ballSpeedY = Math.abs(s.ballSpeedY);
        spawnParticles(s.ballX, s.ballY, '#38bdf8', 4);
      } else if (s.ballY + s.ballRadius >= height) {
        s.ballY = height - s.ballRadius;
        s.ballSpeedY = -Math.abs(s.ballSpeedY);
        spawnParticles(s.ballX, s.ballY, '#38bdf8', 4);
      }

      // Smooth Player paddle motion
      s.playerY += (s.playerTargetY - s.playerY) * 0.25;
      s.playerY = Math.max(0, Math.min(height - s.paddleHeight, s.playerY));

      // CPU AI paddle tracking
      const cpuCenter = s.cpuY + s.paddleHeight / 2;
      const cpuDiff = s.ballY - cpuCenter;
      if (Math.abs(cpuDiff) > 6) {
        s.cpuY += Math.sign(cpuDiff) * Math.min(Math.abs(cpuDiff), s.cpuSpeed);
      }
      s.cpuY = Math.max(0, Math.min(height - s.paddleHeight, s.cpuY));

      // Player collision (Left paddle at x = 18)
      const pX = 18;
      if (
        s.ballX - s.ballRadius <= pX + s.paddleWidth &&
        s.ballX + s.ballRadius >= pX &&
        s.ballY >= s.playerY &&
        s.ballY <= s.playerY + s.paddleHeight
      ) {
        s.ballSpeedX = Math.abs(s.ballSpeedX) * 1.05; // Slightly speed up
        const hitOffset = (s.ballY - (s.playerY + s.paddleHeight / 2)) / (s.paddleHeight / 2);
        s.ballSpeedY = hitOffset * 4.5;
        s.ballX = pX + s.paddleWidth + s.ballRadius;
        s.rally += 1;
        setRallyCount(s.rally);
        setHighRally((prev) => Math.max(prev, s.rally));
        spawnParticles(s.ballX, s.ballY, '#60a5fa', 10);
      }

      // CPU collision (Right paddle at x = width - 26)
      const cX = width - 26;
      if (
        s.ballX + s.ballRadius >= cX &&
        s.ballX - s.ballRadius <= cX + s.paddleWidth &&
        s.ballY >= s.cpuY &&
        s.ballY <= s.cpuY + s.paddleHeight
      ) {
        s.ballSpeedX = -Math.abs(s.ballSpeedX) * 1.03;
        const hitOffset = (s.ballY - (s.cpuY + s.paddleHeight / 2)) / (s.paddleHeight / 2);
        s.ballSpeedY = hitOffset * 4.2;
        s.ballX = cX - s.ballRadius;
        s.rally += 1;
        setRallyCount(s.rally);
        setHighRally((prev) => Math.max(prev, s.rally));
        spawnParticles(s.ballX, s.ballY, '#f43f5e', 8);
      }

      // Score checks
      if (s.ballX < 0) {
        // CPU scored
        setCpuScore((prev) => prev + 1);
        spawnParticles(10, s.ballY, '#f43f5e', 14);
        resetBall(false);
      } else if (s.ballX > width) {
        // Player scored
        setPlayerScore((prev) => prev + 1);
        spawnParticles(width - 10, s.ballY, '#60a5fa', 14);
        resetBall(true);
      }

      // 3. Draw Paddles
      // Player paddle (Neon Blue)
      ctx.shadowColor = '#3b82f6';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#60a5fa';
      ctx.beginPath();
      ctx.roundRect(pX, s.playerY, s.paddleWidth, s.paddleHeight, 4);
      ctx.fill();

      // CPU paddle (Neon Rose)
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#fb7185';
      ctx.beginPath();
      ctx.roundRect(cX, s.cpuY, s.paddleWidth, s.paddleHeight, 4);
      ctx.fill();

      // 4. Draw Ball with Glowing Trail
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 14;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(s.ballX, s.ballY, s.ballRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // Reset shadow

      // 5. Update & Draw Particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.04;
        if (p.life <= 0) {
          s.particles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [resetBall]);

  // Mouse / Touch handlers for player paddle
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleY = gameState.current.height / rect.height;
    const clientY = (e.clientY - rect.top) * scaleY;
    gameState.current.playerTargetY = clientY - gameState.current.paddleHeight / 2;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !e.touches[0]) return;
    const rect = canvas.getBoundingClientRect();
    const scaleY = gameState.current.height / rect.height;
    const clientY = (e.touches[0].clientY - rect.top) * scaleY;
    gameState.current.playerTargetY = clientY - gameState.current.paddleHeight / 2;
  };

  return (
    <div className="relative rounded-2xl bg-zinc-950/80 border border-white/10 p-3 flex flex-col items-center select-none overflow-hidden group">
      {/* Top Bar / Stats */}
      <div className="w-full flex items-center justify-between text-xs text-zinc-400 mb-2 px-2">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>YOU: {playerScore}</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-500">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Rally: {rallyCount}
          </span>
          {highRally > 0 && (
            <span className="flex items-center gap-1 text-emerald-400">
              <Trophy className="w-3 h-3" />
              Best: {highRally}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <span>CPU: {cpuScore}</span>
          <span className="inline-block w-2 h-2 rounded-full bg-rose-500" />
        </div>
      </div>

      {/* Canvas Game Arena */}
      <div className="relative w-full aspect-[440/180] max-h-[190px] rounded-xl overflow-hidden cursor-ns-resize shadow-inner border border-white/5">
        <canvas
          ref={canvasRef}
          width={440}
          height={180}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="w-full h-full block"
        />

        {/* Floating Guide Prompt */}
        <div className="absolute bottom-2 inset-x-0 text-center pointer-events-none opacity-40 group-hover:opacity-10 transition-opacity">
          <span className="text-[10px] tracking-wider uppercase text-zinc-400 bg-black/60 px-2 py-0.5 rounded-full border border-white/5">
            Slide cursor or touch to move paddle
          </span>
        </div>
      </div>

      {/* Restart quick control */}
      <div className="w-full flex justify-end mt-1.5 px-1">
        <button
          onClick={resetGame}
          className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Reset Game
        </button>
      </div>
    </div>
  );
}
