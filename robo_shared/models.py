from dataclasses import dataclass


@dataclass
class Product:
    name: str
    price: float
    currency: str
    url: str
    store: str
    image_url: str = ""
    in_stock: bool = True
