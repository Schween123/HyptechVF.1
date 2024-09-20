import { Text, Input } from "./..";
import OnScreenKeyboard, {
  OnScreenKeyboardHandle,
} from "../../components/OnScreenKeyboard/OnScreenKeyboard";
import { useRef } from "react";

interface Props {
  index: number;
  description: string;
  amount: string; // Keep amount as string
  onDescriptionChange: (index: number, description: string) => void;
  onAmountChange: (index: number, amount: string) => void; // Use string type for amount
}

export default function AddOnBill({
  index,
  description,
  amount,
  onDescriptionChange,
  onAmountChange,
}: Props) {
  const keyboardRef = useRef<OnScreenKeyboardHandle>(null);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    if (keyboardRef.current) {
      keyboardRef.current.show(input);
    }
  };

  return (
    <>
      <div className="flex justify-between w-full mt-[-20px]">
        <input
          onFocus={handleFocus}
          name="MonthlyRent"
          placeholder="Description"
          value={description}
          onChange={(e) => onDescriptionChange(index, e.target.value)}
          className="relative w-[155px] ml-1 pb-[-30px] pt-[30px] !text-2xl"
        />
        <div className="mt-[-3px] flex items-center">
          <Text
            as="span"
            className="!font-opensans tracking-[3.00px] mb-[-35px]"
          >
            ₱
          </Text>
          <Input
            onFocus={handleFocus}
            shape="square"
            name="AddOn"
            placeholder="000.00"
            type="text" // Use text type for amount input
            value={amount}
            onChange={(e) => onAmountChange(index, e.target.value)}
            className="relative w-[110px] border-b-2 border-customColor1 ml-1 pb-[-30px] pt-[30px] !text-2xl"
          />
        </div>
      </div>
      <OnScreenKeyboard ref={keyboardRef} />
    </>
  );
}
