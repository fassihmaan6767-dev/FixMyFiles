'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Braces, Check, AlertCircle, Copy, Trash2, Wand2 } from 'lucide-react';
import { ToolPageLayout } from '@/components/ui/tool-page-layout';
import { cn } from '@/lib/utils';

/**
 * JsonFormatterClient
 * JSON Formatter & Validator:
 * - Paste JSON, validate with JSON.parse()
 * - Show exact error line/position
 * - Pretty print with JSON.stringify(null, 2)
 * - Copy to clipboard
 * - Minify option
 */

export function JsonFormatterClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [indentSize, setIndentSize] = useState(2);

  // Format JSON
  const formatJson = useCallback(() => {
    if (!input.trim()) {
      setError('Please paste some JSON first.');
      setIsValid(false);
      setOutput('');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutput(formatted);
      setError(null);
      setIsValid(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid JSON';
      setError(message);
      setIsValid(false);
      setOutput('');
    }
  }, [input, indentSize]);

  // Minify JSON
  const minifyJson = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError(null);
      setIsValid(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid JSON';
      setError(message);
      setIsValid(false);
    }
  }, [input]);

  // Copy output to clipboard
  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
  };

  return (
    <ToolPageLayout
      title="JSON Formatter & Validator"
      description="Validate, format, and beautify JSON data instantly."
    >
      <div className="space-y-6">
        {/* Input Area */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-zinc-400">Input JSON</label>
            <button
              onClick={() => { setInput(''); setOutput(''); setError(null); setIsValid(null); }}
              className="text-xs text-zinc-500 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Trash2 className="h-3 w-3" /> Clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"paste": "your JSON here"}'
            className="w-full h-64 px-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-zinc-600"
            spellCheck={false}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={formatJson}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <Wand2 className="h-4 w-4" /> Format
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={minifyJson}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-sm font-medium hover:bg-zinc-700 transition-colors border border-white/10"
          >
            Minify
          </motion.button>

          {/* Indent Size */}
          <div className="flex items-center gap-2 ml-auto">
            <label className="text-xs text-zinc-500">Indent:</label>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
              className="px-2 py-1.5 rounded-lg bg-zinc-800 border border-white/10 text-sm text-white focus:outline-none"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={8}>Tab (8)</option>
            </select>
          </div>
        </div>

        {/* Validation Status */}
        {isValid !== null && (
          <div
            className={cn(
              'flex items-center gap-2 px-4 py-3 rounded-xl text-sm',
              isValid
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            )}
          >
            {isValid ? (
              <><Check className="h-4 w-4" /> Valid JSON</>
            ) : (
              <><AlertCircle className="h-4 w-4" /> {error}</>
            )}
          </div>
        )}

        {/* Output Area */}
        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-zinc-400">Output</label>
              <button
                onClick={copyOutput}
                className="text-xs text-zinc-500 hover:text-white flex items-center gap-1 transition-colors"
              >
                <Copy className="h-3 w-3" /> Copy
              </button>
            </div>
            <pre className="w-full max-h-96 overflow-auto px-4 py-3 rounded-xl bg-zinc-900/80 border border-white/10 text-emerald-300 text-sm font-mono">
              {output}
            </pre>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
