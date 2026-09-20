import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <Helmet>
        <title>Contact Us | EstateSocial</title>
        <meta name="description" content="Get in touch with the EstateSocial team. We are here to help." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Contact Our Team</h1>
          <p className="text-lg text-gray-600">Have questions about a property or need help with your account? We're here to assist you every step of the way.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Contact Form */}
          <div className="bg-gray-50 p-8 md:p-10 rounded-3xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all bg-white" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all bg-white" placeholder="Doe" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all bg-white" placeholder="john@example.com" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all bg-white">
                  <option>General Inquiry</option>
                  <option>Property Support</option>
                  <option>Agent Registration</option>
                  <option>Technical Issue</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                <textarea rows="4" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all bg-white resize-none" placeholder="How can we help you?"></textarea>
              </div>

              <button className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-colors">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-black text-gray-900 mb-8">Our Headquarters</h2>
            
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="bg-gray-100 p-4 rounded-full text-gray-900 mr-6">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Office Address</h3>
                  <p className="text-gray-600 leading-relaxed">
                    123 Real Estate Ave<br />
                    Commercial Broadway, DHA Phase 8<br />
                    Lahore, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-gray-100 p-4 rounded-full text-gray-900 mr-6">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Phone Number</h3>
                  <p className="text-gray-600 leading-relaxed">
                    <a href="tel:+923001234567" className="hover:text-gray-900 transition-colors">+92 300 1234567</a><br />
                    <a href="tel:+924231234567" className="hover:text-gray-900 transition-colors">+92 423 1234567</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-gray-100 p-4 rounded-full text-gray-900 mr-6">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Email Address</h3>
                  <p className="text-gray-600 leading-relaxed">
                    <a href="mailto:support@estatesocial.com" className="hover:text-gray-900 transition-colors">support@estatesocial.com</a><br />
                    <a href="mailto:partners@estatesocial.com" className="hover:text-gray-900 transition-colors">partners@estatesocial.com</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-gray-100 p-4 rounded-full text-gray-900 mr-6">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Business Hours</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 2:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

