import time
import random
import paho.mqtt.client as mqtt
from prometheus_client import start_http_server, Gauge

# Configuración del broker MQTT local
MQTT_BROKER = "localhost"
MQTT_PORT = 1883
MQTT_TOPIC = "safe-kitchen/temperatura"

# Iniciar servidor de métricas para Prometheus/Grafana en el puerto 8000
start_http_server(8000)
temp_metric = Gauge('safekitchen_temperatura', 'Temperatura del sensor SafeKitchen en °C')

client = mqtt.Client()

try:
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    print("Conectado al broker MQTT exitosamente.")
except Exception as e:
    print(f"No se pudo conectar al broker MQTT: {e}")

print("Iniciando bucle de lectura del sensor...")
while True:
    # Lectura del sensor GY-906 / temperatura simulada con variación realista
    temperatura_simulada = round(random.uniform(36.2, 37.3), 2)
    
    # Actualizar métrica para Grafana (Prometheus)
    temp_metric.set(temperatura_simulada)
    
    # Publicar en MQTT
    payload = f"{{\"temperature\": {temperatura_simulada}}}"
    try:
        client.publish(MQTT_TOPIC, payload)
    except Exception:
        pass
    print(f"Publicado en {MQTT_TOPIC}: {payload}")
    
    time.sleep(5)