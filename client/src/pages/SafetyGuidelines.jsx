import React from 'react';
import { Helmet } from 'react-helmet-async';
import LegalDocument from '../components/LegalDocument';

export default function SafetyGuidelines() {
  return (
    <>
      <Helmet>
        <title>Safety Guidelines | EstateSocial</title>
        <meta name="description" content="Read EstateSocial's safety guidelines to protect yourself against real estate scams." />
      </Helmet>
      <LegalDocument title="Safety Guidelines" lastUpdated="October 15, 2026">
      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Protecting Our Community</h2>
      <p>
        At EstateSocial, the safety and security of our community is our top priority. Whether you are buying, selling, or renting, please follow these guidelines to ensure a safe transaction.
      </p>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">For Buyers and Renters</h2>
      <ul className="list-disc pl-6 space-y-2 mt-2">
        <li><strong>Never wire funds in advance:</strong> Do not transfer money to anyone before verifying their identity and physically inspecting the property.</li>
        <li><strong>Meet in person:</strong> Always schedule a physical visit to the property. Do not rely solely on photos or virtual tours before making financial commitments.</li>
        <li><strong>Verify documents:</strong> Request to see the original title deed, NOCs, and owner's CNIC before signing any agreements.</li>
        <li><strong>Beware of unrealistic prices:</strong> If a deal seems too good to be true, it probably is. Compare prices with similar properties in the same society.</li>
      </ul>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">For Sellers and Agents</h2>
      <ul className="list-disc pl-6 space-y-2 mt-2">
        <li><strong>Verify the buyer's identity:</strong> Ensure the person you are dealing with is who they claim to be. Request a copy of their CNIC.</li>
        <li><strong>Use secure payment methods:</strong> Prefer bank drafts or pay orders over large cash transactions.</li>
        <li><strong>Protect your personal info:</strong> Do not share sensitive financial information or OTPs with potential buyers.</li>
      </ul>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Reporting Suspicious Activity</h2>
      <p>
        If you encounter a fraudulent listing, a scammer, or any suspicious activity, please click the "Report" button on the listing page or contact our trust and safety team immediately at safety@estatesocial.com.
      </p>
      </LegalDocument>
    </>
  );
}
