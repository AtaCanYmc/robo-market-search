"""
Synonym dictionary and query expansion module for electronic components.
Provides mapping and query expansion for common Turkish/English component terms.
"""

from typing import Dict, List, Optional, Set

SYNONYM_MAP: Dict[str, List[str]] = {
    "esp32": ["esp32 devkit", "esp32 wroom", "esp32 nodemcu", "esp-32"],
    "esp8266": ["nodemcu", "esp-12e", "esp8266 wifi"],
    "relay": ["röle", "role", "relay kartı", "röle modülü"],
    "soil moisture": ["toprak nem sensörü", "toprak nem", "capacitive soil moisture"],
    "solenoid valve": ["solenoid valf", "selenoid vana", "su vanası 12v", "solenoid vana"],
    "power supply": ["güç kaynağı", "adaptör", "12v adaptör", "besleme kartı"],
    "motor driver": ["motor sürücü", "l298n", "tb6612fng"],
    "oled": ["oled ekran", "0.96 oled", "i2c oled"],
    "step motor": ["step motor", "stepper motor", "28byj-48"],
    "servo": ["sg90", "mg996r", "servo motor"],
}


class SynonymExpander:
    """
    Expands search queries with known electronic component synonyms.
    """

    def __init__(self, custom_synonyms: Optional[Dict[str, List[str]]] = None):
        self.synonyms = dict(SYNONYM_MAP)
        if custom_synonyms:
            self.synonyms.update(custom_synonyms)

    def expand(self, query: str) -> List[str]:
        """
        Return a list of expanded queries including the original.
        """
        query_clean = query.lower().strip()
        expanded: Set[str] = {query}

        for key, terms in self.synonyms.items():
            if key in query_clean or any(t in query_clean for t in terms):
                expanded.add(key)
                expanded.update(terms)

        return list(expanded)
