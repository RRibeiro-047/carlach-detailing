import type { Appointment } from "./types"

const STORAGE_KEY = "carlach_appointments"

export function getLocalAppointments(): Appointment[] {
  if (typeof window === "undefined") return []

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("[v0] Error reading from localStorage:", error)
    return []
  }
}

export function saveLocalAppointments(appointments: Appointment[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments))
  } catch (error) {
    console.error("[v0] Error saving to localStorage:", error)
  }
}

export function addLocalAppointment(appointment: Appointment): void {
  const appointments = getLocalAppointments()
  appointments.push(appointment)
  saveLocalAppointments(appointments)
}

export function updateLocalAppointment(id: string, updates: Partial<Appointment>): void {
  const appointments = getLocalAppointments()
  const index = appointments.findIndex((a) => a.id === id)

  if (index !== -1) {
    appointments[index] = { ...appointments[index], ...updates, updated_at: new Date().toISOString() }
    saveLocalAppointments(appointments)
  }
}

export function deleteLocalAppointment(id: string): void {
  const appointments = getLocalAppointments()
  const filtered = appointments.filter((a) => a.id !== id)
  saveLocalAppointments(filtered)
}
