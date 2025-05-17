"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const formSchema = z.object({
  serviceType: z.enum(["Normal", "Instant"]),
  weight: z.string().min(1, "Berat pakaian harus diisi"),
  address: z.string().min(1, "Alamat harus diisi"),
  paymentMethod: z.enum(["BCA", "BNI", "Mandiri", "Cash"]),
  phone: z.string().min(1, "Nomor telepon harus diisi"),
  promoCode: z.string().optional(),
})

export function BookingForm() {
  const supabase = createClientComponentClient()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serviceType: "Normal",
      weight: "",
      address: "",
      paymentMethod: "BCA",
      phone: "",
      promoCode: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      
      // Calculate price based on weight and service type
      const basePrice = 50000 // Base price per kg
      const weight = parseFloat(values.weight)
      const price = values.serviceType === "Instant" 
        ? basePrice * weight * 1.5  // 50% more expensive for instant
        : basePrice * weight

      const { error } = await supabase
        .from('orders')
        .insert([
          {
            service_type: values.serviceType,
            weight: weight,
            address: values.address,
            payment_method: values.paymentMethod,
            phone: values.phone,
            promo_code: values.promoCode,
            total_price: price,
            status: 'pending'
          }
        ])

      if (error) throw error

      // Reset form after successful submission
      form.reset()
      alert('Pesanan berhasil dibuat!')
    } catch (error) {
      console.error('Error:', error)
      alert('Terjadi kesalahan saat membuat pesanan')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6  mx-auto p-4">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="serviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pilih Jenis Layanan</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Normal" id="normal" />
                      <Label htmlFor="normal">Normal (2-3 hari)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Instant" id="instant" />
                      <Label htmlFor="instant">Instant (3-4 jam)</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Masukkan Berat Pakaian</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Input type="number" step="0.1" placeholder="Masukkan berat / jumlah pakaian anda" {...field} />
                    <span className="text-sm">Kg</span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Masukkan Alamat Penjemputan</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan Alamat Anda" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pilih Metode Bayar</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih metode pembayaran" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BCA">BCA</SelectItem>
                    <SelectItem value="BNI">BNI</SelectItem>
                    <SelectItem value="Mandiri">Mandiri</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Masukkan Info Kontak</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan Nomor Telepon Anda" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="promoCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Punya Kode Promo?</FormLabel>
                <FormControl>
                  <Input placeholder="Masukkan Promo Jika Ada" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Memproses..." : "Bayar"}
        </Button>

        <p className="text-sm text-center text-gray-500 mt-4">
          Dengan klik tombol diatas, kamu sudah menyetujui layanan & ketentuan yang berlaku.
        </p>
      </form>
    </Form>
  )
} 