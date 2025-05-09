import React from 'react';
import { Phone, Mail, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <div className="bg-[#0494BD] text-white w-full">
      <div className="container px-6 py-10 mx-auto md:px-20 ">
        <div className="flex flex-col justify-center space-x-28 md:flex-row">
          {/* Tentang Qucuci Column */}
          <div className="flex flex-col space-y-2">
            <h4 className="mb-2 text-2xl font-bold">Tentang Qucuci</h4>
            <a href="#" className="hover:underline">
              About
            </a>
            <a href="#" className="hover:underline">
              Contact Us
            </a>
            <a href="#" className="hover:underline">
              Services
            </a>
            <a href="#" className="hover:underline">
              Membership
            </a>
          </div>

          {/* Pelajari Lebih Lanjut Column */}
          <div className="flex flex-col space-y-2">
            <h4 className="mb-2 text-2xl font-bold">Pelajari Lebih Lanjut</h4>
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:underline">
              Security
            </a>
            <a href="#" className="hover:underline">
              Terms & Conditions
            </a>
            <a href="#" className="hover:underline">
              FAQs
            </a>
          </div>

          {/* Contact Information Column */}
          <div className="flex flex-col space-y-2">
            <h4 className="mb-2 text-2xl font-bold">Hubungi Kami</h4>
            <div className="flex items-center space-x-2">
              <Phone size={20} />
              <span>082208220822</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail size={20} />
              <span>@qucucid@gmail.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Instagram size={20} />
              <span>@qucuci.id</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
