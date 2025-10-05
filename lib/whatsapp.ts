import { type Appointment, STATUS_LABELS, SERVICE_TYPE_LABELS, CAR_SIZE_LABELS } from "./types"

export function generateWhatsAppMessage(appointment: Appointment): string {
  const { client_name, car_model, car_size, service_type, appointment_date, appointment_time, price, status } =
    appointment

  const formattedDate = new Date(appointment_date).toLocaleDateString("pt-BR")
  const serviceLabel = SERVICE_TYPE_LABELS[service_type]
  const carSizeLabel = CAR_SIZE_LABELS[car_size]
  const statusLabel = STATUS_LABELS[status]

  if (status === "confirmado") {
    return (
      `Olá ${client_name}! Seu agendamento foi *${statusLabel}*!\n\n` +
      `📅 Data: ${formattedDate}\n` +
      `🕐 Horário: ${appointment_time}\n` +
      `🚗 Veículo: ${car_model} (${carSizeLabel})\n` +
      `✨ Serviço: ${serviceLabel}\n` +
      `💰 Valor: R$ ${price.toFixed(2)}\n\n` +
      `Aguardamos você na Carlach Detailing!`
    )
  }

  if (status === "finalizado") {
    return (
      `Olá ${client_name}! Seu serviço foi *${statusLabel}*!\n\n` +
      `✨ Serviço: ${serviceLabel}\n` +
      `🚗 Veículo: ${car_model}\n` +
      `💰 Valor: R$ ${price.toFixed(2)}\n\n` +
      `Obrigado por confiar na Carlach Detailing! 🚗✨`
    )
  }

  return ""
}

export function openWhatsApp(phone: string, message: string): void {
  const cleanPhone = phone.replace(/\D/g, "")
  const encodedMessage = encodeURIComponent(message)
  const url = `https://wa.me/55${cleanPhone}?text=${encodedMessage}`
  window.open(url, "_blank")
}
