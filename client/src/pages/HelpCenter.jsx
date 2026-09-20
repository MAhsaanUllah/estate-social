import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, ChevronDown, ChevronUp, LifeBuoy } from 'lucide-react';

const faqs = [
  {
    category: 'Buying',
    questions: [
      { q: 'How do I schedule a property viewing?', a: 'You can easily schedule a viewing by navigating to the property details page and clicking the "Contact Agent" button. You can call them directly or send a message.' },
      { q: 'Are the property prices negotiable?', a: 'Most prices listed are asking prices and are often negotiable. It is best to discuss your offer directly with the listing agent.' }
    ]
  },
  {
    category: 'Selling',
    questions: [
      { q: 'How do I list my property?', a: 'To list a property, you need to register as an Agent. Once approved, you can access your Dashboard and click "Add Property" to create your listing.' },
      { q: 'What makes a good property listing?', a: 'High-quality photos, an accurate description, and realistic pricing based on current market trends in your society.' }
    ]
  },
  {
    category: 'Account & Safety',
    questions: [
      { q: 'How does EstateSocial verify agents?', a: 'We require valid CNIC verification, agency registration details, and a manual review process before granting an Agent badge.' },
      { q: 'I forgot my password, what do I do?', a: 'Click the "Forgot Password" link on the login page and follow the instructions sent to your registered email address.' }
    ]
  }
];

function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-4 bg-white transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors focus:outline-none"
      >
        <span className="font-bold text-gray-900">{question}</span>
        {isOpen ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
      </button>
      {isOpen && (
        <div className="p-5 pt-0 text-gray-600 bg-white border-t border-gray-100">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function HelpCenter() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <Helmet>
        <title>Help Center | EstateSocial</title>
        <meta name="description" content="Find answers to common questions about buying, selling, and renting properties on EstateSocial." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <div className="bg-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-900">
            <LifeBuoy className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-6">How can we help you?</h1>
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search for answers..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 transition-all text-lg font-medium shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-12">
          {faqs.map((section, idx) => (
            <div key={idx}>
              <h2 className="text-2xl font-black text-gray-900 mb-6">{section.category}</h2>
              <div>
                {section.questions.map((faq, fidx) => (
                  <FaqItem key={fidx} question={faq.q} answer={faq.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gray-50 p-8 rounded-3xl text-center border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Still need help?</h2>
          <p className="text-gray-600 mb-6">Our support team is always ready to assist you.</p>
          <a href="/contact" className="inline-block px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors">
            Contact Support
          </a>
        </div>

      </div>
    </div>
  );
}

