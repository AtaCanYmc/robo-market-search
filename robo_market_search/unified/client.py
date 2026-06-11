import concurrent.futures
from typing import List

from robo_market_search.shared.models import Product
from robo_market_search.robolink.client import RobolinkClient
from robo_market_search.robotistan.client import RobotistanClient
from robo_market_search.robo90.client import Robo90Client
from robo_market_search.direncnet.client import DirencnetClient


class UnifiedSearchClient:
    """
    Tüm marketlerde (Robolink, Robotistan, Robo90, Direncnet) eşzamanlı arama yapar.
    """
    def __init__(self):
        # Client'ları tek seferde başlat
        self.robolink = RobolinkClient()
        self.robotistan = RobotistanClient()
        self.robo90 = Robo90Client()
        self.direncnet = DirencnetClient()

    def search(self, query: str, limit_per_store: int = 10) -> List[Product]:
        """
        Arama kelimesini alıp tüm marketlere paralel (Thread) olarak sorar.
        Gelen sonuçları birleştirip fiyata göre (ucuzdan pahalıya) sıralar.
        """
        results: List[Product] = []

        # I/O bound işlemler olduğu için ThreadPoolExecutor idealdir.
        with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
            future_to_store = {
                executor.submit(self.robolink.search_component, query, limit_per_store): "Robolink",
                executor.submit(self.robotistan.search_component, query, limit_per_store, 1): "Robotistan",
                executor.submit(self.robo90.search_component, query, 1, 1): "Robo90",
                executor.submit(self.direncnet.search_component, query, limit_per_store): "Direncnet"
            }

            for future in concurrent.futures.as_completed(future_to_store):
                store_name = future_to_store[future]
                try:
                    store_results = future.result()
                    
                    # Robo90 manuel sayfa limiti almadığı için listeyi manuel olarak kırpalım
                    if store_name == "Robo90" and len(store_results) > limit_per_store:
                        store_results = store_results[:limit_per_store]
                        
                    results.extend(store_results)
                    print(f"[Unified] {store_name} tamamlandı, {len(store_results)} ürün bulundu.")
                except Exception as exc:
                    print(f"[HATA] {store_name} aramasında sorun oluştu: {exc}")

        # Fiyata göre artan (ucuzdan pahalıya) şekilde sıralayalım
        results.sort(key=lambda x: x.price)
        
        return results
