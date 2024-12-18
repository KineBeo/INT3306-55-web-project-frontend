"use client";

import { FormEvent, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@nextui-org/react";
import Image from "next/image";
import bg1 from "@/images/bg-1.png";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/solid";
import imgSignIn from "@/images/img-sign-in.png";
import { useOverlay } from "@/context/OverlayContext";
import { useNotification } from "@/context/NotificationContext";
import { login } from "@/redux/auth/thunks";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { GoEyeClosed, GoEye } from "react-icons/go";

const SignIn = () => {
  const router = useRouter();
  const { setLoading } = useOverlay();
  const { showNotification } = useNotification();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

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
        else if (!/^[0-9]+$/.test(value)) error = "Phone number must contain only numbers.";
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
  }, [errors, phone, password]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") setPhone(value);
    if (name === "password") setPassword(value);

    validateInput(name, value);
  };

  const [redirectPath, setRedirectPath] = useState("/");
  useEffect(() => {
    const originalPath = window.location.href;

    const redirectParamIndex = originalPath.indexOf("redirect=");
    let redirectUrl = "";

    if (redirectParamIndex !== -1) {
      redirectUrl = originalPath.slice(redirectParamIndex + 9);
      // console.log(redirectUrl);
      setRedirectPath(redirectUrl);
    }
  }, []);

  useEffect(() => {
    setLoading(loading);
  }, [loading, setLoading]);

  const onFinish = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isFormValid) {
      // Call login function from AuthContext
      try {
        await dispatch(
          login({
            phone_number: phone,
            password: password,
            onSuccess() {
              showNotification("Login successfully!");
              router.replace(redirectPath);
            },
          })
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/"); // Redirect đến Home nếu không thể back
    }
  };

  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const toggleVisibility = () => setIsVisiblePassword(!isVisiblePassword);

  return (
    <>
      <div className="relative flex flex-wrap md:min-h-screen items-center justify-center">
        <Image
          src={bg1}
          alt="Background"
          loading="lazy"
          className="hidden md:block absolute inset-0 z-0 object-cover opacity-40"
          fill
        />
        <div className="flex flex-col md:flex-row w-full max-w-5xl md:shadow-2xl md:rounded-3xl bg-white overflow-hidden z-10">
          {/* Left section */}
          <div className="flex flex-1 flex-col justify-center p-6 md:p-10 text-neutral-700">
            <ArrowLeftCircleIcon
              className="w-10 md:w-12 text-primary-500 hover:text-neutral-200 cursor-pointer mb-5"
              onClick={handleBack}
            />
            <h2 className="text-2xl md:text-4xl font-semibold mb-2 md:mb-4">Fly with us</h2>
            <p className="text-medium md:text-2xl opacity-80 font-light">
              Discover incredible journeys around the globe
            </p>
            <Image src={imgSignIn} alt="Sign up" loading="lazy" className="hidden md:block mt-12" />
          </div>

          {/* Right section */}
          <div className="flex flex-1 flex-col px-10 md:px-20 py-8 bg-primary-500 md:rounded-3xl justify-center items-center">
            <h2 className="text-xl md:text-2xl font-medium mb-2 text-white">Sign In</h2>
            <div className="bg-gray-100 h-1 mb-6 w-2/5"></div>

            {/* Form */}
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
                    "group-data-[filled-within=true]:text-neutral-200 group-data-[filled-within=true]:ml-3 group-data-[filled-within=true]:text-xs",
                }}
                maxLength={10}
              />

              <Input
                type={isVisiblePassword ? "text" : "password"}
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
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}>
                    {isVisiblePassword ? (
                      <GoEye className="text-xl text-neutral-400 pointer-events-none" />
                    ) : (
                      <GoEyeClosed className="text-xl text-neutral-400 pointer-events-none" />
                    )}
                  </button>
                }
                classNames={{
                  inputWrapper: "py-6 bg-gray-100 group-data-[focus=true]:border-primary-800",
                  input: "border-0 focus:ring-0",
                  label:
                    "group-data-[filled-within=true]:text-neutral-200 group-data-[filled-within=true]:ml-3 group-data-[filled-within=true]:text-xs",
                }}
              />
              <div className="flex justify-end">
                <Link href="#" className="text-neutral-100 text-xs italic underline">
                  Forget your password?
                </Link>
              </div>
              {error ? (
                Array.isArray(error) ? (
                  <div className="text-danger-500 text-sm mt-3 flex flex-col">
                    {error.map((err, index) => (
                      <span key={index}>{err.charAt(0).toUpperCase() + err.slice(1)}</span>
                    ))}
                  </div>
                ) : (
                  <div className="text-danger-500 text-sm mt-3 flex flex-col">
                    <span>{error.charAt(0).toUpperCase() + error.slice(1)}</span>
                  </div>
                )
              ) : (
                <></>
              )}
              <Button
                type="submit"
                className={`w-full mt-6 rounded-full ${
                  isFormValid ? "bg-primary-700 text-neutral-100" : "bg-gray-300"
                }`}>
                Sign In
              </Button>
            </form>
            <p className="text-neutral-200 mt-4 text-center">
              {/*navigate to sign up*/}
              Don&apos;t have an account?{" "}
              <Link onClick={() => setLoading(true)} href="/auth/signup" className="text-white font-medium underline">
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
