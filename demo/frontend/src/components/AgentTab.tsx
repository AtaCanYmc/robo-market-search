import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Send, Cpu, CheckCircle2, AlertCircle, Loader2, Key, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export const AgentTab: React.FC = () => {
  const [prompt, setPrompt] = useState(
    'Toprak nemini ölçen ve WiFi üzerinden bildirim gönderen akıllı bitki sulama sistemi yapmak istiyorum.'
  );
  const [projectType, setProjectType] = useState('IoT / Akıllı Ev');

  // Bring Your Own API Key (BYOK) State
  const [provider, setProvider] = useState<string>('openai');
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [keySaved, setKeySaved] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load saved credentials from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('ROBO_AGENT_KEY') || '';
    const savedProvider = localStorage.getItem('ROBO_AGENT_PROVIDER') || 'openai';
    setApiKey(savedKey);
    setProvider(savedProvider);
    if (savedKey) setKeySaved(true);
  }, []);

  const handleSaveKey = () => {
    localStorage.setItem('ROBO_AGENT_KEY', apiKey.trim());
    localStorage.setItem('ROBO_AGENT_PROVIDER', provider);
    setKeySaved(true);
  };

  const handleClearKey = () => {
    localStorage.removeItem('ROBO_AGENT_KEY');
    setApiKey('');
    setKeySaved(false);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    try {
      // Save current key settings
      handleSaveKey();

      const res = await api.analyzeAgent(prompt, projectType, apiKey.trim() || undefined, provider);
      setResponse(res);
    } catch (err: any) {
      setError(err.message || 'Yapay Zeka ajanı yanıt veremedi. Lütfen API anahtarınızı ve sağlayıcıyı kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  const providers = [
    { id: 'openai', name: 'OpenAI (GPT-4o)', badge: 'Popüler', placeholder: 'sk-proj-...' },
    { id: 'gemini', name: 'Google Gemini', badge: 'Önerilen', placeholder: 'AIzaSy...' },
    { id: 'anthropic', name: 'Anthropic Claude', badge: 'Akıllı', placeholder: 'sk-ant-api...' },
    { id: 'deepseek', name: 'DeepSeek', badge: 'Hızlı', placeholder: 'sk-...' },
    { id: 'groq', name: 'Groq (Llama 3)', badge: 'Süper Hızlı', placeholder: 'gsk_...' },
    { id: 'ollama', name: 'Ollama (Lokal)', badge: 'Ücretsiz', placeholder: 'Lokal sunucu (Anahtar gerektirmez)' },
    { id: 'mock', name: 'Mock (Test)', badge: 'Demo', placeholder: 'Test Modu (Anahtar gerektirmez)' },
  ];

  const selectedProviderInfo = providers.find((p) => p.id === provider) || providers[0];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center pt-4 pb-2">
        <div className="inline-flex items-center gap-2 mb-3 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-medium px-3.5 py-1.5">
          <Bot className="w-3.5 h-3.5" /> Otonom Donanım & BOM Ajanı
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-50 tracking-tight">
          Yapay Zeka <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Donanım Ajanı</span>
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto text-xs sm:text-sm mt-2">
          Kendi LLM API anahtarınızı (OpenAI, Gemini, Claude vb.) bağlayarak donanım analizi yapın ve otomatik sepet çıkarın.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Bring Your Own API Key (BYOK) Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl shadow-slate-950/40">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              Bring Your Own API Key (Kendi Anahtarını Getir)
            </h3>
            {keySaved && apiKey.trim() ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" /> Anahtar Kaydedildi
              </span>
            ) : (
              <span className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                Anahtar Bekleniyor
              </span>
            )}
          </div>

          {/* Provider Choice Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {providers.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setProvider(p.id);
                  setKeySaved(false);
                }}
                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between gap-1 transition-all ${
                  provider === p.id
                    ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="text-[11px] font-bold truncate">{p.name}</div>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 w-fit">
                  {p.badge}
                </span>
              </button>
            ))}
          </div>

          {/* API Key Input Field (Hidden for Mock & Ollama) */}
          {provider !== 'mock' && provider !== 'ollama' ? (
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>{selectedProviderInfo.name} API Anahtarı:</span>
                <span className="text-[10px] text-slate-500 font-normal">Tarayıcınızda güvenle saklanır</span>
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setKeySaved(false);
                  }}
                  placeholder={selectedProviderInfo.placeholder}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-24 py-2.5 text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200"
                    title={showApiKey ? 'Gizle' : 'Göster'}
                  >
                    {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  {apiKey && (
                    <button
                      type="button"
                      onClick={handleClearKey}
                      className="text-[10px] text-rose-400 hover:underline px-1.5"
                    >
                      Sil
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
              {provider === 'ollama'
                ? 'ℹ️ Ollama lokal bilgisayarınızda (http://localhost:11434) çalışır. API anahtarı gerekmez.'
                : 'ℹ️ Mock modu önceden tanımlanmış test donanım çıktıları üretir. API anahtarı gerekmez.'}
            </div>
          )}
        </div>

        {/* Project Description Form */}
        <form onSubmit={handleAnalyze} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-400" /> Proje Açıklaması veya İhtiyaç Tarifi:
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Örn: ESP32 kullanarak 4 kanallı röle kartı ve OLED ekranlı akıllı röle kontrol panosu yapmak istiyorum..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Proje Türü:</span>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-slate-300 focus:outline-none"
              >
                <option value="IoT / Akıllı Ev">IoT / Akıllı Ev</option>
                <option value="Robotik / Mechatronics">Robotik / Mechatronics</option>
                <option value="Gömülü Sistemler">Gömülü Sistemler</option>
                <option value="3D Yazıcı / CNC">3D Yazıcı / CNC</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Analiz Et ({selectedProviderInfo.name})
            </button>
          </div>
        </form>

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Response Data */}
        {response && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Donanım Analiz Çıktısı ({response.data?.provider || provider})
              </h3>
              {response.data?.byok_active && (
                <span className="text-[10px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded">
                  BYOK Anahtarı İle Çalıştırıldı
                </span>
              )}
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-300 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> {response.message}
              </div>

              {response.data?.report_summary && (
                <div className="prose prose-invert max-w-none text-slate-300 text-xs leading-relaxed border-t border-slate-850 pt-3">
                  <pre className="whitespace-pre-wrap font-sans bg-transparent p-0">
                    {response.data.report_summary}
                  </pre>
                </div>
              )}

              <details className="pt-2 border-t border-slate-850">
                <summary className="text-[11px] text-slate-500 cursor-pointer hover:text-slate-300">
                  Ham JSON Çıktısı
                </summary>
                <pre className="text-[11px] font-mono text-slate-400 whitespace-pre-wrap overflow-x-auto pt-2">
                  {JSON.stringify(response.data || response, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
