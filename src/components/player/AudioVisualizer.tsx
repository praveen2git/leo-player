'use client';

import { useEffect, useRef, useState } from 'react';

interface AudioVisualizerProps {
  audioElement: HTMLAudioElement | null;
  type?: 'waveform' | 'bars' | 'circular';
}

export function AudioVisualizer({ audioElement, type = 'bars' }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null);

  // Setup audio context and analyser
  useEffect(() => {
    if (!audioElement) return;

    const audioContext = new AudioContext();
    const analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 256;

    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyserNode);
    analyserNode.connect(audioContext.destination);

    const bufferLength = analyserNode.frequencyBinCount;
    const dataArr = new Uint8Array(bufferLength);

    setAnalyser(analyserNode);
    setDataArray(dataArr);

    return () => {
      audioContext.close();
    };
  }, [audioElement]);

  // Draw visualization
  useEffect(() => {
    if (!canvasRef.current || !analyser || !dataArray) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = 'rgb(17, 24, 39)'; // bg-gray-900
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (type === 'bars') {
        drawBars(ctx, canvas, dataArray);
      } else if (type === 'waveform') {
        drawWaveform(ctx, canvas, dataArray);
      } else if (type === 'circular') {
        drawCircular(ctx, canvas, dataArray);
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, dataArray, type]);

  const drawBars = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: Uint8Array) => {
    const barWidth = (canvas.width / data.length) * 2.5;
    let x = 0;

    for (let i = 0; i < data.length; i++) {
      const barHeight = (data[i] / 255) * canvas.height * 0.8;

      const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
      gradient.addColorStop(0, 'rgb(168, 85, 247)'); // purple-500
      gradient.addColorStop(0.5, 'rgb(236, 72, 153)'); // pink-500
      gradient.addColorStop(1, 'rgb(251, 146, 60)'); // orange-400

      ctx.fillStyle = gradient;
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

      x += barWidth + 2;
    }
  };

  const drawWaveform = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: Uint8Array) => {
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgb(168, 85, 247)'; // purple-500
    ctx.beginPath();

    const sliceWidth = canvas.width / data.length;
    let x = 0;

    for (let i = 0; i < data.length; i++) {
      const v = data[i] / 128.0;
      const y = (v * canvas.height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  };

  const drawCircular = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: Uint8Array) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.6;

    // Draw bars in a circle
    for (let i = 0; i < data.length; i++) {
      const barHeight = (data[i] / 255) * radius * 0.8;
      const angle = (i / data.length) * Math.PI * 2;

      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + barHeight);
      const y2 = centerY + Math.sin(angle) * (radius + barHeight);

      const hue = (i / data.length) * 360;
      ctx.strokeStyle = `hsl(${hue}, 80%, 60%)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgb(168, 85, 247)';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  return (
    <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden">
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="w-full h-full"
      />

      {/* Visualization Type Selector */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={() => (type = 'bars')}
          className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded text-white text-sm hover:bg-white/30"
        >
          Bars
        </button>
        <button
          onClick={() => (type = 'waveform')}
          className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded text-white text-sm hover:bg-white/30"
        >
          Waveform
        </button>
        <button
          onClick={() => (type = 'circular')}
          className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded text-white text-sm hover:bg-white/30"
        >
          Circular
        </button>
      </div>
    </div>
  );
}
