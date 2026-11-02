'use client';
import { useEffect, useState, useRef } from 'react';
import mqtt, { MqttClient } from 'mqtt';

export function useMQTT(host: string, port: string) {
  const [temperatura, cambiarTemperatura] = useState<string | null>(null)
  let clienteMqtt = useRef<MqttClient | null>(null)

  useEffect(() => {
    // Nos conectamos por WebSockets al broker
    clienteMqtt.current = mqtt.connect(`ws://${host}:${port}`)

    clienteMqtt.current.on("connect", () => {
      console.log("Conectados por WebSocket al broker MQTT")
      
      // 1. IMPORTANTE: Acá nos suscribimos al canal donde publica la terminal o el sensor
      clienteMqtt.current?.subscribe("safe-kitchen/temperatura", (err) => {
        if (!err) {
          console.log("Suscrito correctamente al tópico safe-kitchen/temperatura")
        }
      })
    })

    // 2. Escuchamos cuando llega un mensaje nuevo desde el broker
    clienteMqtt.current.on("message", (topic, message) => {
      if (topic === "safe-kitchen/temperatura") {
        const valorTemp = message.toString()
        console.log("Mensaje MQTT recibido:", valorTemp)
        cambiarTemperatura(valorTemp)
      }
    })

    return () => {
      clienteMqtt.current?.end();
    }
  }, [host, port]) 

  return { temperatura }
}