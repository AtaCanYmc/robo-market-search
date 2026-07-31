import React, { useState, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  Cpu,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Key,
  Eye,
  EyeOff,
  ShieldCheck,
  PackageCheck,
  Zap,
  ShoppingBag,
  FileText,
  ExternalLink,
  Layers,
  Info,
  Check,
} from 'lucide-react';
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
  const [activeResultTab, setActiveResultTab] = useState<'bom' | 'requirements' | 'compatibility' | 'cart' | 'report'>('bom');

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
      handleSaveKey();
      const res = await api.analyzeAgent(prompt, projectType, apiKey.trim() || undefined, provider);
      setResponse(res);
      setActiveResultTab('bom');
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

  // Helper parsers for response data
  const data = response?.data || {};
  const reqs = data.requirements || {};
  const bomData = data.bom || {};
  const componentsList = bomData.components || [];
  const compReport = data.compatibility || {};
  const optResult = data.optimization || {};
  const storeGroups = optResult.store_groups || [];
  const markdownReport = data.report_summary || '';

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
          Proje fikrinizi tarif edin, Yapay Zeka gereksinimleri çıkarsın, BOM listesi hazırlasın ve marketlerden sepete eklesin.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
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

          {/* API Key Input Field */}
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

        {/* Structured Visual Agent Results UI */}
        {response && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-6 shadow-2xl">
            {/* Header Status */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-slate-800">
              <div>
                <h3 className="font-extrabold text-slate-100 text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  Yapay Zeka Donanım Analiz Sonuçları
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sağlayıcı: <span className="text-cyan-300 font-semibold">{data.provider || provider}</span>
                  {data.byok_active && ' • (Kullanıcı API Key Aktif)'}
                </p>
              </div>

              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4" /> Analiz Başarıyla Tamamlandı
              </div>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-800 pb-2 overflow-x-auto">
              {[
                { id: 'bom', label: '📦 Malzeme Listesi (BOM)', count: componentsList.length },
                { id: 'requirements', label: '📋 Proje İhtiyaçları' },
                { id: 'compatibility', label: '⚡ Donanım Uyumluluğu' },
                { id: 'cart', label: '🛒 Sepet & Mağazalar', count: storeGroups.length },
                { id: 'report', label: '📝 Rapor Özeti' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveResultTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeResultTab === tab.id
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* TAB 1: BOM List Card View */}
            {activeResultTab === 'bom' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Proje: <strong className="text-slate-200">{bomData.project_name || 'Donanım Projesi'}</strong></span>
                  {bomData.notes && <span className="text-slate-500 text-[11px]">{bomData.notes}</span>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {componentsList.map((comp: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-slate-950/70 border border-slate-800 hover:border-slate-700/80 rounded-xl p-4 flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                            {comp.category || 'Bileşen'}
                          </span>
                          <h4 className="font-bold text-slate-100 text-sm mt-1.5">{comp.name}</h4>
                        </div>
                        <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 border border-slate-700">
                          x{comp.quantity || 1}
                        </span>
                      </div>

                      <div className="text-xs text-slate-400 flex items-center justify-between border-t border-slate-850 pt-2">
                        <span className="text-[11px]">{comp.specifications || 'Standart Spesifikasyon'}</span>
                        {comp.is_optional && (
                          <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                            Opsiyonel
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: Requirements View */}
            {activeResultTab === 'requirements' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
                    <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-blue-400" /> Proje Türü & Hedef
                    </div>
                    <p className="text-slate-200 font-bold text-sm">{reqs.project_type || 'Belirtilmedi'}</p>
                    <p className="text-slate-400 leading-relaxed">{reqs.description || 'Açıklama bulunamadı.'}</p>
                  </div>

                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-400" /> Güç & Bağlantı
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-medium text-xs">
                        ⚡ {reqs.power_source || 'Varsayılan Güç'}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-medium text-xs">
                        📶 {reqs.wireless_protocol || 'Kablolu / Seri'}
                      </span>
                    </div>
                  </div>
                </div>

                {reqs.key_features && reqs.key_features.length > 0 && (
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
                    <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-400" /> Temel Fonksiyonel Özellikler
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {reqs.key_features.map((feat: string, i: number) => (
                        <span key={i} className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Compatibility View */}
            {activeResultTab === 'compatibility' && (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
                    compReport.is_compatible !== false
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <ShieldCheck className="w-5 h-5" />
                    {compReport.is_compatible !== false
                      ? 'Tüm Parçalar Birbiriyle Elektriksel & Donanımsal Olarak Uyumlu'
                      : 'Donanım Uyumsuzluk Uyarısı Tespit Edildi'}
                  </div>
                </div>

                {compReport.issues && compReport.issues.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-slate-300">Tespit Edilen Uyumluluk Uvarıları & Çözümler:</h4>
                    {compReport.issues.map((issue: any, i: number) => (
                      <div key={i} className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-400 uppercase text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                            {issue.severity || 'Uyarı'}
                          </span>
                          <span className="text-slate-400 text-[11px]">
                            Etkilenen: {issue.affected_components?.join(', ')}
                          </span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{issue.description}</p>
                        <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] flex items-start gap-2">
                          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                          <div>
                            <strong>Önerilen Çözüm:</strong> {issue.suggested_fix}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Cart & Stores View */}
            {activeResultTab === 'cart' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center justify-between text-xs">
                  <div>
                    <div className="text-slate-400 text-[11px]">En Optimal Alışveriş Stratejisi</div>
                    <div className="text-lg font-extrabold text-cyan-300">
                      {optResult.strategy || 'Bölünmüş Sepet Alışverişi'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-400 text-[11px]">Tahmini Genel Toplam</div>
                    <div className="text-xl font-extrabold text-emerald-400">
                      {optResult.grand_total ? `${optResult.grand_total.toFixed(2)} TL` : 'Hesaplandı'}
                    </div>
                  </div>
                </div>

                {storeGroups.map((group: any, i: number) => (
                  <div key={i} className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="font-bold text-slate-100 text-sm flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-cyan-400" />
                        {group.store} Mağaza Sepeti
                      </span>
                      <span className="font-bold text-emerald-400 text-sm">
                        {group.total ? `${group.total.toFixed(2)} TL` : ''}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {group.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 text-xs">
                          <div>
                            <span className="font-semibold text-slate-200">{item.product_name}</span>
                            <span className="text-[10px] text-slate-500 ml-2">(x{item.quantity})</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-cyan-300">{item.total_price?.toFixed(2)} TL</span>
                            {item.url && (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 text-slate-400 hover:text-cyan-400"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 5: Report Summary View */}
            {activeResultTab === 'report' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-300">Yapay Zeka Markdown Özeti:</h4>
                  <button
                    onClick={() => navigator.clipboard.writeText(markdownReport)}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" /> Raporu Kopyala
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap overflow-x-auto">
                  {markdownReport || 'Rapor özeti bulunamadı.'}
                </div>
              </div>
            )}

            {/* Developer Raw JSON Accordion Drawer */}
            <details className="pt-3 border-t border-slate-800">
              <summary className="text-[11px] text-slate-500 cursor-pointer hover:text-slate-300">
                Geliştirici İnceleme: Ham JSON Yanıtı
              </summary>
              <pre className="text-[11px] font-mono text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-850 whitespace-pre-wrap overflow-x-auto mt-2">
                {JSON.stringify(response.data || response, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};
