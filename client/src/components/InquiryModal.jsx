import { useState, useEffect, useRef } from 'react';
import { X, Send, Loader2, AlertCircle, CheckCircle, User, Phone, Mail } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { createInquiry } from '../redux/inquirySlice';
import Button from './ui/Button';
import Input from './ui/Input';

function InquiryModal({ isOpen, onClose, listing }) {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.inquiries);
  const firstInputRef = useRef(null);

  const [formData, setFormData] = useState({
    buyerName: '',
    buyerPhone: '',
    buyerEmail: '',
    message: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Focus management, scroll lock & escape listener
  useEffect(() => {
    if (!isOpen) return;

    // 1. Scroll Lock
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    // 2. Escape Key Listener
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // 3. Initial Focus
    const timer = setTimeout(() => {
      firstInputRef.current?.focus();
    }, 50);

    if (user) {
      setFormData({
        buyerName: user.name || '',
        buyerPhone: user.phone || '',
        buyerEmail: user.email || '',
        message: `Hi, I'm interested in "${listing?.title}". Please contact me with more details.`,
      });
    }
    setError('');
    setSuccess(false);

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, user, listing, onClose]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onClose();
      return;
    }
    setError('');

    if (!formData.buyerName || !formData.buyerPhone || !formData.message) {
      setError('Please fill in all required fields');
      return;
    }

    const result = await dispatch(createInquiry({
      listing: listing._id,
      message: formData.message,
      buyerName: formData.buyerName,
      buyerPhone: formData.buyerPhone,
      buyerEmail: formData.buyerEmail,
    }));

    if (createInquiry.fulfilled.match(result)) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } else {
      setError(result.payload || 'Failed to send inquiry');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        
        {/* Backdrop with blur & smooth transition */}
        <div
          className="fixed inset-0 bg-gray-950/40 backdrop-blur-sm transition-opacity animate-in fade-in-0 duration-150"
          onClick={onClose}
        />

        {/* Modal Panel */}
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="inquiry-modal-title"
          className="relative bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-lg max-w-md w-full overflow-hidden text-left animate-in zoom-in-95 fade-in-0 duration-200 ease-out z-10"
        >
          
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-zinc-800">
            <h2 id="inquiry-modal-title" className="text-base font-semibold text-gray-900 dark:text-zinc-50">Send Inquiry</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-zinc-100 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5">
            {success ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3 animate-in zoom-in-95 duration-200" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-50 mb-1">Inquiry Sent!</h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400">The agent will contact you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-xs font-medium">{error}</span>
                  </div>
                )}

                {/* Property Summary Box */}
                <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-3.5 border border-gray-100 dark:border-zinc-800">
                  <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100">{listing?.title}</p>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">{listing?.society}{listing?.phase && `, ${listing.phase}`}</p>
                </div>

                {/* Buyer Name */}
                <div>
                  <label htmlFor="buyerName" className="block text-[13px] font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400 dark:text-zinc-500 z-10" />
                    <Input
                      ref={firstInputRef}
                      id="buyerName"
                      name="buyerName"
                      type="text"
                      required
                      value={formData.buyerName}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Buyer Phone */}
                <div>
                  <label htmlFor="buyerPhone" className="block text-[13px] font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400 dark:text-zinc-500 z-10" />
                    <Input
                      id="buyerPhone"
                      name="buyerPhone"
                      type="tel"
                      required
                      value={formData.buyerPhone}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="+92 300 1234567"
                    />
                  </div>
                </div>

                {/* Buyer Email */}
                <div>
                  <label htmlFor="buyerEmail" className="block text-[13px] font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                    Email (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400 dark:text-zinc-500 z-10" />
                    <Input
                      id="buyerEmail"
                      name="buyerEmail"
                      type="email"
                      value={formData.buyerEmail}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-[13px] font-medium text-gray-700 dark:text-zinc-300 mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm text-gray-900 dark:text-zinc-50 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-zinc-100/10 focus:border-gray-900 dark:focus:border-zinc-100 transition-all duration-200 resize-none"
                    placeholder="Add any specific questions or requirements..."
                  />
                </div>

                {/* Footer Actions */}
                <div className="pt-3 flex space-x-3">
                  <Button
                    type="button"
                    onClick={onClose}
                    variant="secondary"
                    className="flex-1 h-10"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    variant="primary"
                    className="flex-1 h-10 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send Inquiry</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default InquiryModal;