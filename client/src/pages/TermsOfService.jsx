import React from 'react';
import { Helmet } from 'react-helmet-async';
import LegalDocument from '../components/LegalDocument';

export default function TermsOfService() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | EstateSocial</title>
        <meta name="description" content="Review EstateSocial's Terms of Service for users and agents." />
      </Helmet>
      <LegalDocument title="Terms of Service" lastUpdated="October 15, 2026">
      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
      <p>
        By accessing or using the EstateSocial platform, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the Service.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
      <p>
        EstateSocial provides an online real estate marketplace connecting buyers, renters, sellers, and agents in Pakistan. We do not own, sell, or rent any of the properties listed on the platform.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. User Obligations</h2>
      <p>
        You agree to use the Service only for lawful purposes. You must not:
      </p>
      <ul className="list-disc pl-6 space-y-2 mt-2">
        <li>Post false, inaccurate, or misleading information or property listings;</li>
        <li>Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity;</li>
        <li>Interfere with or disrupt the Service or servers or networks connected to the Service.</li>
      </ul>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Agent Accounts</h2>
      <p>
        Real estate agents must provide accurate licensing and agency information. EstateSocial reserves the right to suspend or terminate agent accounts that violate our community standards or engage in fraudulent activities.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Limitation of Liability</h2>
      <p>
        EstateSocial shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your access to or use of, or inability to access or use the Service.
      </p>
      </LegalDocument>
    </>
  );
}
