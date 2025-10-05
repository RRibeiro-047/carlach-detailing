"use client"

import { useState, useEffect, useMemo } from "react"
import { AppointmentCard } from "./appointment-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Calendar as CalendarIcon } from "lucide-react"
import type { Appointment, AppointmentStatus } from "@/lib/types"
import { getAppointments } from "@/app/actions"
import { getLocalAppointments, saveLocalAppointments } from "@/lib/storage"

// Função para formatar a data no formato DD/MM/YYYY
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  // Ajusta para o fuso horário local sem alterar a data
  const offset = date.getTimezoneOffset()
  const adjustedDate = new Date(date.getTime() + (offset * 60 * 1000))
  
  return adjustedDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC'
  })
}

// Função para agrupar agendamentos por data
const groupAppointmentsByDate = (appointments: Appointment[]) => {
  const grouped: Record<string, Appointment[]> = {}
  
  appointments.forEach(appointment => {
    const dateKey = formatDate(appointment.appointment_date)
    if (!grouped[dateKey]) {
      grouped[dateKey] = []
    }
    grouped[dateKey].push(appointment)
  })
  
  // Ordena as datas
  return Object.entries(grouped)
    .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
    .map(([date, apps]) => ({
      date,
      appointments: apps.sort((a, b) => a.appointment_time.localeCompare(b.appointment_time))
    }))
}

export function AppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const loadAppointments = async () => {
    setIsLoading(true)
    try {
      const result = await getAppointments()
      if (result.success && result.appointments) {
        setAppointments(result.appointments)
        saveLocalAppointments(result.appointments)
      } else {
        // Fallback to localStorage if Supabase fails
        const localData = getLocalAppointments()
        setAppointments(localData)
      }
    } catch (error) {
      console.error("[v0] Error loading appointments:", error)
      const localData = getLocalAppointments()
      setAppointments(localData)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAppointments()
  }, [])

  const filterAppointments = (status?: AppointmentStatus) => {
    let filtered = [...appointments]

    if (status) {
      filtered = filtered.filter((apt) => apt.status === status)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (apt) =>
          apt.client_name.toLowerCase().includes(term) ||
          apt.phone.includes(term) ||
          apt.car_model.toLowerCase().includes(term),
      )
    }

    return filtered
  }
  
  // Agrupa os agendamentos por data
  const groupedAppointments = useMemo(() => {
    return groupAppointmentsByDate(filterAppointments())
  }, [appointments, searchTerm])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando agendamentos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, telefone ou veículo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Todos ({appointments.length})</TabsTrigger>
          <TabsTrigger value="pendente">Pendentes ({filterAppointments("pendente").length})</TabsTrigger>
          <TabsTrigger value="confirmado">Confirmados ({filterAppointments("confirmado").length})</TabsTrigger>
          <TabsTrigger value="finalizado">Finalizados ({filterAppointments("finalizado").length})</TabsTrigger>
          <TabsTrigger value="cancelado">Cancelados ({filterAppointments("cancelado").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6 space-y-8">
          {groupedAppointments.length > 0 ? (
            groupedAppointments.map(({ date, appointments }) => (
              <div key={date} className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-medium text-muted-foreground">
                  <CalendarIcon className="h-5 w-5" />
                  <span>{date}</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                  {appointments.map((appointment) => (
                    <AppointmentCard 
                      key={appointment.id} 
                      appointment={appointment} 
                      onUpdate={loadAppointments} 
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">Nenhum agendamento encontrado</div>
          )}
        </TabsContent>

        <TabsContent value="pendente" className="mt-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filterAppointments("pendente").map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} onUpdate={loadAppointments} />
            ))}
          </div>
          {filterAppointments("pendente").length === 0 && (
            <div className="text-center py-12 text-muted-foreground">Nenhum agendamento pendente</div>
          )}
        </TabsContent>

        <TabsContent value="confirmado" className="mt-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filterAppointments("confirmado").map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} onUpdate={loadAppointments} />
            ))}
          </div>
          {filterAppointments("confirmado").length === 0 && (
            <div className="text-center py-12 text-muted-foreground">Nenhum agendamento confirmado</div>
          )}
        </TabsContent>

        <TabsContent value="finalizado" className="mt-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filterAppointments("finalizado").map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} onUpdate={loadAppointments} />
            ))}
          </div>
          {filterAppointments("finalizado").length === 0 && (
            <div className="text-center py-12 text-muted-foreground">Nenhum agendamento finalizado</div>
          )}
        </TabsContent>

        <TabsContent value="cancelado" className="mt-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {filterAppointments("cancelado").map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} onUpdate={loadAppointments} />
            ))}
          </div>
          {filterAppointments("cancelado").length === 0 && (
            <div className="text-center py-12 text-muted-foreground">Nenhum agendamento cancelado</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
