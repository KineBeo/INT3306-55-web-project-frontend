"use client";

import { FormEvent, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@nextui-org/react";
import Image from "next/image";
import bg1 from "@/images/bg-1.png";
import { ArrowLeftCircleIcon } from "@heroicons/react/16/solid";
import imgSignIn from "@/images/img-sign-in.png";
import Logo from "@/shared/Logo";

const SignIn = () => {
  const router = useRouter();

  // State for form fields
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // State for form validity
  const [isFormValid, setIsFormValid] = useState(false);

  const [errors, setErrors] = useState({
    phone: "",
    password: "",
  });

  // Validate each input when it changes
  const validateInput = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "phone":
        if (!value) error = "Phone number is required.";
        break;
      case "password":
        if (!value) error = "Password is required.";
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  useEffect(() => {
    let isValid = Object.values(errors).every((error) => error === "");
    isValid = isValid && Object.values({ phone, password }).every((value) => value);
    setIsFormValid(isValid);
  }, [errors]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") setPhone(value);
    if (name === "password") setPassword(value);

    validateInput(name, value);
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
      // Proceed with form submission, such as fetching API
      router.push("/");
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
      <div className="flex min-h-screen items-center justify-center">
        <Image src={bg1} loading="lazy" className="absolute inset-0 z-0 object-cover" fill alt="Background" />
        <Logo className="absolute bottom-0 right-0 m-6 w-16 text-primary-6000" />
        <div className="flex w-full max-w-5xl shadow-2xl shadow-neutral-400 rounded-3xl bg-white overflow-hidden z-10">
          <div className="flex flex-1 flex-col items-center justify-center p-8">
            <div className="flex flex-1 flex-col justify-center text-gray-600">
              <ArrowLeftCircleIcon
                className="w-12 text-primary-500 hover:text-gray-200 cursor-pointer mb-5"
                onClick={handleBack}
              />
              <h2 className="text-4xl font-semibold mb-5">Fly with us</h2>
              <p className="text-2xl opacity-80 font-light">Discover incredible journeys around the globe</p>
            </div>
            <Image src={imgSignIn} alt="Sign up" loading="lazy" className="mt-16" />
          </div>

          <div className="flex flex-1 flex-col px-20 pb-8 bg-primary-500 rounded-3xl justify-center items-center">
            <h2 className="text-2xl font-medium mb-2 text-white">Sign In</h2>
            <div className="bg-gray-100 h-1 mb-6 w-2/5"></div>
            {/* Form Fields */}
            <form onSubmit={onFinish} className="w-full">
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
                className="mb-10 no-focus"
                classNames={{
                  inputWrapper: "py-6 bg-gray-100 group-data-[focus=true]:border-primary-800",
                  input: "border-0 focus:ring-0",
                  label:
                    "group-data-[filled-within=true]:text-gray-200 group-data-[filled-within=true]:ml-3 group-data-[filled-within=true]:text-xs",
                }}
                maxLength={10}
                onKeyDown={handleKeyDown}
              />

              <Input
                type="password"
                label="Password"
                labelPlacement="outside"
                value={password}
                onChange={handleInputChange}
                isInvalid={!!errors.password}
                errorMessage={errors.password}
                isRequired
                variant="bordered"
                className="mb-4 no-focus"
                name="password"
                classNames={{
                  inputWrapper: "py-6 bg-gray-100 group-data-[focus=true]:border-primary-800",
                  input: "border-0 focus:ring-0",
                  label:
                    "group-data-[filled-within=true]:text-gray-200 group-data-[filled-within=true]:ml-3 group-data-[filled-within=true]:text-xs",
                }}
              />
              <div className="flex justify-end">
                <Link href="/auth/forgot-password" className="text-gray-100 text-xs italic underline">
                  Forget your password?
                </Link>
              </div>
              <Button
                type="submit"
                className={`w-full mt-6 rounded-full ${isFormValid ? "bg-primary-700 text-gray-100" : "bg-gray-300"}`}>
                Sign In
              </Button>
            </form>

            <p className="text-gray-200 mt-4 text-center">
              {/*navigate to sign up*/}
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-white font-medium underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
