import React, { useState } from 'react';
import { Bot, Sparkles, Send, Cpu, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export const AgentTab: React.FC = () => {
  const [prompt, setPrompt] = useState(
    'Toprak nemini ölçen ve WiFi üzerinden bildirim gönderen akıllı bitki sulama sistemi yapmak istiyorum.'
  );
  const [projectType, setProjectType] = useState('IoT / Akıllı Ev');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await api.analyzeAgent(prompt, projectType);
      setResponse(res);
    } catch (err: any) {
      setError(err.message || 'Yapay Zeka ajanı yanıt veremedi (LLM anahtarı gerekiyor olabilir).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center pt-4 pb-2">
        <div className="inline-flex items-center gap-2 mb-3 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-medium px-3.5 py-1.5">
          <Bot className="w-3.5 h-3.5" /> Otonom Donanım & BOM Ajanı
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-50 tracking-tight">
          Yapay Zeka <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Donanım Ajanı</span>
        </h1>
        <p className="text-slate-400 max-w-lg mx-auto text-xs sm:text-sm mt-2">
          Proje fikrinizi doğal dille anlatın, ajan gerekli elektronik parçaları (BOM) çıkarsın ve mağazalardan eşleştirsin.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <form onSubmit={handleAnalyze} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-400" /> Proje Açıklaması veya İhtiyaç Tarifi:
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Örn: Arduino veya ESP32 kullanarak 4 kanallı röle kartı ve OLED ekranlı akıllı röle kontrol panosu yapmak istiyorum..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
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
              Analiz Et ve BOM Üret
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {response && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Ajan Çıktısı & Donanım Analizi
            </h3>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> {response.message}
              </div>
              <pre className="text-[11px] font-mono text-slate-400 whitespace-pre-wrap overflow-x-auto pt-2">
                {JSON.stringify(response.data || response, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
