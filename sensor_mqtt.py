import time
import random
import paho.mqtt.client as mqtt
from prometheus_client import start_http_server, Gauge, Counter

# Configuración del broker MQTT local
MQTT_BROKER = "localhost"
MQTT_PORT = 1883
MQTT_TOPIC = "safe-kitchen/temperatura"

# Iniciar servidor de métricas para Prometheus/Grafana en el puerto 8000
start_http_server(8000)
temp_metric = Gauge("safekitchen_temperatura", "Temperatura del sensor SafeKitchen en °C")
lecturas_metric = Counter("safekitchen_lecturas_total", "Total de lecturas emitidas por SafeKitchen")

# Compatibilidad con paho-mqtt 2.x (con fallback si usás una versión 1.x anterior)
try:
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
except AttributeError:
    client = mqtt.Client()


def conectar_mqtt():
    try:
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
        client.loop_start()
        print("Conectado al broker MQTT exitosamente.")
    except Exception as e:
        print(f"No se pudo conectar al broker MQTT (se reintentará): {e}")


conectar_mqtt()
print("Iniciando bucle de lectura del sensor...")

while True:
    # Lectura del sensor GY-906 / temperatura simulada con variación realista
    temperatura_simulada = round(random.uniform(36.2, 37.3), 2)

    # Actualizar métricas para Prometheus / Grafana
    temp_metric.set(temperatura_simulada)
    lecturas_metric.inc()

    # Publicar en MQTT
    payload = f'{{"temperature": {temperatura_simulada}}}'
    try:
        resultado = client.publish(MQTT_TOPIC, payload)
        if resultado.rc != mqtt.MQTT_ERR_SUCCESS:
            conectar_mqtt()
    except Exception as e:
        print(f"Error al publicar en MQTT: {e}")

    print(f"Publicado en {MQTT_TOPIC}: {payload}")
    time.sleep(5)