import Image from 'next/image';
import { CircleCheck } from 'lucide-react';
import { Button } from './ui/button';

export default function Hero() {
  return (
    <>
      {/* Container Hero dengan h-screen lebih pendek */}
      <div className="relative h-[90vh] w-full overflow-hidden">
        {/* Background Image */}
        <Image src="/heroImage.png" alt="Background Image" layout="fill" objectFit="cover" objectPosition="center" quality={100} />

        {/* Overlay dengan Teks dan Tombol */}
        <div className="absolute left-0 flex flex-col items-center justify-center w-full h-full text-white bottom-14">
          <div className="text-start">
            <p className="flex items-center justify-center mb-4 text-base">
              <span className="ml-2 mr-2">
                <CircleCheck size={20} className="text-[#00C6FF]" />
              </span>
              Trusted{' '}
              <span className="ml-2 mr-2">
                <CircleCheck size={20} className="text-[#00C6FF]" />
              </span>{' '}
              Simple{' '}
              <span className="ml-2 mr-2">
                <CircleCheck size={20} className="text-[#00C6FF]" />
              </span>{' '}
              Affordable
            </p>
            <h1 className="text-2xl font-semibold md:text-5xl lg:text-5xl mb-7 text-center">Layanan Antar & Jemput Laundry</h1>
            <h2 className="mb-8 text-4xl font-semibold md:text-3xl lg:text-5xl">
              Untuk Kamu - <span className="text-[#00C6FF]">Cepat, Bersih, & Wangi!</span>
            </h2>
          </div>

          {/* Tombol Contact */}
          <Button variant="outline" className="px-8 py-3 text-lg font-bold transition duration-300 rounded-xl bg bg-none">
            Our Contact
          </Button>
        </div>
      </div>
      {/* Kotak Fitur (di luar container Hero) */}
      <div className="absolute z-10 -mt-14  mx-40 max-w-7xl">
        <div className="container grid grid-cols-1 gap-8 mx-auto bg-white shadow-lg md:grid-cols-3 rounded-3xl">
          {/* Proses Cepat */}
          <div className="flex flex-row items-center justify-center p-5 text-start ">
            <Image src="/waktu.png" alt="Proses Cepat" width={80} height={80} />
            <div className="flex-col ml-5">
              <h3 className="mt-4 text-xl font-semibold text-gray-800">Proses Cepat</h3>
              <p className="text-gray-600">Laundry selesai tanpa menunggu lama.</p>
            </div>
          </div>

          {/* Kualitas Terjamin */}
          <div className="flex flex-row items-center justify-center p-5 text-start ">
            <Image src="/baju.png" alt="Kualitas Terjamin" width={80} height={80} />
            <div className="flex-col ml-5">
              <h3 className="mt-4 text-xl font-semibold text-gray-800">Kualitas Terjamin</h3>
              <p className="text-gray-600">Pakaian bersih maksimal dengan perawatan terbaik.</p>
            </div>
          </div>

          {/* Wangi Harum */}
          <div className="flex flex-row items-center justify-center p-5 text-start ">
            <Image src="/angin.png" alt="Wangi Harum" width={80} height={80} />
            <div className="flex-col ml-5">
              <h3 className="mt-4 text-xl font-semibold text-gray-800">Wangi Harum</h3>
              <p className="text-gray-600">Pilihan aroma eksklusif yang tahan lama.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
