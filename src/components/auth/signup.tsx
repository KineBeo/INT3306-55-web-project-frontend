"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Checkbox, DateInput, Input } from "@nextui-org/react";
import { CalendarDate } from "@internationalized/date";
import Image from "next/image";
import imgSignUp from "@/images/img-sign-up.png";
import bg1 from "@/images/bg-1.png";
import { CalendarBoldIcon } from "@nextui-org/shared-icons";
import { ArrowLeftCircleIcon } from "@heroicons/react/16/solid";
import { useOverlay } from "@/context/OverlayContext";

const SignUp = () => {
  const router = useRouter();
  const { setLoading } = useOverlay();

  // State for form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [terms, setTerms] = useState(false);

  // State for error messages
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthdate: "",
    terms: "",
  });

  // State for form validity
  const [isFormValid, setIsFormValid] = useState(false);

  // Validate each input when it changes
  const validateInput = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "firstName":
      case "lastName":
        if (!value) error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
        break;
      case "email":
        if (!value) error = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Email is not valid.";
        break;
      case "phone":
        if (!value) error = "Phone number is required.";
        break;
      case "birthdate":
        if (!value) error = "Birthdate is required.";
        break;
      case "terms":
        if (terms) error = "You must agree to the terms and conditions.";
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  useEffect(() => {
    let isValid = Object.values(errors).every((error) => error === "");
    isValid = isValid && Object.values({ firstName, lastName, email, phone, birthdate, terms }).every((value) => value);
    setIsFormValid(isValid);
  }, [errors, firstName, lastName, email, phone, birthdate, terms]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "firstName") setFirstName(value);
    if (name === "lastName") setLastName(value);
    if (name === "email") setEmail(value);
    if (name === "phone") setPhone(value);
    if (name === "terms") setTerms(!terms);

    validateInput(name, value);
  };

  const [valueDate, setValueDate] = useState<CalendarDate | null>(null);
  const handleDateChange = (date: CalendarDate | null) => {
    setValueDate(date);
    let formattedDate = "";
    if (date) {
      const day = String(date?.day).padStart(2, "0");
      const month = String(date?.month).padStart(2, "0");
      const year = date?.year;
      formattedDate = `${day}-${month}-${year}`;
    }
    setBirthdate(formattedDate);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;
    if (
      (e.ctrlKey && key === "a") ||
      key === "Backspace" ||
      key === "Delete" ||
      key === "ArrowLeft" ||
      key === "ArrowRight" ||
      key === "ArrowUp" ||
      key === "ArrowDown" ||
      key === "Tab"
    ) {
      return;
    }
    if (!/[\d]/.test(key)) {
      e.preventDefault();
    }
  };

  const onFinish = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isFormValid) {
      setLoading(true);
      // Proceed with form submission, such as fetching API
      router.push("/auth/signup/create-password");
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/"); // Redirect đến Home nếu không thể back
    }
  };

  return (
    <>
      <div className="relative flex flex-wrap min-h-screen items-center justify-center">
        <Image
          src={bg1}
          alt="Background"
          loading="lazy"
          className="hidden md:block absolute inset-0 z-0 object-cover opacity-40"
          fill
        />
        <div className="flex flex-col md:flex-row w-full max-w-5xl md:shadow-2xl md:rounded-3xl bg-primary-500 overflow-hidden z-10">
          <div className="flex flex-1 flex-col justify-center p-6 md:p-10 text-white">
            <ArrowLeftCircleIcon
              className="w-10 md:w-12 hover:text-neutral-200 cursor-pointer mb-5"
              onClick={handleBack}
            />
            <h2 className="text-2xl md:text-4xl font-semibold mb-2 md:mb-4">Fly with us</h2>
            <p className="text-medium md:text-2xl opacity-80 font-light">
              Discover incredible journeys around the globe
            </p>

            <Image src={imgSignUp} alt="Sign up" loading="lazy" className="hidden md:block mt-8" />
          </div>

          <div className="flex flex-1 flex-col px-10 md:px-20 py-8 bg-white md:rounded-3xl justify-center items-center">
            <h2 className="text-xl md:text-2xl font-medium mb-6">Create an account</h2>

            <div className="flex items-center mb-6 relative w-full justify-between px-6">
              <div className="flex flex-col items-center z-10">
                <div className="w-5 h-5 flex items-center justify-center bg-primary-500 text-white rounded-full text-xs">
                  1
                </div>
                <div className="text-primary-500 mt-2 text-xs">Provide your basic info</div>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 top-3 w-[calc(50%-1.5rem)] h-0.5 bg-gray-400"></div>
              <div className="flex flex-col items-center z-10">
                <div className="w-5 h-5 flex items-center justify-center bg-gray-400 text-white rounded-full text-xs">
                  2
                </div>
                <div className="text-neutral-400 mt-2 text-xs">Create your password</div>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={onFinish}>
              <div className="flex gap-4 mb-10">
                <Input
                  label="First name"
                  labelPlacement="outside"
                  type="text"
                  variant="bordered"
                  name="firstName"
                  value={firstName}
                  onChange={handleInputChange}
                  isInvalid={errors.firstName ? true : false}
                  errorMessage={errors.firstName}
                  isRequired
                  classNames={{
                    input: "border-0 focus:ring-0",
                    label:
                      " group-data-[filled-within=true]:ml-3 group-data-[filled-within=true]:text-xs group-data-[filled-within=true]:text-neutral-500",
                  }}
                />
                <Input
                  label="Last name"
                  labelPlacement="outside"
                  type="text"
                  variant="bordered"
                  name="lastName"
                  value={lastName}
                  onChange={handleInputChange}
                  isInvalid={errors.lastName ? true : false}
                  errorMessage={errors.lastName}
                  isRequired
                  classNames={{
                    input: "border-0 focus:ring-0",
                    label:
                      " group-data-[filled-within=true]:ml-3 group-data-[filled-within=true]:text-xs group-data-[filled-within=true]:text-neutral-500",
                  }}
                />
              </div>

              <Input
                type="email"
                labelPlacement="outside"
                label="Email"
                variant="bordered"
                name="email"
                value={email}
                onChange={handleInputChange}
                isInvalid={errors.email ? true : false}
                errorMessage={errors.email}
                isRequired
                className="mb-10"
                classNames={{
                  input: "border-0 focus:ring-0",
                  label:
                    " group-data-[filled-within=true]:ml-3 group-data-[filled-within=true]:text-xs group-data-[filled-within=true]:text-neutral-500",
                }}
              />

              <Input
                label="Phone number"
                labelPlacement="outside"
                type="tel"
                variant="bordered"
                name="phone"
                value={phone}
                onChange={handleInputChange}
                isInvalid={errors.phone ? true : false}
                errorMessage={errors.phone}
                isRequired
                className="mb-4 no-focus"
                classNames={{
                  input: "border-0 focus:ring-0",
                  label:
                    " group-data-[filled-within=true]:ml-3 group-data-[filled-within=true]:text-xs group-data-[filled-within=true]:text-neutral-500",
                }}
                maxLength={10}
                onKeyDown={handleKeyDown}
              />

              <DateInput
                label="Birthdate"
                labelPlacement="outside"
                variant="bordered"
                name="birthdate"
                value={valueDate}
                onChange={handleDateChange}
                onKeyUp={() => validateInput("birthdate", birthdate)}
                isInvalid={errors.birthdate ? true : false}
                errorMessage={errors.birthdate}
                isRequired
                className="mb-8"
                endContent={
                  <CalendarBoldIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                classNames={{ label: "ml-3 text-xs text-neutral-500" }}
              />

              <Checkbox
                isSelected={terms}
                onChange={handleInputChange}
                name="terms"
                classNames={{ icon: "text-primary-6000" }}>
                <div className="text-xs">
                  By creating an account, I agree to the{" "}
                  <a href="#" className="text-primary-6000 font-medium">
                    Terms of use
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary-6000 font-medium">
                    Privacy Policy
                  </a>
                  .
                </div>
              </Checkbox>
              {errors.terms && <div className="text-red-500 text-xs">{errors.terms}</div>}

              <Button
                type="submit"
                className={`w-full mt-6 rounded-full ${isFormValid ? "bg-primary-500" : "bg-gray-400"}`}>
                Next
              </Button>
            </form>

            <p className="text-neutral-500 mt-4 text-center">
              Already have an account?{" "}
              <Link onClick={() => setLoading(true)} href="/auth/signin" className="text-primary-6000 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
