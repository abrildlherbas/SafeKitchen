#!/bin/bash
cd "$(dirname "$0")/.." || exit 1

FALLO=0
echo "=========================================="
echo "Verificando salud del sistema SafeKitchen..."
echo "=========================================="

# 1. Verificar contenedores de Docker generales
if [ -f "docker-compose.yml" ]; then
    if docker compose ps --status running --format "{{.Name}}" | grep -q "safe-kitchen-grafana"; then
        echo "[✔] Contenedores Docker OK"
    else
        echo "[✖] ALERTA: Los contenedores Docker están detenidos."
        FALLO=1
    fi
    
    # 1.1 Verificar específicamente que Grafana esté corriendo
    if [ "$(docker inspect -f '{{.State.Running}}' safe-kitchen-grafana 2>/dev/null)" = "true" ]; then
        echo "[✔] Contenedor de Grafana OK (Puerto 3001)"
    else
        echo "[✖] ALERTA: El contenedor de Grafana (safe-kitchen-grafana) está detenido."
        FALLO=1
    fi
fi

# 2. Verificar proceso del sensor Python
if [ -f ".sensor_pid" ]; then
    PID=$(cat .sensor_pid)
    if ps -p "$PID" > /dev/null 2>&1; then
        echo "[✔] Proceso del sensor Python activo (PID: $PID)"
    else
        echo "[✖] ALERTA: El proceso del sensor Python se detuvo."
        FALLO=1
    fi
else
    echo "[✖] ALERTA: No se encontró el archivo PID del sensor."
    FALLO=1
fi

echo "=========================================="
if [ $FALLO -eq 0 ]; then
    echo "Estado general: SALUDABLE"
    exit 0
else
    echo "Estado general: ALERTA - Falla detectada en el pipeline."
    exit 1
fi