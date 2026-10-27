'use client';
import { useEffect, useState, useRef } from 'react';
import mqtt, { MqttClient } from 'mqtt';

export function useMQTT(host: string, port: string) {
  const [temperatura, cambiarTemperatura] = useState(0.0)
  let clienteMqtt = useRef<MqttClient | null>(null)

  useEffect(() => {
    // IMPORTANTE: Usamos 'ws://' en lugar de 'mqtt://' para que funcione en el navegador.
    // Asegúrate de pasarle el puerto de WebSockets de tu broker (ej: 8083 o 9001).
    clienteMqtt.current = mqtt.connect(`ws://${host}:${port}`)

    clienteMqtt.current.on("connect", () => {
      console.log("Conectados por WebSocket")
    })

    return () => {
      clienteMqtt.current?.end();
    }
  }, [host, port]) 

  return { temperatura }
}