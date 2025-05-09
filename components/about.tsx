import Image from 'next/image';

export default function About() {
  return (
    <div className="relative h-[70vh] ">
      {/* Background Image */}
      <Image src="/bg.png" alt="About Background" layout="fill" objectFit="cover" quality={100} className="absolute inset-0 z-0" />
      {/* Content Wrapper */}
      <div className="relative flex flex-col items-center justify-center  text-white md:px-20 mt-20">
        {/* <h1 className="text-5xl font-bold text-center text-[#00476A] md:text-left ">About US</h1> */}

        {/* Content Box */}
        <div className="flex flex-col items-center w-full gap-4 md:flex-row">
          {/* Gambar */}
          <div className="flex justify-center md:justify-start">
            <Image src="/new.png" alt="Kualitas Terjamin" width={1000} height={550} />
          </div>

          {/* Teks */}
          <div className=" ml-4 text-center md:text-left">
            <h3 className="mt-2 text-3xl font-bold text-[#00476A]">Apa Itu Qucuci?</h3>
            <p className="mt-7  text-[#6D6B6B] w-full text-lg">
              Qucuci adalah aplikasi web yang menyediakan layanan antar-jemput pakaian laundry secara digital. Aplikasi ini memudahkan pelanggan dalam memesan layanan laundry tanpa harus datang langsung ke tempat laundry
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
