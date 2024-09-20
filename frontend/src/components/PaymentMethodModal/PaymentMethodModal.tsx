import React from "react";
import { Button, Text } from "../../components";
import axios from "axios";

interface PaymentMethodModalProps {
  onClose: () => void;
  onPaymentMethodSelect: (method: string) => void;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  onClose,
  onPaymentMethodSelect,
}) => {
  const handleGcashPayment = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/create-gcash-payment/",
        {
          tenant_id: 1, // Example tenant ID
          amount: 1000, // Example amount
          email: "tenant@example.com",
        }
      );
      const gcashUrl = response.data.invoice_url; // Redirect URL for payment
      window.location.href = gcashUrl;
    } catch (error) {
      console.error("Failed to create GCash payment:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-5 rounded shadow-lg">
        <Text size="lg" as="p" className="font-open-sans mb-4">
          Select Payment Method
        </Text>
        <div className="flex justify-between">
          <Button onClick={handleGcashPayment} className="mr-2">
            GCash
          </Button>
          <Button
            onClick={() => onPaymentMethodSelect("CASH")}
            className="ml-2"
          >
            Cash
          </Button>
        </div>
        <Button onClick={onClose} className="mt-4">
          Close
        </Button>
      </div>
    </div>
  );
};

export default PaymentMethodModal;
