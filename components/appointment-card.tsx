"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Calendar, Clock, Car, Phone, Trash2, MessageCircle } from "lucide-react"
import type { Appointment, AppointmentStatus } from "@/lib/types"
import { STATUS_LABELS, SERVICE_TYPE_LABELS, CAR_SIZE_LABELS } from "@/lib/types"
import { updateAppointmentStatus, deleteAppointment } from "@/app/actions"
import { updateLocalAppointment, deleteLocalAppointment } from "@/lib/storage"
import { generateWhatsAppMessage, openWhatsApp } from "@/lib/whatsapp"

interface AppointmentCardProps {
  appointment: Appointment
  onUpdate: () => void
}

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  pendente: "bg-yellow-500",
  confirmado: "bg-blue-500",
  finalizado: "bg-green-500",
  cancelado: "bg-red-500",
}

export function AppointmentCard({ appointment, onUpdate }: AppointmentCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleStatusChange = async (newStatus: AppointmentStatus) => {
    setIsUpdating(true)
    try {
      const result = await updateAppointmentStatus(appointment.id, newStatus)

      updateLocalAppointment(appointment.id, { status: newStatus })

      if (newStatus === "confirmado" || newStatus === "finalizado") {
        const message = generateWhatsAppMessage({ ...appointment, status: newStatus })
        if (message) {
          setTimeout(() => {
            openWhatsApp(appointment.phone, message)
          }, 500)
        }
      }

      onUpdate()
    } catch (error) {
      console.error("[v0] Error updating status:", error)
      updateLocalAppointment(appointment.id, { status: newStatus })
      onUpdate()
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteAppointment(appointment.id)
      deleteLocalAppointment(appointment.id)
      onUpdate()
    } catch (error) {
      console.error("[v0] Error deleting appointment:", error)
      deleteLocalAppointment(appointment.id)
      onUpdate()
    } finally {
      setIsDeleting(false)
    }
  }

  const handleWhatsApp = () => {
    const message = generateWhatsAppMessage(appointment)
    if (message) {
      openWhatsApp(appointment.phone, message)
    }
  }

  // Ajusta a data para o fuso horário local sem alterar o dia
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    // Adiciona o deslocamento de fuso horário para evitar a conversão incorreta
    const offset = date.getTimezoneOffset()
    const adjustedDate = new Date(date.getTime() + (offset * 60 * 1000))
    return adjustedDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC' // Força o uso de UTC para evitar ajustes adicionais
    })
  }
  
  const formattedDate = formatDate(appointment.appointment_date)
  const canSendWhatsApp = appointment.status === "confirmado" || appointment.status === "finalizado"

  return (
    <Card className="hover:shadow-md transition-shadow text-sm">
      <CardHeader className="p-3 pb-0">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5">
            <h3 className="font-semibold text-base">{appointment.client_name}</h3>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Phone className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{appointment.phone}</span>
            </div>
          </div>
          <Badge className={`text-[10px] px-1.5 py-0.5 h-5 ${STATUS_COLORS[appointment.status]}`}>
            {STATUS_LABELS[appointment.status]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-3 space-y-2">
        <div className="flex items-center gap-1.5">
          <Car className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <span className="truncate">
            {appointment.car_model} ({CAR_SIZE_LABELS[appointment.car_size]})
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <span>{formattedDate}</span>
          <span className="text-muted-foreground">•</span>
          <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <span>{appointment.appointment_time}</span>
        </div>

        <div className="pt-1.5 border-t">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">{SERVICE_TYPE_LABELS[appointment.service_type]}</span>
            <span className="text-base font-bold text-primary">R$ {appointment.price.toFixed(2)}</span>
          </div>
        </div>

        {appointment.notes && (
          <div className="pt-1.5 border-t">
            <p className="text-xs text-muted-foreground line-clamp-2">{appointment.notes}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-3 pt-0 flex flex-col gap-2">
        <div className="w-full">
          <Select
            value={appointment.status}
            onValueChange={(value: AppointmentStatus) => handleStatusChange(value)}
            disabled={isUpdating}
          >
            <SelectTrigger className="w-full h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value} className="text-xs">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent h-8 text-xs"
            onClick={handleWhatsApp}
            disabled={!canSendWhatsApp}
          >
            <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
            <span className="truncate">WhatsApp</span>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="h-8 w-8 p-0" disabled={isDeleting}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  )
}
