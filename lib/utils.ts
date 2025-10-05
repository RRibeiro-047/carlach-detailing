import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Appointment } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isTimeSlotAvailable = (
  appointments: Appointment[],
  date: string,
  time: string,
  excludeAppointmentId?: string
): boolean => {
  return !appointments.some(appointment => {
    // Pula o agendamento atual na verificação (para edição)
    if (excludeAppointmentId && appointment.id === excludeAppointmentId) {
      return false
    }
    
    // Verifica se é no mesmo dia e horário
    return (
      appointment.appointment_date === date && 
      appointment.appointment_time === time
    )
  })
}

export const getAvailableTimeSlots = (
  appointments: Appointment[], 
  date: string,
  excludeAppointmentId?: string
): string[] => {
  const allTimeSlots = [
    "08:00", "09:00", "10:00", "11:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00"
  ]

  return allTimeSlots.filter(time => 
    isTimeSlotAvailable(appointments, date, time, excludeAppointmentId)
  )
}
