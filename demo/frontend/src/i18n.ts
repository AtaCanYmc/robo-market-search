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
    appName: "Robo Market Search",
    appVersion: "v1.8",
    appSubtitle: "Türkiye Elektronik & Robotik Parça Arama Motoru",
    systemStatus: "SİSTEM:",
    systemOnline: "ÇEVRİMİÇİ",
    systemOffline: "ÇEVRİMDİŞİ",
    connecting: "BAĞLANIYOR...",

    // Nav
    navSearch: "Parça Arama",
    navBatch: "Toplu Arama",
    navOptimizer: "Sepet Optimizasyonu",
    navAgent: "Donanım Ajanı",

    // Search Tab
    searchTitle: "Elektronik Parça Arama",
    searchSubtitle: "Robotistan, Robolink, Robo90 ve Direnç.net mağazalarında eşzamanlı canlı arama.",
    searchPlaceholder: "Parça adı veya kod girin (örn. ESP32, STM32, 5V Röle, OLED ekran)...",
    execute: "Ara",
    quickIndex: "Hızlı Arama:",
    vendors: "Mağazalar:",
    limit: "Limit:",
    sort: "Sıralama:",
    priceLowHigh: "Fiyat: En Düşük",
    priceHighLow: "Fiyat: En Yüksek",
    nameAZ: "İsim: A ➔ Z",
    inStockOnly: "Sadece Stoktakiler",
    logStream: "İşlem Günlüğü:",
    indexResults: "Arama Sonuçları",
    recordsFound: "ürün bulundu",
    tableView: "Tablo",
    gridView: "Kartlar",
    export: "Dışa Aktar",
    noRecords: "Arama kriterlerine uygun ürün bulunamadı.",

    // Table Headers
    thPartTitle: "Ürün Adı",
    thSupplier: "Mağaza",
    thStockStatus: "Stok Durumu",
    thUnitPrice: "Birim Fiyat",
    thAction: "İşlem",
    inStock: "Stokta Var",
    outOfStock: "Stokta Yok",
    source: "Mağazaya Git",
    noImage: "Görsel Yok",

    // Batch Search Tab
    batchTitle: "Toplu Parça Arama",
    batchSubtitle: "Birden fazla parçayı aynı anda tüm mağazalarda paralel aratın.",
    batchPlaceholder: "Parça adı veya kodu ekleyin (örn. LM2596, ESP32-WROOM)...",
    queueMpn: "Ekle",
    limitPerVendor: "Mağaza Başına Limit:",
    executeBatch: "Toplu Arama Yap",
    queryTarget: "Aranan Parça:",

    // Cart Optimizer Tab
    cartTitle: "Sepet & Kargo Optimizasyonu",
    cartSubtitle: "Mağazaların ücretsiz kargo limitlerini analiz ederek en ucuz sepet kombinasyonunu bulun.",
    freightTitle: "Ücretsiz Kargo Limitleri & Ayarları",
    reset: "Sıfırla",
    editThresholds: "Limitleri Düzenle",
    hideSettings: "Ayarları Gizle",
    activeConstraints: "Aktif Limitler:",
    manifestTitle: "Alınacak Malzeme Listesi",
    addMpnPlaceholder: "Parça adı veya kodu girin...",
    add: "Ekle",
    optimizeCart: "Sepeti Optimize Et",
    optimizationSummary: "Optimizasyon Özeti",
    optimalCost: "Toplam Maliyet (Kargo Dahil)",
    freightEvaluated: "Kargo Limitleri:",
    freightEvaluatedDesc: "Sepetiniz ücretsiz kargo eşiklerine göre optimize edildi.",
    optimizerPrompt: "Sol taraftan listenize parça ekleyin ve 'Sepeti Optimize Et' butonuna tıklayın.",

    // Agent Tab
    agentTitle: "Yapay Zeka Donanım Ajanı",
    agentSubtitle: "Projenizi tarif edin; parça listesi, uyumluluk kontrolü ve sepet optimizasyonunu otomatik tamamlasın.",
    byokTitle: "API Anahtarı (BYOK)",
    saved: "KAYDEDİLDİ",
    keyRequired: "ANAHTAR GEREKLİ",
    encryptedNotice: "Tarayıcınızda güvenle saklanır",
    clear: "Temizle",
    projectSpec: "Proje Tanımı & İhtiyaçlar:",
    projectSpecPlaceholder: "Örn: ESP32 ve 4 kanallı röle kartı kullanan, Wi-Fi üzerinden kontrol edilen akıllı priz sistemi...",
    projectDomain: "Proje Alanı:",
    runAudit: "Projeyi Analiz Et",
    auditLogs: "Ajan Çalışma Günlüğü:",
    auditCompleted: "Analiz Tamamlandı",
    tabBom: "Malzeme Listesi (BOM)",
    tabRequirements: "Proje Kapsamı & İhtiyaçlar",
    tabCompatibility: "Donanım Uyumluluğu",
    tabCart: "Sepet Dağılımı",
    tabReport: "Özet Rapor",
    rawJson: "Ham JSON Yanıtı",

    // Footer
    footerCopyright: "Robo Market Search — Türkiye Elektronik & Robotik Parça Arama Platformu",
    footerDocs: "REST API Dökümantasyonu",
    footerGithub: "GitHub Kaynak Kodu",

    // Server Status Modal
    serverModalTitle: "Sunucuya Bağlanılıyor...",
    serverModalSubtitle: "API sunucusu başlatılıyor veya uyku modundan uyanıyor. Bağlantı kurulana kadar bekleniyor.",
    serverModalConnecting: "Sunucu Sağlığı Kontrol Ediliyor...",
    serverModalConnected: "Bağlantı Kuruldu! Sunucu aktif ve hazır.",
    serverModalAttempt: "Bağlantı Denemesi",
    serverModalHintCloud: "Bulut sunucusunda (Render ücretsiz plan) ilk istekte uyanma süresi 30-50 saniye sürebilir.",
    serverModalHintLocal: "Yerel geliştirme yapıyorsanız terminalde 'make run-api' veya 'robo-api' komutunu çalıştırın.",
    serverModalRetryNow: "Şimdi Yeniden Dene",
    serverModalDismiss: "Arka Planda Bekle",
    serverModalReopenTooltip: "Sunucu bağlantı durumunu görüntüle",
  },
  en: {
    // Common / Global
    appName: "Robo Market Search",
    appVersion: "v1.8",
    appSubtitle: "Turkish Electronics & Robotics Sourcing Engine",
    systemStatus: "SYSTEM:",
    systemOnline: "ONLINE",
    systemOffline: "OFFLINE",
    connecting: "CONNECTING...",

    // Nav
    navSearch: "Live Search",
    navBatch: "Batch Search",
    navOptimizer: "Cart Optimizer",
    navAgent: "Hardware Agent",

    // Search Tab
    searchTitle: "Electronic Component Search",
    searchSubtitle: "Search live across Robotistan, Robolink, Robo90, and Direnç.net in parallel.",
    searchPlaceholder: "Search by component name or part number (e.g. ESP32, STM32, 5V Relay)...",
    execute: "Search",
    quickIndex: "Quick Search:",
    vendors: "Stores:",
    limit: "Limit:",
    sort: "Sort by:",
    priceLowHigh: "Price: Low to High",
    priceHighLow: "Price: High to Low",
    nameAZ: "Name: A to Z",
    inStockOnly: "In Stock Only",
    logStream: "Activity Log:",
    indexResults: "Search Results",
    recordsFound: "products found",
    tableView: "Table",
    gridView: "Grid",
    export: "Export",
    noRecords: "No matching components found.",

    // Table Headers
    thPartTitle: "Product Title",
    thSupplier: "Store",
    thStockStatus: "Stock Status",
    thUnitPrice: "Unit Price",
    thAction: "Action",
    inStock: "In Stock",
    outOfStock: "Out of Stock",
    source: "View Store",
    noImage: "No Image",

    // Batch Search Tab
    batchTitle: "Batch Component Search",
    batchSubtitle: "Search for multiple components across all suppliers simultaneously.",
    batchPlaceholder: "Add part name or number (e.g. LM2596, ESP32-WROOM)...",
    queueMpn: "Add",
    limitPerVendor: "Limit per Store:",
    executeBatch: "Search All",
    queryTarget: "Searched Item:",

    // Cart Optimizer Tab
    cartTitle: "Cart & Shipping Optimizer",
    cartSubtitle: "Calculate the cheapest multi-store order combination considering free shipping thresholds.",
    freightTitle: "Free Shipping Thresholds & Settings",
    reset: "Reset",
    editThresholds: "Edit Thresholds",
    hideSettings: "Hide Settings",
    activeConstraints: "Active Limits:",
    manifestTitle: "Component Shopping List",
    addMpnPlaceholder: "Enter part name or number...",
    add: "Add",
    optimizeCart: "Optimize Cart",
    optimizationSummary: "Optimization Summary",
    optimalCost: "Total Order Cost",
    freightEvaluated: "Shipping Thresholds:",
    freightEvaluatedDesc: "Orders evaluated against active free shipping thresholds.",
    optimizerPrompt: "Add items to your list on the left and click 'Optimize Cart'.",

    // Agent Tab
    agentTitle: "AI Hardware Agent",
    agentSubtitle: "Describe your project requirements to automatically generate a BOM, check electrical compatibility, and optimize cart allocation.",
    byokTitle: "API Key Management (BYOK)",
    saved: "SAVED",
    keyRequired: "KEY REQUIRED",
    encryptedNotice: "Stored securely in your browser",
    clear: "Clear",
    projectSpec: "Project Specification & Requirements:",
    projectSpecPlaceholder: "e.g. Design a Wi-Fi enabled smart power outlet using ESP32, 4-channel relay module, and OLED display...",
    projectDomain: "Project Domain:",
    runAudit: "Run Project Audit",
    auditLogs: "Agent Activity Log:",
    auditCompleted: "Audit Completed",
    tabBom: "Bill of Materials (BOM)",
    tabRequirements: "Scope & Constraints",
    tabCompatibility: "Hardware Compatibility",
    tabCart: "Cart Allocation",
    tabReport: "Summary Report",
    rawJson: "Raw JSON Response",

    // Footer
    footerCopyright: "Robo Market Search — Open Source Hardware Sourcing Engine",
    footerDocs: "REST API Swagger Docs",
    footerGithub: "GitHub Repository",

    // Server Status Modal
    serverModalTitle: "Connecting to Backend Server...",
    serverModalSubtitle: "The API server is starting up or waking from sleep. Waiting to establish connection.",
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
