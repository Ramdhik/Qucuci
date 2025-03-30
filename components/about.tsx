import Image from 'next/image';

export default function About() {
  return (
    <div className="relative h-screen ">
      {/* Background Image */}
      <Image src="/bg.png" alt="About Background" layout="fill" objectFit="cover" quality={100} className="absolute inset-0 z-0" />
      {/* Content Wrapper */}
      <div className="relative flex flex-col items-center justify-center px-6 text-white md:px-20">
        <h1 className="text-5xl font-bold text-center text-[#00476A] md:text-left mb-14">Our Service</h1>

        {/* Content Box */}
        <div className="flex flex-col items-center w-full gap-4 mt-6 md:flex-row">
          {/* Gambar */}
          <div className="flex justify-center md:justify-start">
            <Image src="/about.png" alt="Kualitas Terjamin" width={1000} height={550} />
          </div>

          {/* Teks */}
          <div className="mb-20 ml-4 text-center md:text-left">
            <h3 className="mt-2 text-3xl font-bold text-[#00476A]">Apa Yang Kami Tawarkan?</h3>
            <p className="mt-7  text-[#6D6B6B] w-full text-lg">
              Qucuci menawarkan layanan laundry antar-jemput yang praktis dan cepat. Pengguna bisa memesan secara online, memilih berat pakaian, menentukan waktu serta lokasi penjemputan, dan melakukan pembayaran digital. Dengan Qucuci,
              laundry jadi lebih mudah tanpa perlu datang ke tempat.
            </p>

            {/* Tombol */}
            <button className="py-4 mt-4 text-2xl transition bg-[#00C6FF] rounded-lg white font-semibold px-17 hover:bg-blue-600">Jelajahi</button>
          </div>
        </div>
      </div>
    </div>
  );
}
