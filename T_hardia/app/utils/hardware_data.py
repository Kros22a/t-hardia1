# Datos predefinidos de hardware para comparaciones
HARDWARE_DATABASE = {
    "cpus": {
        "intel_i9_13900k": {
            "name": "Intel Core i9-13900K",
            "cores": 24,
            "threads": 32,
            "base_clock": "3.0 GHz",
            "boost_clock": "5.8 GHz",
            "tdp": "125W",
            "price": 589,
            "architecture": "Raptor Lake"
        },
        "amd_ryzen_9_7950x": {
            "name": "AMD Ryzen 9 7950X",
            "cores": 16,
            "threads": 32,
            "base_clock": "4.5 GHz",
            "boost_clock": "5.7 GHz",
            "tdp": "120W",
            "price": 699,
            "architecture": "Zen 4"
        }
    },
    "gpus": {
        "rtx_4090": {
            "name": "NVIDIA GeForce RTX 4090",
            "vram": "24GB GDDR6X",
            "cuda_cores": 16384,
            "base_clock": "2230 MHz",
            "boost_clock": "2520 MHz",
            "tdp": "450W",
            "price": 1599,
            "architecture": "Ada Lovelace"
        },
        "rx_7900_xtx": {
            "name": "AMD Radeon RX 7900 XTX",
            "vram": "24GB GDDR6",
            "stream_processors": 6144,
            "base_clock": "1855 MHz",
            "boost_clock": "2500 MHz",
            "tdp": "355W",
            "price": 999,
            "architecture": "RDNA 3"
        }
    }
}

def get_hardware_info(component_type: str, component_name: str) -> dict:
    """Obtener información de hardware por tipo y nombre"""
    if component_type in HARDWARE_DATABASE:
        return HARDWARE_DATABASE[component_type].get(component_name, {})
    return {}
