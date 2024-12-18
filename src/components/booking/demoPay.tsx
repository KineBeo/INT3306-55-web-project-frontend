"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { FaCreditCard, FaPaypal } from "react-icons/fa";
import { Input } from "@nextui-org/react";

type ChildProps = object;

export type HandlePay = {
  validate: () => boolean;
};

const DemoPay = forwardRef<HandlePay, ChildProps>((props, ref) => {
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "paypal">("credit");
  const [errorsPayment, setErrorsPayment] = useState<{
    cardNumber: string | null;
    cardHolder: string | null;
    expiryDate: string | null;
    cvv: string | null;
  }>({
    cardNumber: null,
    cardHolder: null,
    expiryDate: null,
    cvv: null,
  });

   const handlePaymentMethodChange = (method: "credit" | "paypal") => {
    setPaymentMethod(method);
    if (method === "paypal") {
      // Clear all errors when switching to PayPal
      setErrorsPayment({
        cardNumber: null,
        cardHolder: null,
        expiryDate: null,
        cvv: null,
      });
    }
   };
  
  // Expose functions to parent using `useImperativeHandle`
  useImperativeHandle(ref, () => ({
    validate() {
      if (paymentMethod === "credit") {
        // if in errorsPayment have any null value, make it to "This field is required" then return false, else if all fields are "" or not null, return true
        let isValid = true;
        for (const key in errorsPayment) {
          if (errorsPayment[key as keyof typeof errorsPayment] === null) {
            setErrorsPayment((prev) => ({ ...prev, [key]: "This field is required" }));
            isValid = false;
          }
        }
        return isValid;
      } else {
        return true;
      }
    },
  }));

  return (
    <div className="w-full p-4 md:p-8 bg-white rounded-2xl shadow-lg">
      <h3 className="text-xl font-semibold mb-4 ">Payment Method</h3>
      <div className="space-y-4">
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => handlePaymentMethodChange("credit")}
            className={`flex-1 p-4 border rounded-xl flex items-center justify-center space-x-2 ${
              paymentMethod === "credit" ? "border-cyan-600 bg-cyan-50" : "border-gray-200"
            }`}>
            <FaCreditCard className="text-xl" />
            <span>Credit Card</span>
          </button>
          <button
            type="button"
            onClick={() => handlePaymentMethodChange("paypal")}
            className={`flex-1 p-4 border rounded-xl flex items-center justify-center space-x-2 ${
              paymentMethod === "paypal" ? "border-cyan-600 bg-cyan-50" : "border-gray-200"
            }`}>
            <FaPaypal className="text-xl" />
            <span>PayPal</span>
          </button>
        </div>
        {paymentMethod === "credit" && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Card Number</label>
              <Input
                type="text"
                variant="bordered"
                name="cardNumber"
                placeholder="xxxx - xxxx - xxxx - xxxx"
                errorMessage={errorsPayment.cardNumber}
                isInvalid={!!errorsPayment.cardNumber}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                  let value = e.target.value.replace(/[^\d]/g, "");
                  if (value.length > 16) value = value.slice(0, 16);
                  const formatted = value.match(/.{1,4}/g)?.join(" - ") || "";
                  e.target.value = formatted;
                  if (formatted.length === 0) {
                    setErrorsPayment((prev) => ({ ...prev, cardNumber: "This field is required" }));
                  } else if (!/^\d{4} - \d{4} - \d{4} - \d{4}$/.test(formatted)) {
                    setErrorsPayment((prev) => ({ ...prev, cardNumber: "Invalid card number" }));
                  } else {
                    setErrorsPayment((prev) => ({ ...prev, cardNumber: "" }));
                  }
                }}
                // isRequired
                classNames={{
                  input: "border-0 focus:ring-0 text-base",
                  label:
                    "group-data-[filled-within=true]:ml-3 group-data-[filled-within=true]:text-xs group-data-[filled-within=true]:text-neutral-500",
                }}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Card Holder Name</label>
              <Input
                type="text"
                variant="bordered"
                name="cardHolderName"
                placeholder="NGUYEN VAN A"
                errorMessage={errorsPayment.cardHolder}
                isInvalid={!!errorsPayment.cardHolder}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  const formatted = value.toUpperCase();
                  e.target.value = formatted;
                  if (formatted.length === 0) {
                    setErrorsPayment((prev) => ({ ...prev, cardHolder: "This field is required" }));
                  } else {
                    setErrorsPayment((prev) => ({ ...prev, cardHolder: "" }));
                  }
                }}
                // isRequired
                classNames={{
                  input: "border-0 focus:ring-0 text-base",
                  label:
                    " group-data-[filled-within=true]:ml-3 group-data-[filled-within=true]:text-xs group-data-[filled-within=true]:text-neutral-500",
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Expiry Date</label>
                <Input
                  type="text"
                  variant="bordered"
                  name="expiryDate"
                  placeholder="MM/YY"
                  // isRequired
                  errorMessage={errorsPayment.expiryDate}
                  isInvalid={!!errorsPayment.expiryDate}
                  classNames={{
                    input: "border-0 focus:ring-0",
                    label:
                      "group-data-[filled-within=true]:ml-3 group-data-[filled-within=true]:text-xs group-data-[filled-within=true]:text-neutral-500",
                  }}
                  pattern="(?:0[1-9]|1[0-2])\/\d{2}"
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value.replace(/[^\d]/g, "");
                    const formatted = value.length >= 3 ? `${value.slice(0, 2)}/${value.slice(2, 4)}` : value;
                    e.target.value = formatted;
                    if (formatted.length === 0) {
                      setErrorsPayment((prev) => ({ ...prev, expiryDate: "This field is required" }));
                    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formatted)) {
                      setErrorsPayment((prev) => ({ ...prev, expiryDate: "Invalid date format" }));
                    } else {
                      setErrorsPayment((prev) => ({ ...prev, expiryDate: "" }));
                    }
                  }}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">CVV</label>
                <Input
                  type="text"
                  variant="bordered"
                  name="cvv"
                  placeholder="123"
                  maxLength={3}
                  errorMessage={errorsPayment.cvv}
                  isInvalid={!!errorsPayment.cvv}
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value.replace(/[^\d]/g, "");
                    if (value.length === 0) {
                      setErrorsPayment((prev) => ({ ...prev, cvv: "This field is required" }));
                    } else if (value.length < 3) {
                      setErrorsPayment((prev) => ({ ...prev, cvv: "Invalid CVV" }));
                    } else {
                      setErrorsPayment((prev) => ({ ...prev, cvv: "" }));
                    }
                  }}
                  // isRequired
                  classNames={{
                    input: "border-0 focus:ring-0",
                    label:
                      " group-data-[filled-within=true]:ml-3 group-data-[filled-within=true]:text-xs group-data-[filled-within=true]:text-neutral-500",
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

DemoPay.displayName = "DemoPay";

export default DemoPay;
