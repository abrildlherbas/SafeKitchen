#!/bin/bash
cd "$(dirname "$0")/.." || exit 1

echo "=========================================="
echo "Iniciando Pipeline de SafeKitchen..."
echo "=========================================="

# 1. Levantar contenedores Docker (PocketBase y Mosquitto MQTT)
if [ -f "docker-compose.yml" ]; then
    echo "[1/3] Iniciando contenedores Docker..."
    docker compose up -d
fi

# 2. Activar entorno virtual de Python
if [ -d "venv" ]; then
    echo "[2/3] Activando entorno virtual Python..."
    source venv/bin/activate
fi

# 3. Lanzar script del sensor MQTT en segundo plano
if [ -f "sensor_mqtt.py" ]; then
    echo "[3/3] Lanzando script del sensor (sensor_mqtt.py)..."
    python3 sensor_mqtt.py > logs_sensor.log 2>&1 &
    echo $! > .sensor_pid
else
    echo "[3/3] Nota: No se encontró sensor_mqtt.py en la raíz, continuando..."
fi

echo "=========================================="
echo "¡Pipeline procesado exitosamente!"
echo "=========================================="