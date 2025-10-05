"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Car, Sparkles, AlertCircle, Check, AlertCircleIcon } from "lucide-react"
import { createAppointment, getAppointments } from "@/app/actions"
import { addLocalAppointment, getLocalAppointments } from "@/lib/storage"
import type { AppointmentFormData, CarSize, ServiceType } from "@/lib/types"
import { SERVICE_PRICES, CAR_SIZE_LABELS, SERVICE_TYPE_LABELS, BUSINESS_DAYS, WAX_PRICES } from "@/lib/types"
import { getAvailableTimeSlots, isTimeSlotAvailable } from "@/lib/utils"

export function AppointmentForm() {
  const [formData, setFormData] = useState<AppointmentFormData>({
    client_name: "",
    phone: "",
    car_model: "",
    car_size: "sedan",
    service_type: "basica",
    wax_application: false,
    appointment_date: "",
    appointment_time: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [dateError, setDateError] = useState<string | null>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)

  const calculatePrice = () => {
    const servicePrice = SERVICE_PRICES[formData.service_type][formData.car_size]
    const waxPrice = formData.wax_application ? WAX_PRICES[formData.car_size] : 0
    return servicePrice + waxPrice
  }

  const isBusinessDay = (dateString: string): boolean => {
    if (!dateString) return true
    const date = new Date(dateString + "T00:00:00")
    const dayOfWeek = date.getDay()
    return BUSINESS_DAYS.includes(dayOfWeek)
  }

  // Carrega os agendamentos ao iniciar
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const result = await getAppointments()
        if (result.success && result.appointments) {
          setAppointments(result.appointments)
        } else {
          // Fallback para localStorage
          setAppointments(getLocalAppointments())
        }
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error)
        setAppointments(getLocalAppointments())
      }
    }
    
    loadAppointments()
  }, [])

  // Atualiza os horários disponíveis quando a data muda
  useEffect(() => {
    if (formData.appointment_date) {
      const slots = getAvailableTimeSlots(appointments, formData.appointment_date)
      setAvailableTimeSlots(slots)
      
      // Se o horário atual não estiver mais disponível, limpa o horário selecionado
      if (formData.appointment_time && !slots.includes(formData.appointment_time)) {
        setFormData(prev => ({ ...prev, appointment_time: "" }))
      }
    }
  }, [formData.appointment_date, appointments])

  const handleDateChange = (dateString: string) => {
    setFormData({ ...formData, appointment_date: dateString, appointment_time: "" })

    if (dateString && !isBusinessDay(dateString)) {
      setDateError("Não trabalhamos aos domingos. Por favor, escolha de segunda a sábado.")
    } else {
      setDateError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isBusinessDay(formData.appointment_date)) {
      setMessage({ type: "error", text: "Não trabalhamos aos domingos. Por favor, escolha de segunda a sábado." })
      return
    }

    // Verifica se o horário ainda está disponível
    if (!isTimeSlotAvailable(appointments, formData.appointment_date, formData.appointment_time)) {
      setMessage({ 
        type: "error", 
        text: "Este horário já foi reservado. Por favor, escolha outro horário." 
      })
      
      // Atualiza os horários disponíveis
      const updatedSlots = getAvailableTimeSlots(appointments, formData.appointment_date)
      setAvailableTimeSlots(updatedSlots)
      setFormData(prev => ({ ...prev, appointment_time: "" }))
      
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await createAppointment(formData)

      if (result.appointment) {
        addLocalAppointment(result.appointment)
        setMessage({ type: "success", text: "Agendamento realizado com sucesso!" })
        
        // Atualiza a lista de agendamentos
        const updatedAppointments = [...appointments, result.appointment]
        setAppointments(updatedAppointments)
        
        // Atualiza os horários disponíveis para a data selecionada
        if (formData.appointment_date) {
          const updatedSlots = getAvailableTimeSlots(updatedAppointments, formData.appointment_date)
          setAvailableTimeSlots(updatedSlots)
        }
        
        // Limpa o formulário
        setFormData({
          client_name: "",
          phone: "",
          car_model: "",
          car_size: "sedan",
          service_type: "basica",
          wax_application: false,
          appointment_date: "",
          appointment_time: "",
          notes: "",
        })
        setDateError(null)
      } else {
        setMessage({ type: "error", text: result.error || "Erro ao criar agendamento" })
      }
    } catch (error) {
      console.error("Erro ao processar o agendamento:", error)
      setMessage({ type: "error", text: "Ocorreu um erro ao processar seu agendamento. Por favor, tente novamente." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const price = calculatePrice()
  const servicePrice = SERVICE_PRICES[formData.service_type][formData.car_size]
  const waxPrice = formData.wax_application ? WAX_PRICES[formData.car_size] : 0

  return (
    <Card className="w-full max-w-2xl mx-auto border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2 text-foreground">
          <Sparkles className="h-6 w-6 text-primary" />
          Agendar Serviço
        </CardTitle>
        <CardDescription className="text-foreground/70">
          Preencha os dados para agendar seu serviço de detailing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="client_name">Nome Completo</Label>
              <Input
                id="client_name"
                required
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                placeholder="João Silva"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="car_model">Modelo do Veículo</Label>
            <div className="relative">
              <Car className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="car_model"
                required
                value={formData.car_model}
                onChange={(e) => setFormData({ ...formData, car_model: e.target.value })}
                placeholder="Ex: Honda Civic 2020"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="car_size">Tamanho do Veículo</Label>
            <Select
              value={formData.car_size}
              onValueChange={(value: CarSize) => setFormData({ ...formData, car_size: value })}
            >
              <SelectTrigger id="car_size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CAR_SIZE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="service_type">Pacote de Serviço</Label>
              <Select
                value={formData.service_type}
                onValueChange={(value: ServiceType) => setFormData({ ...formData, service_type: value })}
              >
                <SelectTrigger id="service_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SERVICE_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex items-center justify-between w-full gap-4">
                        <span>{label}</span>
                        <span className="text-primary font-semibold">
                          R$ {SERVICE_PRICES[value as ServiceType][formData.car_size].toFixed(2)}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  className={`flex items-center justify-between w-full p-4 border rounded-lg transition-colors ${
                    formData.wax_application ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => setFormData({ ...formData, wax_application: !formData.wax_application })}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center justify-center w-5 h-5 rounded border ${
                      formData.wax_application ? 'bg-primary border-primary' : 'border-muted-foreground/50'
                    }`}>
                      {formData.wax_application && <Check className="h-4 w-4 text-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Aplicação de Cera</p>
                      <p className="text-xs text-muted-foreground">
                        Proteção extra para a pintura do veículo
                      </p>
                    </div>
                  </div>
                  <span className="text-primary font-semibold">
                    + R$ {WAX_PRICES[formData.car_size].toFixed(2)}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="appointment_date">Data</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="appointment_date"
                  type="date"
                  required
                  value={formData.appointment_date}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="pl-10"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              {dateError && (
                <div className="flex items-start gap-2 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{dateError}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground">Funcionamento: Segunda a Sábado, 08:00 às 18:00</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="appointment_time">Horário</Label>
                {formData.appointment_date && availableTimeSlots.length === 0 && (
                  <span className="text-xs text-red-500">Nenhum horário disponível</span>
                )}
              </div>
              <Select
                value={formData.appointment_time}
                onValueChange={(value) => setFormData({ ...formData, appointment_time: value })}
                disabled={!formData.appointment_date || availableTimeSlots.length === 0}
                required
              >
                <SelectTrigger id="appointment_time">
                  <SelectValue placeholder={
                    !formData.appointment_date 
                      ? "Selecione uma data primeiro" 
                      : availableTimeSlots.length === 0 
                        ? "Nenhum horário disponível"
                        : "Selecione um horário"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {availableTimeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {time}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Horário de almoço: 12:00 - 13:00 (fechado)</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Alguma informação adicional sobre o veículo ou serviço..."
              rows={3}
            />
          </div>

          <div className="rounded-lg bg-primary/10 p-4 border border-primary/20">
            <div className="space-y-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Serviço {SERVICE_TYPE_LABELS[formData.service_type]}</span>
                  <span>R$ {servicePrice.toFixed(2)}</span>
                </div>
                {formData.wax_application && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Aplicação de Cera</span>
                    <span>+ R$ {waxPrice.toFixed(2)}</span>
                  </div>
                )}
                <div className="h-px bg-border my-2" />
                <div className="flex items-center justify-between font-medium">
                  <span>Total</span>
                  <span className="text-lg">R$ {price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg mb-4 ${
                message.type === "success"
                  ? "bg-green-50 text-green-900 border border-green-200"
                  : "bg-red-50 text-red-900 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || !!dateError}>
            {isSubmitting ? "Agendando..." : "Confirmar Agendamento"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
