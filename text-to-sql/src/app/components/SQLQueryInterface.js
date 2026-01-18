"use client";

import React, { useState } from 'react';
import { Search, Database, Loader2,Copy,Check } from 'lucide-react';

export default function SQLQueryInterface() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    console.log(`Query submitted: ${query}`);
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null); // Clear previous results

     const controller = new AbortController();
     const timeoutId = setTimeout(() => controller.abort(), 20000); // 2 minutes


    try {
      const response = await fetch(`https://multi-agent-system-rqvh.onrender.com/api/generate?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal 
      });
      clearTimeout(timeoutId);
      const res = await response.json();
      console.log('Backend full response:', res);
      console.log('SQL data:', res.data);
      
      if (!res.success || !res.data) {
        throw new Error('No data returned from backend');
      }

      // Set the SQL string result
      setResult(res.data);
      console.log('Result set to:', res.data);
    } catch (err) {
      console.error('Error:', err);
       if (err.name === 'AbortError') {
    setError('Request timed out. Please try again.');
  } else {
    setError(err.message || 'Failed to generate SQL query');
  }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

    const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Database className="w-8 h-8 text-slate-700" />
          <h1 className="text-2xl font-semibold text-slate-800">NL to SQL</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <div className="w-full max-w-3xl">
          {/* Search Box */}
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question about your database..."
                className="w-full pl-16 pr-6 py-5 text-lg rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none shadow-lg transition-all"
                disabled={loading}
              />
            </div>
            {query && (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Processing...' : 'Search'}
              </button>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="mt-8 flex items-center justify-center gap-3 text-slate-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating SQL query...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          )}

          {/* Results */}
          {result && !loading && !error && (
            <div className="mt-8 space-y-4">
              {/* Generated SQL */}
              <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700">Generated SQL Query</p>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="p-6">
                  <pre className="text-sm text-slate-800 font-mono overflow-x-auto whitespace-pre-wrap break-words">
                    <code>{result}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}
         
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-slate-500">
        Powered by Multi-Agent SQL System
      </footer>
    </div>
  );
}