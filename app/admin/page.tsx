"use client"

import { useState, useEffect } from "react"
import { AppointmentsList } from "@/components/appointments-list"
import { AdminLogin } from "@/components/admin-login"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowLeft, LogOut } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const auth = localStorage.getItem("carlach_admin_auth")
    setIsAuthenticated(auth === "true")
    setIsLoading(false)
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("carlach_admin_auth")
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground">Carregando...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />
  }

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon" className="border-primary/20 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Image
              src="/logo.png"
              alt="Carlach Detailing"
              width={200}
              height={60}
              className="h-auto w-auto max-w-[200px]"
            />
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-foreground">
                <Calendar className="h-8 w-8 text-primary" />
                Painel Administrativo
              </h1>
              <p className="text-muted-foreground mt-1">Gerencie todos os agendamentos da Carlach Detailing</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="border-primary/20 bg-transparent">
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        <AppointmentsList />
      </div>
    </main>
  )
}
