export type Language = 'tr' | 'en';

export interface Translations {
  // Common / Global
  appName: string;
  appVersion: string;
  appSubtitle: string;
  systemStatus: string;
  systemOnline: string;
  systemOffline: string;
  connecting: string;

  // Nav
  navSearch: string;
  navBatch: string;
  navOptimizer: string;
  navAgent: string;

  // Search Tab
  searchTitle: string;
  searchSubtitle: string;
  searchPlaceholder: string;
  execute: string;
  quickIndex: string;
  vendors: string;
  limit: string;
  sort: string;
  priceLowHigh: string;
  priceHighLow: string;
  nameAZ: string;
  inStockOnly: string;
  logStream: string;
  indexResults: string;
  recordsFound: string;
  tableView: string;
  gridView: string;
  export: string;
  noRecords: string;

  // Table Headers
  thPartTitle: string;
  thSupplier: string;
  thStockStatus: string;
  thUnitPrice: string;
  thAction: string;
  inStock: string;
  outOfStock: string;
  source: string;
  noImage: string;

  // Batch Search Tab
  batchTitle: string;
  batchSubtitle: string;
  batchPlaceholder: string;
  queueMpn: string;
  limitPerVendor: string;
  executeBatch: string;
  queryTarget: string;

  // Cart Optimizer Tab
  cartTitle: string;
  cartSubtitle: string;
  freightTitle: string;
  reset: string;
  editThresholds: string;
  hideSettings: string;
  activeConstraints: string;
  manifestTitle: string;
  addMpnPlaceholder: string;
  add: string;
  optimizeCart: string;
  optimizationSummary: string;
  optimalCost: string;
  freightEvaluated: string;
  freightEvaluatedDesc: string;
  optimizerPrompt: string;

  // Agent Tab
  agentTitle: string;
  agentSubtitle: string;
  byokTitle: string;
  saved: string;
  keyRequired: string;
  encryptedNotice: string;
  clear: string;
  projectSpec: string;
  projectSpecPlaceholder: string;
  projectDomain: string;
  runAudit: string;
  auditLogs: string;
  auditCompleted: string;
  tabBom: string;
  tabRequirements: string;
  tabCompatibility: string;
  tabCart: string;
  tabReport: string;
  rawJson: string;

  // Footer
  footerCopyright: string;
  footerDocs: string;
  footerGithub: string;

  // Server Status Modal
  serverModalTitle: string;
  serverModalSubtitle: string;
  serverModalConnecting: string;
  serverModalConnected: string;
  serverModalAttempt: string;
  serverModalHintCloud: string;
  serverModalHintLocal: string;
  serverModalRetryNow: string;
  serverModalDismiss: string;
  serverModalReopenTooltip: string;
}

export const translations: Record<Language, Translations> = {
  tr: {
    // Common / Global
    appName: "ROBO MARKET SEARCH",
    appVersion: "v1.8 PRO",
    appSubtitle: "Kurumsal Bileşen Tedarik & Donanım Arayüzü",
    systemStatus: "SİSTEM:",
    systemOnline: "ÇEVRİMİÇİ",
    systemOffline: "ÇEVRİMDİŞİ",
    connecting: "BAĞLANIYOR...",

    // Nav
    navSearch: "Küresel Bileşen İndeksi",
    navBatch: "Çoklu MPN Matrisi",
    navOptimizer: "Tedarik Matrisi",
    navAgent: "Otonom Tedarik Ajanı",

    // Search Tab
    searchTitle: "ENDÜSTRİYEL BİLEŞEN TEDARİK MATRİSİ",
    searchSubtitle: "Robotistan, Robolink, Robo90 ve Direnç.net üzerinde eşzamanlı canlı arama.",
    searchPlaceholder: "MPN VEYA PARÇA KODU GİRİN (örn. ESP32-WROOM, STM32F103, RELAY 5V)...",
    execute: "ÇALIŞTIR",
    quickIndex: "HIZLI SORGU:",
    vendors: "TEDARİKÇİLER:",
    limit: "LİMİT:",
    sort: "SIRALAMA:",
    priceLowHigh: "FİYAT: DÜŞÜK ➔ YÜKSEK",
    priceHighLow: "FİYAT: YÜKSEK ➔ DÜŞÜK",
    nameAZ: "BAŞLIK: A ➔ Z",
    inStockOnly: "SADECE STOKTAKİLER",
    logStream: "ÇALIŞMA GÜNLÜĞÜ AKIŞI:",
    indexResults: "İNDEKS SONUÇLARI",
    recordsFound: "KAYIT BULUNDU",
    tableView: "TABLO",
    gridView: "IZGARA",
    export: "DIŞA AKTAR",
    noRecords: "BELİRTİLEN KRİTERLERE UYGUN BİLEŞEN BULUNAMADI.",

    // Table Headers
    thPartTitle: "Parça Tanımı / Açıklama",
    thSupplier: "Tedarikçi",
    thStockStatus: "Stok Durumu",
    thUnitPrice: "Birim Fiyat (TL)",
    thAction: "Eylem",
    inStock: "STOKTA VAR",
    outOfStock: "STOKTA YOK",
    source: "KAYNAK",
    noImage: "Görsel Yok",

    // Batch Search Tab
    batchTitle: "ÇOKLU MPN TOPLU İNDEKSLEYİCİ",
    batchSubtitle: "Birden fazla MPN ekleyin ve tüm donanım tedarikçilerinde paralel aratın.",
    batchPlaceholder: "MPN VEYA PARÇA KODU EKLENİN (örn. LM2596, ESP32-WROOM)...",
    queueMpn: "MPN EKLE",
    limitPerVendor: "TEDARİKÇİ BAŞINA LİMİT:",
    executeBatch: "TOPLU İNDEKSİ ÇALIŞTIR",
    queryTarget: "SORGULANAN MPN:",

    // Cart Optimizer Tab
    cartTitle: "TEDARİK SEPETİ MATRİSİ",
    cartSubtitle: "Tedarikçi kargo sınırlarını ayarlayın ve matematiksel olarak en optimal sepet dağılımını hesaplayın.",
    freightTitle: "TEDARİKÇİ KARGO SINIRLARI VE PARAMETRELERİ",
    reset: "SIFIRLA",
    editThresholds: "LİMİTLERİ DÜZENLE",
    hideSettings: "AYARLARI GİZLE",
    activeConstraints: "AKTİF LİMİTLER:",
    manifestTitle: "TEDARİK PARÇA LİSTESİ",
    addMpnPlaceholder: "PARÇA ADI VEYA MPN GİRİN...",
    add: "EKLE",
    optimizeCart: "SEPET MATRİSİNİ OPTİMİZE ET",
    optimizationSummary: "OPTİMİZASYON ÖZET METRİKLERİ",
    optimalCost: "OPTIMAL GENEL TOPLAM MALİYET",
    freightEvaluated: "KARGO SINIRLARI DEĞERLENDİRİLDİ:",
    freightEvaluatedDesc: "Parça listeniz aktif ücretsiz kargo limitlerine göre bölümlendirildi.",
    optimizerPrompt: "SOL PANELDEN PARÇALARINIZI EKLEYİN VE 'SEPET MATRİSİNİ OPTİMİZE ET' BUTONUNA BASIN.",

    // Agent Tab
    agentTitle: "OTONOM TEDARİK VE DENETİM AJANI",
    agentSubtitle: "Otomatik BOM çıkarma, elektriksel doğrulama ve sepet optimizasyonu için proje detaylarını belirtin.",
    byokTitle: "API ANAHTAR YÖNETİMİ (BYOK)",
    saved: "KAYDEDİLDİ",
    keyRequired: "ANAHTAR GEREKLİ",
    encryptedNotice: "Tarayıcınızda güvenle saklanır",
    clear: "Temizle",
    projectSpec: "PROJE TANIMI VE DONANIM İHTİYAÇLARI:",
    projectSpecPlaceholder: "Örn: ESP32, 4 kanallı röle kartı ve OLED ekran kullanan Wi-Fi destekli akıllı sulama kontrol panosu...",
    projectDomain: "PROJE ALANI:",
    runAudit: "DENETİMİ ÇALIŞTIR",
    auditLogs: "AJAN ÇALIŞMA GÜNLÜĞÜ:",
    auditCompleted: "DENETİM TAMAMLANDI",
    tabBom: "BOM (MALZEME LİSTESİ)",
    tabRequirements: "PROJE KAPSAMI VE SINIRLAR",
    tabCompatibility: "DONANIM UYUMLULUK MATRİSİ",
    tabCart: "TEDARİK SEPETİ DAĞILIMI",
    tabReport: "DENETİM ÖZET RAPORU",
    rawJson: "HAM JSON YANIT GÜNLÜKLERİ",

    // Footer
    footerCopyright: "Robo Market Search — Açık Kaynak Endüstriyel Donanım İndeksi",
    footerDocs: "REST API Swagger Dökümantasyonu",
    footerGithub: "GitHub Reposu",

    // Server Status Modal
    serverModalTitle: "Backend Sunucusuna Bağlanılıyor...",
    serverModalSubtitle: "API sunucusu henüz yanıt vermiyor veya uyku modundan uyanıyor. Bağlantı kurulana kadar otomatik olarak yeniden denenecektir.",
    serverModalConnecting: "Sunucu Sağlığı Kontrol Ediliyor...",
    serverModalConnected: "Bağlantı Kuruldu! Sunucu aktif ve hazır.",
    serverModalAttempt: "Bağlantı Denemesi",
    serverModalHintCloud: "Bulut sunucusunda (Render ücretsiz plan) ilk istekte uyanma süresi yaklaşık 30-50 saniye sürebilir.",
    serverModalHintLocal: "Eğer yerel geliştirme yapıyorsanız terminalinizde 'make run-api' veya 'robo-api' komutunu çalıştırın.",
    serverModalRetryNow: "Şimdi Yeniden Dene",
    serverModalDismiss: "Arka Planda Bekle",
    serverModalReopenTooltip: "Sunucu bağlantı durumunu görüntüle",
  },
  en: {
    // Common / Global
    appName: "ROBO MARKET SEARCH",
    appVersion: "v1.8 PRO",
    appSubtitle: "Enterprise Sourcing & Hardware Procurement Terminal",
    systemStatus: "SYSTEM:",
    systemOnline: "ONLINE",
    systemOffline: "OFFLINE",
    connecting: "CONNECTING...",

    // Nav
    navSearch: "Global Component Index",
    navBatch: "Multi-MPN Matrix",
    navOptimizer: "Procurement Matrix",
    navAgent: "Autonomous Sourcing Engine",

    // Search Tab
    searchTitle: "INDUSTRIAL COMPONENT SOURCING MATRIX",
    searchSubtitle: "Real-time multi-vendor index querying across Robotistan, Robolink, Robo90, and Direnç.net.",
    searchPlaceholder: "ENTER MPN OR PART KEYWORD (e.g. ESP32-WROOM, STM32F103, RELAY 5V)...",
    execute: "EXECUTE",
    quickIndex: "QUICK INDEX:",
    vendors: "VENDORS:",
    limit: "LIMIT:",
    sort: "SORT:",
    priceLowHigh: "PRICE: LOW ➔ HIGH",
    priceHighLow: "PRICE: HIGH ➔ LOW",
    nameAZ: "TITLE: A ➔ Z",
    inStockOnly: "IN STOCK ONLY",
    logStream: "EXECUTION STREAM LOGS:",
    indexResults: "INDEX RESULTS",
    recordsFound: "RECORDS FOUND",
    tableView: "TABLE",
    gridView: "GRID",
    export: "EXPORT",
    noRecords: "NO COMPONENT RECORDS MATCHING SPECIFIED CONSTRAINTS.",

    // Table Headers
    thPartTitle: "Part Description / Title",
    thSupplier: "Supplier",
    thStockStatus: "Stock Status",
    thUnitPrice: "Unit Price (TRY)",
    thAction: "Action",
    inStock: "IN STOCK",
    outOfStock: "OUT OF STOCK",
    source: "SOURCE",
    noImage: "No Image Data",

    // Batch Search Tab
    batchTitle: "MULTI-MPN BATCH INDEXER",
    batchSubtitle: "Queue multiple MPNs and execute concurrent parallel queries across all hardware vendors.",
    batchPlaceholder: "ENTER MPN OR KEYWORD (e.g. LM2596, ESP32-WROOM)...",
    queueMpn: "QUEUE MPN",
    limitPerVendor: "LIMIT PER VENDOR:",
    executeBatch: "EXECUTE BATCH INDEX",
    queryTarget: "QUERY TARGET:",

    // Cart Optimizer Tab
    cartTitle: "PROCUREMENT CART MATRIX",
    cartSubtitle: "Configure custom vendor freight thresholds and compute mathematically optimal multi-store procurement splits.",
    freightTitle: "VENDOR FREIGHT THRESHOLDS & SHIPPING PARAMETERS",
    reset: "RESET",
    editThresholds: "EDIT THRESHOLDS",
    hideSettings: "HIDE SETTINGS",
    activeConstraints: "ACTIVE CONSTRAINTS:",
    manifestTitle: "PROCUREMENT MANIFEST LIST",
    addMpnPlaceholder: "ENTER MPN OR PART NAME...",
    add: "ADD",
    optimizeCart: "OPTIMIZE PROCUREMENT MATRIX",
    optimizationSummary: "OPTIMIZATION METRICS SUMMARY",
    optimalCost: "OPTIMAL GRAND TOTAL COST",
    freightEvaluated: "FREIGHT CONSTRAINTS EVALUATED:",
    freightEvaluatedDesc: "Procurement list evaluated against active free shipping thresholds.",
    optimizerPrompt: "ADD MANIFEST ITEMS ON THE LEFT PANEL AND CLICK 'OPTIMIZE PROCUREMENT MATRIX'.",

    // Agent Tab
    agentTitle: "AUTONOMOUS SOURCING ENGINE",
    agentSubtitle: "Specify project scope & hardware constraints for automated BOM extraction, electrical verification, and market cart optimization.",
    byokTitle: "API CREDENTIAL MANAGEMENT (BYOK)",
    saved: "SAVED",
    keyRequired: "KEY REQUIRED",
    encryptedNotice: "Encrypted locally in browser",
    clear: "Clear",
    projectSpec: "PROJECT SPECIFICATION & HARDWARE REQUIREMENTS:",
    projectSpecPlaceholder: "e.g. Design a Wi-Fi enabled smart irrigation control panel using ESP32, 4-channel relay module, and OLED display...",
    projectDomain: "PROJECT DOMAIN:",
    runAudit: "RUN AUDIT",
    auditLogs: "SOURCING ENGINE LOG STREAM:",
    auditCompleted: "AUDIT COMPLETED",
    tabBom: "BOM (BILL OF MATERIALS)",
    tabRequirements: "PROJECT SCOPE & CONSTRAINTS",
    tabCompatibility: "HARDWARE COMPATIBILITY MATRIX",
    tabCart: "PROCUREMENT ALLOCATION",
    tabReport: "AUDIT SUMMARY REPORT",
    rawJson: "RAW JSON PAYLOAD AUDIT LOGS",

    // Footer
    footerCopyright: "Robo Market Search — Open Source Industrial Hardware Index",
    footerDocs: "REST API Swagger Documentation",
    footerGithub: "GitHub Repository",

    // Server Status Modal
    serverModalTitle: "Connecting to Backend Server...",
    serverModalSubtitle: "The API server is not responding yet or is waking up from idle state. Re-establishing connection automatically.",
    serverModalConnecting: "Checking Server Health...",
    serverModalConnected: "Connected Successfully! Server is online and active.",
    serverModalAttempt: "Connection Attempt",
    serverModalHintCloud: "On free cloud tier (Render), cold boot may take 30-50 seconds to initialize.",
    serverModalHintLocal: "If testing locally, please ensure the backend is started with 'make run-api' or 'robo-api'.",
    serverModalRetryNow: "Retry Now",
    serverModalDismiss: "Wait in Background",
    serverModalReopenTooltip: "View server connection status",
  },
};
