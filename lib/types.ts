export type CarSize = "sedan" | "suv" | "caminhonete"
export type ServiceType = "basica" | "premium" | "detalhada"
export type AppointmentStatus = "pendente" | "confirmado" | "finalizado" | "cancelado"

export interface Appointment {
  id: string
  client_name: string
  phone: string
  car_model: string
  car_size: CarSize
  service_type: ServiceType
  appointment_date: string
  appointment_time: string
  price: number
  status: AppointmentStatus
  notes?: string
  created_at: string
  updated_at: string
}

export interface AppointmentFormData {
  client_name: string
  phone: string
  car_model: string
  car_size: CarSize
  service_type: ServiceType
  wax_application: boolean
  appointment_date: string
  appointment_time: string
  notes?: string
}

export const WAX_PRICES: Record<CarSize, number> = {
  sedan: 40,
  suv: 50,
  caminhonete: 60,
}

export const SERVICE_PRICES: Record<ServiceType, Record<CarSize, number>> = {
  basica: {
    sedan: 60,
    suv: 70,
    caminhonete: 80,
  },
  premium: {
    sedan: 90,
    suv: 110,
    caminhonete: 140,
  },
  detalhada: {
    sedan: 250,
    suv: 300,
    caminhonete: 400,
  },
}

export const CAR_SIZE_LABELS: Record<CarSize, string> = {
  sedan: "Sedan",
  suv: "SUV",
  caminhonete: "Caminhonete",
}

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  basica: "Básica",
  premium: "Premium",
  detalhada: "Detalhada",
}

export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  pendente: "Pendente",
  confirmado: "Confirmado",
  finalizado: "Finalizado",
  cancelado: "Cancelado",
}

export const AVAILABLE_TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
] as const

export const BUSINESS_DAYS = [1, 2, 3, 4, 5, 6] // Monday to Saturday (0 = Sunday, 6 = Saturday)

export const LUNCH_BREAK = {
  start: "12:00",
  end: "13:00",
}
