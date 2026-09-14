'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { ToolPageLayout } from '@/components/ui/tool-page-layout';
import { cn } from '@/lib/utils';

/**
 * GlassmorphismClient
 * CSS Glassmorphism Generator:
 * - Sliders for blur, opacity, saturation, and border
 * - Color picker for background tint
 * - Live preview box with gradient backdrop
 * - Copy production-ready CSS
 */

export function GlassmorphismClient() {
  const [blur, setBlur] = useState(12);
  const [opacity, setOpacity] = useState(0.15);
  const [saturation, setSaturation] = useState(180);
  const [borderOpacity, setBorderOpacity] = useState(0.2);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [borderRadius, setBorderRadius] = useState(16);
  const [copied, setCopied] = useState(false);

  // Convert hex to rgba
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Generate CSS string
  const cssCode = `/* Glassmorphism */
background: ${hexToRgba(bgColor, opacity)};
backdrop-filter: blur(${blur}px) saturate(${saturation}%);
-webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
border-radius: ${borderRadius}px;
border: 1px solid ${hexToRgba(bgColor, borderOpacity)};`;

  // Copy to clipboard
  const copyCSS = async () => {
    await navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolPageLayout
      title="CSS Glassmorphism Generator"
      description="Design frosted glass effects with live preview. Copy production-ready CSS."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Live Preview */}
        <div className="order-1 lg:order-2">
          <h4 className="text-sm text-zinc-400 mb-3">Live Preview</h4>
          <div
            className="relative h-80 rounded-2xl overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            }}
          >
            {/* Decorative elements behind the glass */}
            <div className="absolute top-8 left-8 w-20 h-20 rounded-full bg-pink-400/60" />
            <div className="absolute bottom-12 right-12 w-28 h-28 rounded-full bg-blue-400/50" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-lg bg-yellow-300/40 rotate-45" />

            {/* Glass Card */}
            <div
              className="absolute inset-8 flex items-center justify-center"
              style={{
                background: hexToRgba(bgColor, opacity),
                backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
                WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
                borderRadius: `${borderRadius}px`,
                border: `1px solid ${hexToRgba(bgColor, borderOpacity)}`,
              }}
            >
              <div className="text-center">
                <p className="text-white text-lg font-semibold mb-1">Glass Card</p>
                <p className="text-white/60 text-sm">Adjust the sliders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="order-2 lg:order-1 space-y-5">
          <h4 className="text-sm text-zinc-400 mb-3">Controls</h4>

          {/* Blur */}
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs text-zinc-400">Blur</label>
              <span className="text-xs text-zinc-500 font-mono">{blur}px</span>
            </div>
            <input type="range" min="0" max="40" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full accent-blue-500" />
          </div>

          {/* Opacity */}
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs text-zinc-400">Opacity</label>
              <span className="text-xs text-zinc-500 font-mono">{opacity.toFixed(2)}</span>
            </div>
            <input type="range" min="0" max="1" step="0.01" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full accent-blue-500" />
          </div>

          {/* Saturation */}
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs text-zinc-400">Saturation</label>
              <span className="text-xs text-zinc-500 font-mono">{saturation}%</span>
            </div>
            <input type="range" min="100" max="300" value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} className="w-full accent-blue-500" />
          </div>

          {/* Border Opacity */}
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs text-zinc-400">Border Opacity</label>
              <span className="text-xs text-zinc-500 font-mono">{borderOpacity.toFixed(2)}</span>
            </div>
            <input type="range" min="0" max="1" step="0.01" value={borderOpacity} onChange={(e) => setBorderOpacity(Number(e.target.value))} className="w-full accent-blue-500" />
          </div>

          {/* Border Radius */}
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs text-zinc-400">Border Radius</label>
              <span className="text-xs text-zinc-500 font-mono">{borderRadius}px</span>
            </div>
            <input type="range" min="0" max="40" value={borderRadius} onChange={(e) => setBorderRadius(Number(e.target.value))} className="w-full accent-blue-500" />
          </div>

          {/* Color Picker */}
          <div className="flex items-center gap-3">
            <label className="text-xs text-zinc-400">Tint Color</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-8 h-8 rounded-lg border-0 cursor-pointer"
            />
            <span className="text-xs text-zinc-500 font-mono">{bgColor}</span>
          </div>

          {/* CSS Output */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-zinc-400">CSS Code</label>
              <button
                onClick={copyCSS}
                className="text-xs text-zinc-500 hover:text-white flex items-center gap-1 transition-colors"
              >
                {copied ? (
                  <><Check className="h-3 w-3 text-emerald-400" /> Copied!</>
                ) : (
                  <><Copy className="h-3 w-3" /> Copy</>
                )}
              </button>
            </div>
            <pre className="px-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-emerald-300 text-xs font-mono overflow-x-auto">
              {cssCode}
            </pre>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
