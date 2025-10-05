import { AppointmentForm } from "@/components/appointment-form"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="container mx-auto">
        <div className="flex justify-end mb-4">
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Admin
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="Carlach Detailing"
              width={300}
              height={80}
              priority
              className="h-auto w-auto max-w-[300px]"
            />
          </div>
          <p className="text-lg text-muted-foreground text-balance">
            Agende seu serviço de estética automotiva com facilidade
          </p>
        </div>

        <AppointmentForm />
      </div>
    </main>
  )
}
