'use client';
import { useEffect, useState, useRef } from 'react';
import mqtt, { MqttClient } from 'mqtt';

export function useMQTT(host: string, port: string) {
  const [temperatura, cambiarTemperatura] = useState<number>(0)
  const [conectadoAlBrokerMQTT, cambiarEstadoDeLaConexionAlBroker] = useState<boolean>(false)
  let clienteMqtt = useRef<MqttClient | null>(null)


  useEffect(() => {
    // Nos conectamos por WebSockets al broker
    clienteMqtt.current = mqtt.connect(`ws://${host}:${port}`)

    clienteMqtt.current.on("connect", () => {
      console.log("Conectados por WebSocket al broker MQTT")
      
      // 1. IMPORTANTE: Acá nos suscribimos al canal donde publica la terminal o el sensor
      clienteMqtt.current?.subscribe("raspberry/sensor/temperatura", (err) => {
        if (!err) {
          console.log("Suscrito correctamente al tópico raspberry/sensor/temperatura")
          cambiarEstadoDeLaConexionAlBroker(true)
        }
      })
    })

    // 2. Escuchamos cuando llega un mensaje nuevo desde el broker
    clienteMqtt.current.on("message", (topico, mensaje) => {
      if (topico === "raspberry/sensor/temperatura") {
        const temperaturaComoString = mensaje.toString()
        console.log("Mensaje MQTT recibido:", temperaturaComoString)
        cambiarTemperatura(Number(temperaturaComoString))
      }
    })

    return () => {
      clienteMqtt.current?.end();
    }
  }, [host, port]) 

  return { temperatura , conectadoAlBrokerMQTT}
}