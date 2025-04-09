import { BookingForm } from "@/components/BookingForm"
import Image from "next/image"
import { Toaster } from "sonner"

export default function PemesananPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Toaster position="top-center" />
      {/* Background circles */}
      <div className="absolute top-0 left-0  bg-blue-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-0 right-0 bg-blue-100 rounded-full blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Card container */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 relative overflow-hidden">

            <BookingForm />
          </div>
        </div>
      </div>
    </div>
  )
}
