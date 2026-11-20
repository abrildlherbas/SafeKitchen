#!/bin/bash
cd "$(dirname "$0")/.." || exit 1

echo "=========================================="
echo "Ejecutando Rollback de Emergencia..."
echo "=========================================="

# 1. Detener servicios actuales de forma segura
if [ -f "./scripts/stop_pipeline.sh" ]; then
    echo "[1/3] Deteniendo servicios actuales..."
    ./scripts/stop_pipeline.sh
else
    docker compose down --remove-orphans
fi

# 2. Restaurar estado limpio del repositorio (opcional para desarrollo)
echo "[2/3] Limpiando contenedores huérfanos y estado local..."
docker compose down --remove-orphans

# 3. Reiniciar el pipeline base
echo "[3/3] Reiniciando pipeline limpio..."
./scripts/start_pipeline.sh

echo "=========================================="
echo "¡Rollback completado y sistema restaurado!"
echo "=========================================="