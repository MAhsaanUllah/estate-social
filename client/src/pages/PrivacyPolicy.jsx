import React from 'react';
import { Helmet } from 'react-helmet-async';
import LegalDocument from '../components/LegalDocument';

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | EstateSocial</title>
        <meta name="description" content="Read EstateSocial's Privacy Policy to understand how we handle your data." />
      </Helmet>
      <LegalDocument title="Privacy Policy" lastUpdated="October 15, 2026">
      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
      <p>
        At EstateSocial, we respect your personal data. This Privacy Policy explains how we collect, use, and share information about you when you use our website, mobile application, and related services (collectively, the "Services").
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>
      <p>
        We collect information you provide directly to us, such as when you create or modify your account, request services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, and other information you choose to provide.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. How We Use Information</h2>
      <p>
        We may use the information we collect from you to:
      </p>
      <ul className="list-disc pl-6 space-y-2 mt-2">
        <li>Provide, maintain, and improve our Services;</li>
        <li>Send you support and administrative messages;</li>
        <li>Connect you with real estate agents and sellers;</li>
        <li>Monitor and analyze trends, usage, and activities in connection with our Services.</li>
      </ul>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Sharing of Information</h2>
      <p>
        We may share your information with real estate agents if you explicitly request a viewing or valuation. We do not sell your personal data to third-party data brokers.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us at privacy@estatesocial.com.
      </p>
      </LegalDocument>
    </>
  );
}
