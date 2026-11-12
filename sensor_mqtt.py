import time
import paho.mqtt.client as mqtt

# Configuración del broker MQTT local
MQTT_BROKER = "localhost"
MQTT_PORT = 1883
MQTT_TOPIC = "safe-kitchen/temperatura"

client = mqtt.Client()

try:
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    print("Conectado al broker MQTT exitosamente.")
except Exception as e:
    print(f"No se pudo conectar al broker MQTT: {e}")

print("Iniciando bucle de lectura del sensor...")
while True:
    # Lectura del sensor GY-906 / temperatura simulada
    temperatura_simulada = 36.5 
    
    payload = f"{{\"temperature\": {temperatura_simulada}}}"
    client.publish(MQTT_TOPIC, payload)
    print(f"Publicado en {MQTT_TOPIC}: {payload}")
    
    time.sleep(5)