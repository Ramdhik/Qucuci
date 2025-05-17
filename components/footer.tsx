import React from 'react';
import { Phone, Mail, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    // Main footer container with full width and background color
    <footer className="bg-[#0494BD] text-white w-full ">
      {' '}
      {/* Changed div to footer semantic tag */}
      {/* Inner container for padding and centering */}
      <div className="container px-6 py-10 mx-auto md:px-20">
        {/* Flex container for columns. Use flex-col on mobile, flex-row on md+ */}
        {/* Added gap for spacing between columns */}
        <div className="flex flex-col md:flex-row justify-between md:space-x-8 gap-8">
          {' '}
          {/* Adjusted spacing and added justify-between */}
          {/* Tentang Qucuci Column */}
          {/* Added width classes for larger screens and mb-8 for mobile spacing */}
          <div className="flex flex-col space-y-2 w-full md:w-1/3 lg:w-auto mb-8 md:mb-0">
            <h4 className="mb-2 text-xl font-bold md:text-2xl">Tentang Qucuci</h4> {/* Adjusted font size */}
            <a href="#" className="hover:underline text-sm md:text-base">
              About
            </a>{' '}
            {/* Adjusted text size */}
            <a href="#" className="hover:underline text-sm md:text-base">
              Contact Us
            </a>
            <a href="#" className="hover:underline text-sm md:text-base">
              Services
            </a>
            <a href="#" className="hover:underline text-sm md:text-base">
              Membership
            </a>
          </div>
          {/* Pelajari Lebih Lanjut Column */}
          {/* Added width classes for larger screens and mb-8 for mobile spacing */}
          <div className="flex flex-col space-y-2 w-full md:w-1/3 lg:w-auto mb-8 md:mb-0">
            <h4 className="mb-2 text-xl font-bold md:text-2xl">Pelajari Lebih Lanjut</h4> {/* Adjusted font size */}
            <a href="#" className="hover:underline text-sm md:text-base">
              Privacy Policy
            </a>{' '}
            {/* Adjusted text size */}
            <a href="#" className="hover:underline text-sm md:text-base">
              Security
            </a>
            <a href="#" className="hover:underline text-sm md:text-base">
              Terms & Conditions
            </a>
            <a href="#" className="hover:underline text-sm md:text-base">
              FAQs
            </a>
          </div>
          {/* Contact Information Column */}
          {/* Added width classes for larger screens */}
          <div className="flex flex-col space-y-2 w-full md:w-1/3 lg:w-auto">
            <h4 className="mb-2 text-xl font-bold md:text-2xl">Hubungi Kami</h4> {/* Adjusted font size */}
            <div className="flex items-center space-x-2 text-sm md:text-base">
              {' '}
              {/* Adjusted text size */}
              <Phone size={20} />
              <span>082208220822</span>
            </div>
            <div className="flex items-center space-x-2 text-sm md:text-base">
              {' '}
              {/* Adjusted text size */}
              <Mail size={20} />
              <span>@qucucid@gmail.com</span>
            </div>
            <div className="flex items-center space-x-2 text-sm md:text-base">
              {' '}
              {/* Adjusted text size */}
              <Instagram size={20} />
              <span>@qucuci.id</span>
            </div>
          </div>
        </div>
      </div>
    </footer> // Changed div to footer semantic tag
  );
}
