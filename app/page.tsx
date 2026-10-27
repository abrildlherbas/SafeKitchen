'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Check, CircleUserRound, Database, Hand, ScanFace, ShieldCheck, Thermometer, WifiOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { pocketbase, POCKETBASE_URL } from '@/lib/pocketbase'
import { useMQTT } from '@/hooks/useMQTT'

type MonitorState = 'standby' | 'normal' | 'alert'

const states: Record<MonitorState, { label: string; temperature?: string }> = {
  standby: { label: 'Esperando lectura' },
  normal: { label: 'Temperatura normal', temperature: '36.5°C' },
  alert: { label: 'Temperatura elevada', temperature: '38.5°C' },
}

export default function Page() {
  const [monitorState, setMonitorState] = useState<MonitorState>('standby')
  const [databaseConnected, setDatabaseConnected] = useState<boolean | null>(null)
  const {temperatura} = useMQTT("10.56.2.30", "1883") 

  useEffect(() => {
    console.log(temperatura)
    let active = true
    const checkConnection = async () => {
      try {
        await pocketbase.health.check()
        if (active) setDatabaseConnected(true)
      } catch {
        if (active) setDatabaseConnected(false)
      }
    }
    checkConnection()
    return () => { active = false }
  }, [])

  const current = states[monitorState]

  return (
    <main className="min-h-screen bg-[#eef1ed] px-4 py-5 text-[#18221d] sm:px-8 lg:px-12">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-[1500px] flex-col gap-5">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#d5ded7] bg-[#f8faf7] px-5 py-4 shadow-sm sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#173b2b] text-[#c8ef5d]">
              <ShieldCheck aria-hidden="true" className="size-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#68766d]">Sistema de acceso</p>
              <h1 className="text-2xl font-bold tracking-tight">SafeKitchen</h1>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="hidden text-right sm:block">
              <p className="font-semibold">Monitor principal</p>
              <p className="text-xs text-[#68766d]">Puesto de control · 01</p>
            </div>
            <Badge variant="outline" className="gap-2 border-[#cbd8ce] bg-white px-3 py-1.5 text-[#415247]">
              <span className={`size-2 rounded-full ${databaseConnected === true ? 'bg-[#58a947]' : databaseConnected === false ? 'bg-[#dc5149]' : 'bg-[#a6b1a9]'}`} />
              {databaseConnected === true ? 'Base local conectada' : databaseConnected === false ? 'Base local desconectada' : 'Comprobando base'}
            </Badge>
          </div>
        </header>

        <section className="grid flex-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <Card className={`overflow-hidden border-0 shadow-[0_20px_60px_rgba(40,65,47,0.12)] ${monitorState === 'alert' ? 'bg-[#fff0ed]' : monitorState === 'normal' ? 'bg-[#f1f9e9]' : 'bg-[#f8faf7]'}`}>
            <CardContent className="flex h-full min-h-[540px] flex-col justify-between p-0">
              <div className="flex items-center justify-between border-b border-black/5 px-6 py-5 sm:px-10">
                <div className="flex items-center gap-3">
                  <div className={`flex size-3 rounded-full ${monitorState === 'alert' ? 'bg-[#df4b43]' : monitorState === 'normal' ? 'bg-[#5bb64c]' : 'bg-[#a8b5aa]'}`} />
                  <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#59675e]">{current.label}</span>
                </div>
                {current.temperature && <span className="font-mono text-sm font-semibold text-[#536159]">LECTURA ACTUAL</span>}
              </div>

              <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center sm:px-12">
                {monitorState === 'standby' && <StandbyVisual />}
                {monitorState === 'normal' && <NormalVisual />}
                {monitorState === 'alert' && <AlertVisual />}
                {current.temperature && <p className={`mt-8 font-mono text-7xl font-bold tracking-[-0.08em] sm:text-8xl ${monitorState === 'alert' ? 'text-[#ce3d36]' : 'text-[#378d3d]'}`}>{current.temperature}</p>}
                <p className={`mt-5 max-w-3xl text-balance text-2xl font-semibold leading-tight sm:text-3xl ${monitorState === 'alert' ? 'text-[#862b28]' : 'text-[#173b2b]'}`}>
                  {monitorState === 'standby' && 'Acerca tu cabeza a la zona de lectura para medir tu temperatura'}
                  {monitorState === 'normal' && '¡Temperatura normal! Por favor, acerca tu mano al dispensador para higienizarte antes de ingresar'}
                  {monitorState === 'alert' && '¡Temperatura elevada detectada! Acceso restringido. Por favor, comunícate con el responsable'}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 border-t border-black/5 px-6 py-4 text-xs font-medium text-[#718078]">
                <Thermometer className="size-4" /> Umbral de seguridad: 38.0°C
              </div>
            </CardContent>
          </Card>

          <aside className="flex flex-col gap-5">
            <Card className="border-[#d5ded7] bg-[#f8faf7] shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#718078]">Panel de prueba</p><h2 className="mt-1 text-lg font-bold">Simular estado</h2></div>
                  <CircleUserRound className="size-5 text-[#718078]" />
                </div>
                <Separator className="my-5 bg-[#dbe4dd]" />
                <div className="flex flex-col gap-2">
                  <StateButton active={monitorState === 'standby'} onClick={() => setMonitorState('standby')} icon={<ScanFace />} label="En espera" />
                  <StateButton active={monitorState === 'normal'} onClick={() => setMonitorState('normal')} icon={<Check />} label="Temperatura normal" />
                  <StateButton active={monitorState === 'alert'} onClick={() => setMonitorState('alert')} icon={<AlertTriangle />} label="Temperatura elevada" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#d5ded7] bg-[#173b2b] text-white shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-3"><Database className="size-5 text-[#c8ef5d]" /><p className="font-semibold">Conexión local</p></div>
                <p className="mt-3 text-sm leading-relaxed text-[#c3d0c6]">Los registros de acceso se prepararán para guardarse en PocketBase.</p>
                <p className="mt-4 truncate rounded-lg bg-white/10 px-3 py-2 font-mono text-[11px] text-[#c8ef5d]">{POCKETBASE_URL}</p>
                {databaseConnected === false && <div className="mt-3 flex items-center gap-2 text-xs text-[#ffb3a7]"><WifiOff className="size-4" /> Inicia PocketBase local para conectar.</div>}
              </CardContent>
            </Card>
          </aside>
        </section>
      </div>
    </main>
  )
}

function StateButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return <Button variant="outline" onClick={onClick} className={`h-auto justify-start gap-3 rounded-xl border-[#d5ded7] px-4 py-3 text-left ${active ? 'border-[#173b2b] bg-[#173b2b] text-white hover:bg-[#173b2b] hover:text-white' : 'bg-white text-[#405047] hover:bg-[#edf3ed]'}`}>{icon}<span className="text-sm font-semibold">{label}</span></Button>
}

function StandbyVisual() { return <div className="relative flex size-36 items-center justify-center rounded-full border-2 border-dashed border-[#a9b8ad] text-[#597064]"><ScanFace className="size-16 stroke-[1.25]" /><span className="absolute -bottom-3 rounded-full bg-[#f8faf7] px-3 text-xs font-semibold uppercase tracking-widest">Acércate</span></div> }
function NormalVisual() { return <div className="flex size-28 items-center justify-center rounded-full bg-[#d8f1c9] text-[#378d3d]"><Hand className="size-14 animate-pulse stroke-[1.5]" /></div> }
function AlertVisual() { return <div className="flex size-28 items-center justify-center rounded-full bg-[#ffd6d0] text-[#ce3d36]"><AlertTriangle className="size-14 animate-pulse stroke-[1.5]" /></div> }


