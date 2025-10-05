"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { AppointmentFormData, Appointment, AppointmentStatus } from "@/lib/types"
import { SERVICE_PRICES, WAX_PRICES } from "@/lib/types"

export async function createAppointment(formData: AppointmentFormData): Promise<{
  success: boolean
  appointment?: Appointment
  error?: string
}> {
  try {
    const supabase = await getSupabaseServerClient()

    // Calculate price based on service type, car size and wax application
    const servicePrice = SERVICE_PRICES[formData.service_type][formData.car_size]
    const waxPrice = formData.wax_application ? WAX_PRICES[formData.car_size] : 0
    const totalPrice = servicePrice + waxPrice

    const appointmentData = {
      ...formData,
      price: totalPrice,
      status: "pendente" as const,
    }

    const { data, error } = await supabase.from("appointments").insert([appointmentData]).select().single()

    if (error) {
      console.error("[v0] Supabase error:", error)
      return {
        success: false,
        error: "Supabase não configurado. Use localStorage.",
        appointment: {
          ...appointmentData,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      }
    }

    revalidatePath("/admin")
    return { success: true, appointment: data }
  } catch (error) {
    console.error("[v0] Error creating appointment:", error)
    const servicePrice = SERVICE_PRICES[formData.service_type][formData.car_size]
    const waxPrice = formData.wax_application ? WAX_PRICES[formData.car_size] : 0
    const totalPrice = servicePrice + waxPrice
    
    return {
      success: false,
      error: "Supabase não configurado. Use localStorage.",
      appointment: {
        ...formData,
        price: totalPrice,
        status: "pendente" as const,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    }
  }
}

export async function getAppointments(): Promise<{
  success: boolean
  appointments?: Appointment[]
  error?: string
}> {
  try {
    const supabase = await getSupabaseServerClient()

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true })

    if (error) {
      console.error("[v0] Supabase error:", error)
      return { success: false, error: "Erro ao buscar agendamentos" }
    }

    return { success: true, appointments: data || [] }
  } catch (error) {
    console.error("[v0] Error fetching appointments:", error)
    return { success: false, error: "Erro ao buscar agendamentos" }
  }
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
): Promise<{
  success: boolean
  appointment?: Appointment
  error?: string
}> {
  try {
    const supabase = await getSupabaseServerClient()

    const { data, error } = await supabase.from("appointments").update({ status }).eq("id", id).select().single()

    if (error) {
      console.error("[v0] Supabase error:", error)
      return { success: false, error: "Supabase não configurado. Use localStorage." }
    }

    revalidatePath("/admin")
    return { success: true, appointment: data }
  } catch (error) {
    console.error("[v0] Error updating status:", error)
    return { success: false, error: "Supabase não configurado. Use localStorage." }
  }
}

export async function deleteAppointment(id: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = await getSupabaseServerClient()

    const { error } = await supabase.from("appointments").delete().eq("id", id)

    if (error) {
      console.error("[v0] Supabase error:", error)
      return { success: false, error: "Supabase não configurado. Use localStorage." }
    }

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting appointment:", error)
    return { success: false, error: "Supabase não configurado. Use localStorage." }
  }
}
