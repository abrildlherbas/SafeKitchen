#!/usr/bin/env bash
set -e

UMBRAL="${1:-38.0}"
LOG_FILE="logs_alertas.log"
VALOR=$(curl -s http://127.0.0.1:8000 | awk '/^safekitchen_temperatura / {print $2; exit}')

if [ -z "$VALOR" ]; then
  MSG="[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] No se pudo leer safekitchen_temperatura en el puerto 8000."
  echo "$MSG" | tee -a "$LOG_FILE"
  exit 1
fi

awk -v v="$VALOR" -v u="$UMBRAL" -v logf="$LOG_FILE" -v ts="$(date '+%Y-%m-%d %H:%M:%S')" 'BEGIN {
  if (v >= u) {
    printf "[%s] [ALERTA] Temperatura %.2f °C >= umbral %.2f °C! Ejecutar rollback.sh si persiste.\n", ts, v, u | tee -a logf;
    exit 2;
  } else {
    printf "[%s] [OK] Temperatura %.2f °C (< %.2f °C) - Estado normal.\n", ts, v, u | tee -a logf;
    exit 0;
  }
}'
