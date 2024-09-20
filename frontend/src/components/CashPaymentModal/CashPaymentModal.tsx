import React from 'react';
import axios from 'axios';  // Import axios for making HTTP requests
import { Button, Text } from '../../components';  // Import your UI components

interface CashPaymentModalProps {
  tenantId: string; // Add this prop type
  amountPayable: number;
  selectedMonths: { month: string; year: string }[];
  onClose: () => void;
  onPaymentSuccess: (paidMonthKeys: number[]) => void;
}

const CashPaymentModal: React.FC<CashPaymentModalProps> = ({
  tenantId,
  amountPayable,
  selectedMonths,
  onClose,
  onPaymentSuccess
}) => {
  const handleConfirmPayment = async () => {
    try {
      // Get current date and time
      const transactionDate = new Date().toLocaleDateString('en-GB'); // Format as dd/mm/yyyy
      const transactionTime = new Date().toLocaleTimeString('en-GB'); // Format as HH:MM:SS

      // Create transactions for each selected month
      await Promise.all(selectedMonths.map(async (monthInfo) => {
        const transactionData = {
          tenant: tenantId,
          transaction_date: transactionDate,
          transaction_time: transactionTime,
          amount_paid: amountPayable / selectedMonths.length, // Distribute amount payable equally across months
          payment_method: 'Cash',
          month_paid_for: monthNamesToNumbers[monthInfo.month], // Convert month name to number (1-12)
          year_paid_for: monthInfo.year, // Year of the payment
          // Omit reference_number since it's generated by the backend
        };

        // POST request to save the transaction
        await axios.post('http://localhost:8000/api/transactions/', transactionData);
        console.log('Data saved:', transactionData);
      }));

      // Notify parent component about success
      onPaymentSuccess(selectedMonths.map(monthInfo => monthNamesToNumbers[monthInfo.month]));
      onClose();
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  // Function to map month names to numbers
  const monthNamesToNumbers: { [key: string]: number } = {
    "January": 1,
    "February": 2,
    "March": 3,
    "April": 4,
    "May": 5,
    "June": 6,
    "July": 7,
    "August": 8,
    "September": 9,
    "October": 10,
    "November": 11,
    "December": 12
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-5 rounded shadow-lg">
        <Text size="lg" as="p" className="font-open-sans mb-4">
          Confirm Payment
        </Text>
        <Text size="md" as="p" className="mb-4">
          Amount Payable: ₱ {amountPayable.toFixed(2)}
        </Text>
        <div>
          <Text size="md" as="p" className="mb-2">
            Selected Months:
          </Text>
          {selectedMonths.map((monthInfo, index) => (
            <Text key={index} size="xs" as="p">
              {monthInfo.month} {monthInfo.year}
            </Text>
          ))}
        </div>
        <Button onClick={handleConfirmPayment} className="mt-4">
          Confirm Payment
        </Button>
        <Button onClick={onClose} className="mt-2">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default CashPaymentModal;
