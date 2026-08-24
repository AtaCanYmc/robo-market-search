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
  Zap,
  ShoppingBag,
  FileText,
  ExternalLink,
  Layers,
  Info,
  Check,
  Terminal,
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

  const [executionLogs, setExecutionLogs] = useState<string[]>([]);

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

  const addLog = (msg: string) => {
    const time = new Date().toISOString().split('T')[1].slice(0, 8);
    setExecutionLogs((prev) => [...prev, `[${time}] ${msg}`]);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setExecutionLogs([]);

    addLog('INITIATING AUTONOMOUS SOURCING ENGINE...');
    addLog(`SELECTED LLM PROVIDER: ${provider.toUpperCase()}`);
    addLog('CONNECTING TO VENDOR API CLUSTERS (ROBOTISTAN, ROBOLINK, ROBO90, DIRENCNET)...');
    addLog('PARSING BOM (BILL OF MATERIALS) CONSTRAINTS...');

    try {
      handleSaveKey();
      const res = await api.analyzeAgent(prompt, projectType, apiKey.trim() || undefined, provider);
      addLog('BOM CONSTRAINTS PARSED SUCCESSFULLY.');
      addLog('HARDWARE COMPATIBILITY MATRIX GENERATED.');
      addLog('OPTIMIZING UNIT PRICE & STOCK MATRICES.');
      setResponse(res);
      setActiveResultTab('bom');
    } catch (err: any) {
      addLog(`ENGINE EXECUTION ERROR: ${err.message}`);
      setError(err.message || 'Yapay Zeka ajanı yanıt veremedi. Lütfen API anahtarınızı ve sağlayıcıyı kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  const providers = [
    { id: 'openai', name: 'OpenAI (GPT-4o)', badge: 'STANDARD', placeholder: 'sk-proj-...' },
    { id: 'gemini', name: 'Google Gemini', badge: 'RECOMMENDED', placeholder: 'AIzaSy...' },
    { id: 'anthropic', name: 'Anthropic Claude', badge: 'INTELLIGENT', placeholder: 'sk-ant-api...' },
    { id: 'deepseek', name: 'DeepSeek', badge: 'FAST', placeholder: 'sk-...' },
    { id: 'groq', name: 'Groq (Llama 3)', badge: 'HIGH SPEED', placeholder: 'gsk_...' },
    { id: 'ollama', name: 'Ollama (Local)', badge: 'LOCAL', placeholder: 'Local Server (No Key Required)' },
    { id: 'mock', name: 'Mock Engine', badge: 'DEMO', placeholder: 'Test Mode (No Key Required)' },
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
      <div className="text-center pt-2 pb-1 space-y-1.5 font-mono">
        <div className="inline-flex items-center gap-1.5 bg-blue-600/10 border border-blue-500/30 rounded px-2.5 py-1 text-blue-400 text-xs font-mono uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" /> {t('agentTitle')}
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900 uppercase tracking-tight">
          {t('agentTitle')}
        </h1>
        <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 max-w-xl mx-auto text-xs font-sans">
          {t('agentSubtitle')}
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4 font-mono">
        {/* Bring Your Own API Key (BYOK) Card */}
        <div className="bg-[#131822] dark:bg-[#131822] light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-lg p-4 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-200 dark:text-slate-200 light:text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-400" />
              {t('byokTitle')}
            </h3>
            {keySaved && apiKey.trim() ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                <ShieldCheck className="w-3 h-3" /> {t('saved')}
              </span>
            ) : (
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
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
                className={`p-2 rounded border text-left flex flex-col justify-between gap-1 transition-all cursor-pointer ${
                  provider === p.id
                    ? 'bg-blue-600/20 text-blue-400 dark:text-blue-300 light:text-blue-700 border-blue-500/60 font-bold'
                    : 'bg-[#0B0F17] dark:bg-[#0B0F17] light:bg-slate-100 border-slate-800 dark:border-slate-800 light:border-slate-300 text-slate-400 dark:text-slate-400 light:text-slate-600'
                }`}
              >
                <div className="text-[11px] truncate">{p.name}</div>
                <span className="text-[9px] px-1 py-0.2 rounded bg-slate-900 dark:bg-slate-900 light:bg-slate-200 text-slate-500 w-fit">
                  {p.badge}
                </span>
              </button>
            ))}
          </div>

          {/* API Key Input Field */}
          {provider !== 'mock' && provider !== 'ollama' ? (
            <div className="space-y-1.5 pt-2 border-t border-slate-800 dark:border-slate-800 light:border-slate-200">
              <label className="text-[11px] font-bold text-slate-300 dark:text-slate-300 light:text-slate-700 flex items-center justify-between">
                <span>{selectedProviderInfo.name} API KEY:</span>
                <span className="text-[10px] text-slate-500 font-normal">{t('encryptedNotice')}</span>
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
                  className="w-full bg-[#0B0F17] dark:bg-[#0B0F17] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-300 rounded pl-3 pr-24 py-2 text-xs font-mono text-slate-100 dark:text-slate-100 light:text-slate-900 placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="p-1 text-slate-400 hover:text-slate-200"
                    title={showApiKey ? 'Hide' : 'Show'}
                  >
                    {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  {apiKey && (
                    <button
                      type="button"
                      onClick={handleClearKey}
                      className="text-[10px] text-rose-400 hover:underline px-1"
                    >
                      {t('clear')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-2.5 rounded bg-[#0B0F17] dark:bg-[#0B0F17] light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300 text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600">
              {provider === 'ollama'
                ? 'ℹ️ Ollama runs locally on your environment (http://localhost:11434). No API key needed.'
                : 'ℹ️ Mock engine mode runs with predefined hardware simulation data. No API key needed.'}
            </div>
          )}
        </div>

        {/* Project Description Form */}
        <form onSubmit={handleAnalyze} className="bg-[#131822] dark:bg-[#131822] light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-lg p-4 space-y-3 font-mono shadow-lg">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 dark:text-slate-300 light:text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-400" /> {t('projectSpec')}
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t('projectSpecPlaceholder')}
              className="w-full bg-[#0B0F17] dark:bg-[#0B0F17] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-300 rounded p-3 text-xs text-slate-100 dark:text-slate-100 light:text-slate-900 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">
              <span>{t('projectDomain')}</span>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="bg-[#0B0F17] dark:bg-[#0B0F17] light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300 rounded px-2.5 py-1 text-slate-300 dark:text-slate-300 light:text-slate-800 focus:outline-none font-mono text-xs"
              >
                <option value="IoT / Akıllı Ev">IoT / Smart Automation</option>
                <option value="Robotik / Mechatronics">Robotics / Mechatronics</option>
                <option value="Gömülü Sistemler">Embedded Electronics</option>
                <option value="3D Yazıcı / CNC">CNC / Additive Manufacturing</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded transition-all disabled:opacity-50 shadow cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {t('runAudit')} ({selectedProviderInfo.name})
            </button>
          </div>
        </form>

        {/* Real-time Terminal Execution Log */}
        {executionLogs.length > 0 && (
          <div className="bg-[#0B0F17] dark:bg-[#0B0F17] light:bg-slate-900 border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-blue-400 space-y-1 shadow-inner">
            <div className="text-[10px] text-slate-500 border-b border-slate-850 pb-1 mb-1 font-bold flex items-center gap-1">
              <Terminal className="w-3 h-3 text-slate-400" /> {t('auditLogs')}
            </div>
            {executionLogs.map((log, i) => (
              <div key={i} className="leading-tight">{log}</div>
            ))}
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Structured Visual Agent Results UI */}
        {response && (
          <div className="bg-[#131822] dark:bg-[#131822] light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-lg p-5 space-y-5 shadow-2xl">
            {/* Header Status */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800 dark:border-slate-800 light:border-slate-200 font-mono">
              <div>
                <h3 className="font-extrabold text-slate-100 dark:text-slate-100 light:text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  TECHNICAL HARDWARE AUDIT REPORT
                </h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600 mt-0.5">
                  LLM ENGINE PROVIDER: <span className="text-blue-400 dark:text-blue-300 light:text-blue-600 font-bold">{data.provider || provider}</span>
                  {data.byok_active && ' • (USER API KEY ACTIVE)'}
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3 py-1 rounded">
                <CheckCircle2 className="w-4 h-4" /> {t('auditCompleted')}
              </div>
            </div>

            {/* Sub-Navigation Tabs */}
            <div className="flex items-center gap-1 border-b border-slate-800 dark:border-slate-800 light:border-slate-200 pb-2 overflow-x-auto font-mono">
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
                  className={`px-3 py-1.5 rounded text-xs font-mono font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeResultTab === tab.id
                      ? 'bg-blue-600/20 text-blue-400 dark:text-blue-300 light:text-blue-700 border border-blue-500/40 shadow-sm'
                      : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:bg-slate-800/40'
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0B0F17] dark:bg-[#0B0F17] light:bg-slate-200 text-slate-300 dark:text-slate-300 light:text-slate-700 font-mono">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* TAB 1: BOM List Table View */}
            {activeResultTab === 'bom' && (
              <div className="space-y-3 font-mono">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>PROJECT IDENTIFIER: <strong className="text-slate-200 dark:text-slate-200 light:text-slate-800">{bomData.project_name || 'INDUSTRIAL HARDWARE AUDIT'}</strong></span>
                  {bomData.notes && <span className="text-slate-500 text-[11px]">{bomData.notes}</span>}
                </div>

                <div className="overflow-x-auto border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded bg-[#0B0F17] dark:bg-[#0B0F17] light:bg-white">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#131822] dark:bg-[#131822] light:bg-slate-100 border-b border-slate-800 dark:border-slate-800 light:border-slate-200 text-[10px] text-slate-400 dark:text-slate-400 light:text-slate-600 uppercase tracking-wider">
                        <th className="py-2 px-3 font-bold">Category</th>
                        <th className="py-2 px-3 font-bold">Component Name</th>
                        <th className="py-2 px-3 font-bold">Technical Specifications</th>
                        <th className="py-2 px-3 font-bold text-center">Qty</th>
                        <th className="py-2 px-3 font-bold text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850 dark:divide-slate-850 light:divide-slate-200">
                      {componentsList.map((comp: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-2 px-3">
                            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-600/10 text-blue-400 dark:text-blue-300 light:text-blue-700 border border-blue-500/20">
                              {comp.category || 'BOM'}
                            </span>
                          </td>
                          <td className="py-2 px-3 font-semibold text-slate-100 dark:text-slate-100 light:text-slate-900 font-sans">{comp.name}</td>
                          <td className="py-2 px-3 text-slate-400 dark:text-slate-400 light:text-slate-600 text-[11px] font-sans">{comp.specifications || 'Standard Industrial Specification'}</td>
                          <td className="py-2 px-3 text-center font-bold text-blue-400 dark:text-blue-400 light:text-blue-600">x{comp.quantity || 1}</td>
                          <td className="py-2 px-3 text-center">
                            {comp.is_optional ? (
                              <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">OPTIONAL</span>
                            ) : (
                              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">REQUIRED</span>
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
              <div className="space-y-3 font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#0B0F17] dark:bg-[#0B0F17] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded p-3.5 space-y-2">
                    <div className="font-bold text-slate-300 dark:text-slate-300 light:text-slate-700 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                      <Layers className="w-3.5 h-3.5 text-blue-400" /> DOMAIN & TARGET SCOPE
                    </div>
                    <p className="text-slate-100 dark:text-slate-100 light:text-slate-900 font-bold text-xs">{reqs.project_type || 'Unspecified'}</p>
                    <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 leading-relaxed font-sans text-xs">{reqs.description || 'No description provided.'}</p>
                  </div>

                  <div className="bg-[#0B0F17] dark:bg-[#0B0F17] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded p-3.5 space-y-2">
                    <div className="font-bold text-slate-300 dark:text-slate-300 light:text-slate-700 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> POWER & INTERFACE PROTOCOLS
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <span className="px-2 py-1 rounded bg-[#131822] dark:bg-[#131822] light:bg-slate-200 border border-slate-800 dark:border-slate-800 light:border-slate-300 text-amber-400 dark:text-amber-300 light:text-amber-700 text-xs">
                        POWER: {reqs.power_source || 'Standard Rail'}
                      </span>
                      <span className="px-2 py-1 rounded bg-[#131822] dark:bg-[#131822] light:bg-slate-200 border border-slate-800 dark:border-slate-800 light:border-slate-300 text-blue-400 dark:text-blue-300 light:text-blue-700 text-xs">
                        PROTOCOL: {reqs.wireless_protocol || 'Serial / Bus'}
                      </span>
                    </div>
                  </div>
                </div>

                {reqs.key_features && reqs.key_features.length > 0 && (
                  <div className="bg-[#0B0F17] dark:bg-[#0B0F17] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded p-3.5 space-y-2 text-xs">
                    <div className="font-bold text-slate-300 dark:text-slate-300 light:text-slate-700 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> VERIFIED FUNCTIONAL CONSTRAINTS
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1 font-sans">
                      {reqs.key_features.map((feat: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 rounded bg-[#131822] dark:bg-[#131822] light:bg-slate-200 border border-slate-800 dark:border-slate-800 light:border-slate-300 text-slate-300 dark:text-slate-300 light:text-slate-800 text-xs">
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
              <div className="space-y-3 font-mono">
                <div
                  className={`p-3.5 rounded border flex items-center justify-between text-xs ${
                    compReport.is_compatible !== false
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    {compReport.is_compatible !== false
                      ? 'ELECTRICAL & BUS INTERFACE COMPATIBILITY VERIFIED'
                      : 'HARDWARE INTERFACE CONFLICT DETECTED'}
                  </div>
                </div>

                {compReport.issues && compReport.issues.length > 0 && (
                  <div className="space-y-2 font-sans">
                    <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">COMPATIBILITY ISSUES & ENGINEERING FIXES:</h4>
                    {compReport.issues.map((issue: any, i: number) => (
                      <div key={i} className="bg-[#0B0F17] dark:bg-[#0B0F17] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded p-3.5 text-xs space-y-2">
                        <div className="flex items-center justify-between font-mono">
                          <span className="font-bold text-amber-400 uppercase text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                            {issue.severity || 'WARNING'}
                          </span>
                          <span className="text-slate-400 text-[11px]">
                            AFFECTED MPNs: {issue.affected_components?.join(', ')}
                          </span>
                        </div>
                        <p className="text-slate-300 dark:text-slate-300 light:text-slate-800 leading-relaxed text-xs">{issue.description}</p>
                        <div className="p-2.5 rounded bg-blue-600/10 border border-blue-500/20 text-blue-400 dark:text-blue-300 light:text-blue-700 text-[11px] font-mono flex items-start gap-2">
                          <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                          <div>
                            <strong>RECOMMENDED ENGINEERING FIX:</strong> {issue.suggested_fix}
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
              <div className="space-y-3 font-mono">
                <div className="p-3.5 rounded bg-[#0B0F17] dark:bg-[#0B0F17] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 text-xs flex items-center justify-between">
                  <div>
                    <div className="text-slate-500 text-[10px] uppercase tracking-wider">PROCUREMENT ALLOCATION STRATEGY</div>
                    <div className="text-sm font-bold text-blue-400 dark:text-blue-300 light:text-blue-700 uppercase">
                      {optResult.strategy || 'SPLIT-VENDOR ALLOCATION'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-500 text-[10px] uppercase tracking-wider">ESTIMATED TOTAL GRAND COST</div>
                    <div className="text-base font-bold text-emerald-400">
                      {optResult.grand_total ? `${optResult.grand_total.toFixed(2)} TL` : 'CALCULATED'}
                    </div>
                  </div>
                </div>

                {storeGroups.map((group: any, i: number) => (
                  <div key={i} className="bg-[#0B0F17] dark:bg-[#0B0F17] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded p-3.5 space-y-2 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 dark:border-slate-800 light:border-slate-200">
                      <span className="font-bold text-slate-100 dark:text-slate-100 light:text-slate-900 text-xs uppercase flex items-center gap-2">
                        <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
                        {group.store} ALLOCATION BASKET
                      </span>
                      <span className="font-bold text-emerald-400 text-xs">
                        {group.total ? `${group.total.toFixed(2)} TL` : ''}
                      </span>
                    </div>

                    <div className="space-y-1.5 font-sans">
                      {group.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded bg-[#131822] dark:bg-[#131822] light:bg-white border border-slate-850 dark:border-slate-850 light:border-slate-200 text-xs font-mono">
                          <div>
                            <span className="font-semibold text-slate-200 dark:text-slate-200 light:text-slate-900">{item.product_name}</span>
                            <span className="text-[10px] text-slate-500 ml-2">(x{item.quantity})</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-blue-400 dark:text-blue-400 light:text-blue-600">{item.total_price?.toFixed(2)} TL</span>
                            {item.url && (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 text-slate-400 hover:text-blue-300"
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
              <div className="space-y-2 font-mono">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">ENGINEERING AUDIT SUMMARY (MARKDOWN):</h4>
                  <button
                    onClick={() => navigator.clipboard.writeText(markdownReport)}
                    className="text-xs text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" /> COPY REPORT
                  </button>
                </div>

                <div className="p-3.5 rounded bg-[#0B0F17] dark:bg-[#0B0F17] light:bg-slate-50 border border-slate-800 dark:border-slate-800 light:border-slate-200 text-xs text-slate-300 dark:text-slate-300 light:text-slate-800 leading-relaxed font-mono whitespace-pre-wrap overflow-x-auto">
                  {markdownReport || 'No markdown report summary available.'}
                </div>
              </div>
            )}

            {/* Developer Raw JSON Accordion Drawer */}
            <details className="pt-2 border-t border-slate-800 font-mono">
              <summary className="text-[10px] text-slate-500 cursor-pointer hover:text-slate-300 uppercase tracking-wider">
                {t('rawJson')}
              </summary>
              <pre className="text-[11px] font-mono text-slate-400 bg-[#0B0F17] dark:bg-[#0B0F17] light:bg-slate-100 p-3 rounded border border-slate-800 dark:border-slate-800 light:border-slate-200 whitespace-pre-wrap overflow-x-auto mt-2">
                {JSON.stringify(response.data || response, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};
