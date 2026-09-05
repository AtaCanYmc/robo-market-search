import React, { useState, useEffect } from 'react';
import {
  Send,
  Cpu,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Key,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  ShoppingBag,
  FileText,
  ExternalLink,
  Layers,
  Info,
  Check,
  Copy,
} from 'lucide-react';
import { api } from '../services/api';
import { useTheme } from '../context/ThemeContext';

export const AgentTab: React.FC = () => {
  const { t } = useTheme();
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
  const [copiedReport, setCopiedReport] = useState(false);

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

  const handleCopyReport = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
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
      setError(err.message || 'Yapay zeka ajanı yanıt veremedi. Lütfen API anahtarınızı ve sağlayıcıyı kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  const providers = [
    { id: 'openai', name: 'OpenAI (GPT-4o)', badge: 'STANDART', placeholder: 'sk-proj-...' },
    { id: 'gemini', name: 'Google Gemini', badge: 'ÖNERİLEN', placeholder: 'AIzaSy...' },
    { id: 'anthropic', name: 'Claude', badge: 'GELİŞMİŞ', placeholder: 'sk-ant-api...' },
    { id: 'deepseek', name: 'DeepSeek', badge: 'HIZLI', placeholder: 'sk-...' },
    { id: 'groq', name: 'Groq (Llama 3)', badge: 'ULTRA HIZ', placeholder: 'gsk_...' },
    { id: 'ollama', name: 'Ollama', badge: 'YEREL', placeholder: 'Yerel Sunucu (Anahtar Gerekmez)' },
    { id: 'mock', name: 'Test Modu', badge: 'DEMO', placeholder: 'Test Modu (Anahtar Gerekmez)' },
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
    <div className="space-y-6 font-sans">
      {/* Title Header */}
      <div className="text-center pt-2 pb-1 space-y-1.5">
        <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 rounded px-2.5 py-1 text-blue-600 dark:text-blue-400 text-xs font-medium">
          <Zap className="w-3.5 h-3.5" /> {t('agentTitle')}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {t('agentTitle')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-xs sm:text-sm">
          {t('agentSubtitle')}
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {/* Bring Your Own API Key (BYOK) Card */}
        <div className="bg-white dark:bg-[#131822] border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-500" />
              {t('byokTitle')}
            </h3>
            {keySaved && apiKey.trim() ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 px-2 py-0.5 rounded">
                <ShieldCheck className="w-3 h-3" /> {t('saved')}
              </span>
            ) : (
              <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 px-2 py-0.5 rounded">
                {t('keyRequired')}
              </span>
            )}
          </div>

          {/* Provider Choice Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {providers.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setProvider(p.id);
                  setKeySaved(false);
                }}
                className={`p-2.5 rounded border text-left flex flex-col justify-between gap-1.5 transition-colors cursor-pointer ${
                  provider === p.id
                    ? 'bg-blue-50 dark:bg-blue-600/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-500/60 font-semibold'
                    : 'bg-slate-50 dark:bg-[#0B0F17] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="text-xs truncate font-medium">{p.name}</div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 w-fit">
                  {p.badge}
                </span>
              </button>
            ))}
          </div>

          {/* API Key Input Field */}
          {provider !== 'mock' && provider !== 'ollama' ? (
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>{selectedProviderInfo.name} API Anahtarı:</span>
                <span className="text-[11px] text-slate-500 font-normal">{t('encryptedNotice')}</span>
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
                  className="w-full bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded pl-3 pr-24 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    title={showApiKey ? 'Gizle' : 'Göster'}
                  >
                    {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  {apiKey && (
                    <button
                      type="button"
                      onClick={handleClearKey}
                      className="text-xs text-rose-500 hover:underline px-1 cursor-pointer"
                    >
                      {t('clear')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-2.5 rounded bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              {provider === 'ollama'
                ? 'ℹ️ Ollama yerel ortamınızda çalışır (http://localhost:11434). API anahtarı gerekmez.'
                : 'ℹ️ Test modunda simüle edilmiş donanım verileri kullanılır. API anahtarı gerekmez.'}
            </div>
          )}
        </div>

        {/* Project Description Form */}
        <form onSubmit={handleAnalyze} className="bg-white dark:bg-[#131822] border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-3 shadow-sm">
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-500" /> {t('projectSpec')}
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t('projectSpecPlaceholder')}
              className="w-full bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded p-3 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <span>{t('projectDomain')}:</span>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none text-xs"
              >
                <option value="IoT / Akıllı Ev">IoT / Akıllı Ev</option>
                <option value="Robotik / Mechatronics">Robotik & Mekatronik</option>
                <option value="Gömülü Sistemler">Gömülü Sistemler</option>
                <option value="3D Yazıcı / CNC">3D Yazıcı & CNC</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-5 py-2.5 rounded transition-all disabled:opacity-50 shadow-sm cursor-pointer whitespace-nowrap"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {t('runAudit')} ({selectedProviderInfo.name})
            </button>
          </div>
        </form>

        {/* Error Notification */}
        {error && (
          <div className="p-3.5 rounded bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Structured Results UI */}
        {response && (
          <div className="bg-white dark:bg-[#131822] border border-slate-200 dark:border-slate-800 rounded-lg p-4 sm:p-5 space-y-4 shadow-sm">
            {/* Header Status */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-500" />
                  Donanım Analiz Raporu
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Sağlayıcı: <span className="text-blue-600 dark:text-blue-400 font-semibold">{data.provider || provider}</span>
                  {data.byok_active && ' • (Kullanıcı Anahtarı Aktif)'}
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold px-3 py-1 rounded">
                <CheckCircle2 className="w-4 h-4" /> {t('auditCompleted')}
              </div>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-100 dark:border-slate-800 pb-2 overflow-x-auto">
              {[
                { id: 'bom', label: t('tabBom'), count: componentsList.length },
                { id: 'requirements', label: t('tabRequirements') },
                { id: 'compatibility', label: t('tabCompatibility') },
                { id: 'cart', label: t('tabCart'), count: storeGroups.length },
                { id: 'report', label: t('tabReport') },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveResultTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeResultTab === tab.id
                      ? 'bg-blue-50 dark:bg-blue-600/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/40 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-[#0B0F17] text-slate-700 dark:text-slate-300 font-mono">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* TAB 1: BOM List Table View */}
            {activeResultTab === 'bom' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 flex-wrap gap-2">
                  <span>Proje: <strong className="text-slate-800 dark:text-slate-200">{bomData.project_name || 'Donanım Listesi'}</strong></span>
                  {bomData.notes && <span className="text-slate-500 text-xs">{bomData.notes}</span>}
                </div>

                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-[#0B0F17]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-[#131822] border-b border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 font-semibold">
                        <th className="py-2.5 px-3">Kategori</th>
                        <th className="py-2.5 px-3">Bileşen Adı</th>
                        <th className="py-2.5 px-3">Teknik Özellikler</th>
                        <th className="py-2.5 px-3 text-center">Adet</th>
                        <th className="py-2.5 px-3 text-center">Durum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {componentsList.map((comp: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="py-2 px-3">
                            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-600/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20">
                              {comp.category || 'BOM'}
                            </span>
                          </td>
                          <td className="py-2 px-3 font-medium text-slate-900 dark:text-slate-100">{comp.name}</td>
                          <td className="py-2 px-3 text-slate-600 dark:text-slate-400 text-xs">{comp.specifications || 'Standart Spesifikasyon'}</td>
                          <td className="py-2 px-3 text-center font-bold text-blue-600 dark:text-blue-400 font-mono">x{comp.quantity || 1}</td>
                          <td className="py-2 px-3 text-center">
                            {comp.is_optional ? (
                              <span className="text-[10px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-1.5 py-0.5 rounded font-medium">Opsiyonel</span>
                            ) : (
                              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-1.5 py-0.5 rounded font-medium">Zorunlu</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: Requirements View */}
            {activeResultTab === 'requirements' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded p-3.5 space-y-2">
                    <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 text-xs">
                      <Layers className="w-3.5 h-3.5 text-blue-500" /> Proje Kapsamı
                    </div>
                    <p className="text-slate-900 dark:text-slate-100 font-semibold text-xs">{reqs.project_type || 'Belirtilmedi'}</p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">{reqs.description || 'Açıklama girilmedi.'}</p>
                  </div>

                  <div className="bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded p-3.5 space-y-2">
                    <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 text-xs">
                      <Zap className="w-3.5 h-3.5 text-amber-500" /> Güç & Protokol Gereksinimleri
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="px-2 py-1 rounded bg-slate-100 dark:bg-[#131822] border border-slate-200 dark:border-slate-800 text-amber-700 dark:text-amber-300 text-xs font-mono">
                        Güç: {reqs.power_source || 'Standart Hat'}
                      </span>
                      <span className="px-2 py-1 rounded bg-slate-100 dark:bg-[#131822] border border-slate-200 dark:border-slate-800 text-blue-700 dark:text-blue-300 text-xs font-mono">
                        Protokol: {reqs.wireless_protocol || 'Seri / Bus'}
                      </span>
                    </div>
                  </div>
                </div>

                {reqs.key_features && reqs.key_features.length > 0 && (
                  <div className="bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded p-3.5 space-y-2 text-xs">
                    <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 text-xs">
                      <Check className="w-3.5 h-3.5 text-emerald-500" /> Temel Fonksiyonel Özellikler
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {reqs.key_features.map((feat: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 rounded bg-slate-100 dark:bg-[#131822] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs">
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
              <div className="space-y-3">
                <div
                  className={`p-3.5 rounded border flex items-center justify-between text-xs ${
                    compReport.is_compatible !== false
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                      : 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    {compReport.is_compatible !== false
                      ? 'Elektriksel ve Haberleşme Uyumluluğu Doğrulandı'
                      : 'Donanım Arabirim Çakışması Algılandı'}
                  </div>
                </div>

                {compReport.issues && compReport.issues.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">Uyumluluk Konuları ve Çözüm Önerileri:</h4>
                    {compReport.issues.map((issue: any, i: number) => (
                      <div key={i} className="bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded p-3.5 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-amber-700 dark:text-amber-400 text-[10px] px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                            {issue.severity || 'UYARI'}
                          </span>
                          <span className="text-slate-500 text-xs font-mono">
                            İlgili Parçalar: {issue.affected_components?.join(', ')}
                          </span>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-xs">{issue.description}</p>
                        <div className="p-2.5 rounded bg-blue-50 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs flex items-start gap-2">
                          <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                          <div>
                            <strong>Önerilen Mühendislik Çözümü:</strong> {issue.suggested_fix}
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
              <div className="space-y-3">
                <div className="p-3.5 rounded bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
                  <div>
                    <div className="text-slate-500 text-[10px] uppercase tracking-wider font-mono">Tedarik Dağıtım Stratejisi</div>
                    <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {optResult.strategy || 'Bölünmüş Tedarikçi Optimizasyonu'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-500 text-[10px] uppercase tracking-wider font-mono">Tahmini Toplam Maliyet</div>
                    <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {optResult.grand_total ? `${optResult.grand_total.toFixed(2)} TL` : 'HESAPLANDI'}
                    </div>
                  </div>
                </div>

                {storeGroups.map((group: any, i: number) => (
                  <div key={i} className="bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 rounded p-3.5 space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-2">
                        <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />
                        {group.store} Sepeti
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-xs">
                        {group.total ? `${group.total.toFixed(2)} TL` : ''}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {group.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded bg-white dark:bg-[#131822] border border-slate-200 dark:border-slate-800 text-xs">
                          <div>
                            <span className="font-medium text-slate-800 dark:text-slate-200">{item.product_name}</span>
                            <span className="text-[11px] text-slate-500 font-mono ml-2">(x{item.quantity})</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-slate-900 dark:text-blue-400 font-mono">{item.total_price?.toFixed(2)} TL</span>
                            {item.url && (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-300"
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
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">Mühendislik Analiz Özeti:</h4>
                  <button
                    onClick={() => handleCopyReport(markdownReport)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedReport ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" /> Kopyalandı!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Raporu Kopyala
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3.5 rounded bg-slate-50 dark:bg-[#0B0F17] border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-mono whitespace-pre-wrap overflow-x-auto">
                  {markdownReport || 'Rapor özeti bulunamadı.'}
                </div>
              </div>
            )}

            {/* Raw JSON Details */}
            <details className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300">
                {t('rawJson')}
              </summary>
              <pre className="text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-[#0B0F17] p-3 rounded border border-slate-200 dark:border-slate-800 whitespace-pre-wrap overflow-x-auto mt-2">
                {JSON.stringify(response.data || response, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};
