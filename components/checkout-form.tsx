'use client';

import { useState } from 'react';
import { AddressForm, type AddressData } from '@/components/address-form';
import { PaymentForm, type PaymentMethod } from '@/components/payment-form';

type CheckoutStep = 'address' | 'payment' | 'review';

interface CheckoutFormProps {
  total: number;
  onComplete: (data: {
    address: AddressData;
    paymentMethod: PaymentMethod;
    paymentDetails?: Record<string, string>;
  }) => Promise<void>;
  onCancel: () => void;
}

export function CheckoutForm({ total, onComplete, onCancel }: CheckoutFormProps) {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');
  const [addressData, setAddressData] = useState<AddressData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddressSubmit = (data: AddressData) => {
    setAddressData(data);
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = async (
    method: PaymentMethod,
    details?: Record<string, string>
  ) => {
    if (!addressData) return;

    setIsProcessing(true);
    try {
      await onComplete({
        address: addressData,
        paymentMethod: method,
        paymentDetails: details,
      });
    } catch (error) {
      setIsProcessing(false);
      // Error is propagated to parent component for handling
    }
  };

  const handleBackToAddress = () => {
    setCurrentStep('address');
  };

  return (
    <div>
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {/* Step 1: Address */}
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep === 'address'
                  ? 'border-primary-700 bg-primary-700 text-white'
                  : addressData
                  ? 'border-green-600 bg-green-600 text-white'
                  : 'border-gray-300 bg-white text-gray-400'
              }`}
            >
              {addressData ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <span className="font-semibold">1</span>
              )}
            </div>
            <div className="ml-3 text-left">
              <p className="text-sm font-medium text-gray-900">Shipping</p>
              <p className="text-xs text-gray-500">Address details</p>
            </div>
          </div>

          {/* Connector Line */}
          <div
            className={`w-24 h-0.5 mx-4 ${
              addressData ? 'bg-green-600' : 'bg-gray-300'
            }`}
          />

          {/* Step 2: Payment */}
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep === 'payment'
                  ? 'border-primary-700 bg-primary-700 text-white'
                  : addressData
                  ? 'border-gray-300 bg-white text-gray-700'
                  : 'border-gray-300 bg-white text-gray-400'
              }`}
            >
              <span className="font-semibold">2</span>
            </div>
            <div className="ml-3 text-left">
              <p className="text-sm font-medium text-gray-900">Payment</p>
              <p className="text-xs text-gray-500">Choose method</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
        {currentStep === 'address' && (
          <AddressForm
            initialData={addressData || undefined}
            onSubmit={handleAddressSubmit}
            onBack={onCancel}
            isLoading={isProcessing}
          />
        )}

        {currentStep === 'payment' && (
          <PaymentForm
            total={total}
            onSubmit={handlePaymentSubmit}
            onBack={handleBackToAddress}
            isLoading={isProcessing}
          />
        )}
      </div>
    </div>
  );
}