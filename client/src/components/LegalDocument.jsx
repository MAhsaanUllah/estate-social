import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText } from 'lucide-react';

export default function LegalDocument({ title, lastUpdated, children }) {
  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <Helmet>
        <title>{title} | EstateSocial</title>
      </Helmet>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 text-center">
          <div className="bg-gray-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-6 text-gray-900">
            <FileText className="h-6 w-6" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{title}</h1>
          <p className="text-gray-500 font-medium">Last Updated: {lastUpdated}</p>
        </div>

        <div className="prose prose-gray max-w-none text-gray-600 space-y-6">
          {children}
        </div>

      </div>
    </div>
  );
}

