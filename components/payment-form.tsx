'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/utils';

export type PaymentMethod = 'card' | 'upi' | 'cod';

interface PaymentFormProps {
  total: number;
  onSubmit: (method: PaymentMethod, details?: Record<string, string>) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function PaymentForm({ total, onSubmit, onBack, isLoading }: PaymentFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  const [upiId, setUpiId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateCardDetails = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Card Number (16 digits)
    const cardNumber = cardDetails.cardNumber.replace(/\s/g, '');
    if (!cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(cardNumber)) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }

    // Card Name
    if (!cardDetails.cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    }

    // Expiry Date (MM/YY)
    if (!cardDetails.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiryDate)) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    } else {
      // Check if card is expired
      const [month, year] = cardDetails.expiryDate.split('/');
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const now = new Date();
      if (expiry < now) {
        newErrors.expiryDate = 'Card has expired';
      }
    }

    // CVV (3-4 digits)
    if (!cardDetails.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
      newErrors.cvv = 'Please enter a valid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateUpi = (): boolean => {
    const newErrors: Record<string, string> = {};

    // UPI ID format: user@provider
    const upiRegex = /^[\w.-]+@[\w.-]+$/;
    if (!upiId.trim()) {
      newErrors.upiId = 'UPI ID is required';
    } else if (!upiRegex.test(upiId)) {
      newErrors.upiId = 'Please enter a valid UPI ID (e.g., user@paytm)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedMethod === 'card') {
      if (validateCardDetails()) {
        onSubmit('card', cardDetails);
      }
    } else if (selectedMethod === 'upi') {
      if (validateUpi()) {
        onSubmit('upi', { upiId });
      }
    } else if (selectedMethod === 'cod') {
      onSubmit('cod');
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ');
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card Payment */}
          <button
            type="button"
            onClick={() => setSelectedMethod('card')}
            className={`p-4 border-2 rounded-lg transition-all ${
              selectedMethod === 'card'
                ? 'border-primary-700 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 mb-2 text-primary-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path
                  fillRule="evenodd"
                  d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Credit/Debit Card</span>
              <span className="text-xs text-gray-500 mt-1">Visa, Mastercard, RuPay</span>
            </div>
          </button>

          {/* UPI Payment */}
          <button
            type="button"
            onClick={() => setSelectedMethod('upi')}
            className={`p-4 border-2 rounded-lg transition-all ${
              selectedMethod === 'upi'
                ? 'border-primary-700 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 mb-2 text-primary-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
              <span className="font-medium">UPI</span>
              <span className="text-xs text-gray-500 mt-1">PhonePe, GPay, Paytm</span>
            </div>
          </button>

          {/* Cash on Delivery */}
          <button
            type="button"
            onClick={() => setSelectedMethod('cod')}
            className={`p-4 border-2 rounded-lg transition-all ${
              selectedMethod === 'cod'
                ? 'border-primary-700 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 mb-2 text-primary-700" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Cash on Delivery</span>
              <span className="text-xs text-gray-500 mt-1">Pay when you receive</span>
            </div>
          </button>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-gray-50 p-6 rounded-lg">
        {selectedMethod === 'card' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 mb-4">Card Details</h4>
            
            {/* Test Card Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Test Mode:</strong> Use card number 4242 4242 4242 4242 with any future expiry and CVV
              </p>
            </div>

            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Card Number *
              </label>
              <Input
                id="cardNumber"
                type="text"
                value={cardDetails.cardNumber}
                onChange={(e) => {
                  const formatted = formatCardNumber(e.target.value.slice(0, 19));
                  setCardDetails({ ...cardDetails, cardNumber: formatted });
                  if (errors.cardNumber) setErrors({ ...errors, cardNumber: '' });
                }}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                error={errors.cardNumber}
                disabled={isLoading}
              />
              {errors.cardNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
              )}
            </div>

            <div>
              <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                Cardholder Name *
              </label>
              <Input
                id="cardName"
                type="text"
                value={cardDetails.cardName}
                onChange={(e) => {
                  setCardDetails({ ...cardDetails, cardName: e.target.value });
                  if (errors.cardName) setErrors({ ...errors, cardName: '' });
                }}
                placeholder="JOHN DOE"
                error={errors.cardName}
                disabled={isLoading}
              />
              {errors.cardName && (
                <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date *
                </label>
                <Input
                  id="expiryDate"
                  type="text"
                  value={cardDetails.expiryDate}
                  onChange={(e) => {
                    const formatted = formatExpiryDate(e.target.value);
                    setCardDetails({ ...cardDetails, expiryDate: formatted });
                    if (errors.expiryDate) setErrors({ ...errors, expiryDate: '' });
                  }}
                  placeholder="MM/YY"
                  maxLength={5}
                  error={errors.expiryDate}
                  disabled={isLoading}
                />
                {errors.expiryDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                )}
              </div>

              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                  CVV *
                </label>
                <Input
                  id="cvv"
                  type="text"
                  value={cardDetails.cvv}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setCardDetails({ ...cardDetails, cvv: value });
                    if (errors.cvv) setErrors({ ...errors, cvv: '' });
                  }}
                  placeholder="123"
                  maxLength={4}
                  error={errors.cvv}
                  disabled={isLoading}
                />
                {errors.cvv && (
                  <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedMethod === 'upi' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 mb-4">UPI Details</h4>
            
            {/* Test UPI Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Test Mode:</strong> Use any valid UPI ID format (e.g., test@paytm)
              </p>
            </div>

            <div>
              <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
                UPI ID *
              </label>
              <Input
                id="upiId"
                type="text"
                value={upiId}
                onChange={(e) => {
                  setUpiId(e.target.value);
                  if (errors.upiId) setErrors({ ...errors, upiId: '' });
                }}
                placeholder="yourname@paytm"
                error={errors.upiId}
                disabled={isLoading}
              />
              {errors.upiId && (
                <p className="mt-1 text-sm text-red-600">{errors.upiId}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Supported UPI apps: PhonePe, Google Pay, Paytm, BHIM
              </p>
            </div>
          </div>
        )}

        {selectedMethod === 'cod' && (
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Cash on Delivery</h4>
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1">
                  <h5 className="font-medium text-yellow-800 mb-1">Important Information</h5>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Please keep exact change of {formatPrice(total)} ready</li>
                    <li>• COD orders may take 1-2 days longer to process</li>
                    <li>• COD charge: ₹50 (included in total)</li>
                    <li>• Payment must be made to the delivery partner</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Total */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
        <div className="flex justify-between items-center text-lg font-bold text-primary-900">
          <span>Total Amount</span>
          <span className="text-2xl">{formatPrice(total)}</span>
        </div>
        {selectedMethod === 'cod' && (
          <p className="text-sm text-primary-700 mt-2">
            (Includes ₹50 COD handling charge)
          </p>
        )}
      </div>

      {/* Security Notice */}
      <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          />
        </svg>
        <span>Secure 256-bit SSL encrypted payment</span>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
          ← Back
        </Button>
        <Button type="submit" size="lg" isLoading={isLoading}>
          {selectedMethod === 'cod' ? 'Place Order' : 'Pay Now'} →
        </Button>
      </div>
    </form>
  );
}