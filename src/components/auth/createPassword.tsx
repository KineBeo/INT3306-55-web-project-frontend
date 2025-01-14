"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import bg1 from "@/images/bg-1.png";
import imgSignUp from "@/images/img-sign-up.png";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { ArrowLeftCircleIcon } from "@heroicons/react/16/solid";
import { useOverlay } from "@/context/OverlayContext";
import { useNotification } from "@/context/NotificationContext";
import { components } from "@/types/api";
import api from "@/services/apiClient";
import { GoEyeClosed, GoEye } from "react-icons/go";

type CreateUserDto = components["schemas"]["CreateUserDto"];

const CreatePassword = () => {
  const router = useRouter();
  const { setLoading } = useOverlay();
  const { showNotification } = useNotification();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
  const [formData, setFormData] = useState<CreateUserDto>({
    fullname: "",
    email: "",
    phone_number: "",
    password_hash: "",
    role: "USER",
    birthday: "01/01/2000",
    gender: "MALE",
  });

  useEffect(() => {
    const storedData = localStorage.getItem("basicInfo");
    if (storedData) {
      const data = JSON.parse(storedData);
      setFormData({
        fullname: data.firstName + " " + data.lastName,
        email: data.email,
        phone_number: data.phone,
        password_hash: "",
        role: "USER",
        birthday: data.birthdate,
        gender: data.gender,
      });
    } else {
      router.push("/auth/signup");
    }
  }, [router]);

  const [requirements, setRequirements] = useState({
    length: false,
    number: false,
    lowercase: false,
    uppercase: false,
    specialChar: false,
  });

  // Update password and validate requirements
  const handlePasswordChange = (value: string) => {
    setPassword(value);
    validatePassword(value);
    validateConfirmPassword(value, confirmPassword);
  };

  // Update confirmPassword and validate match
  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    validateConfirmPassword(password, value);
  };

  // Validate password requirements
  const validatePassword = (value: string) => {
    const reqs = {
      length: value.length >= 8,
      number: /\d/.test(value),
      lowercase: /[a-z]/.test(value),
      uppercase: /[A-Z]/.test(value),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    };
    setRequirements(reqs);
  };

  // Validate confirmPassword matches password
  const validateConfirmPassword = (pass: string, confirm: string) => {
    if (confirm && pass !== confirm) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match." }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const isFormValid = () => {
    return Object.values(requirements).every((req) => req) && password === confirmPassword && password.length > 0;
  };

  const [registerError, setRegisterError] = useState<string | null>(null);

  const onFinish = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid()) return;
    // call api here
    try {
      setLoading(true);
      await api.post("/auth/register", { ...formData, password_hash: password });
      localStorage.removeItem("basicInfo");
      setLoading(false);
      showNotification("Account created successfully!");
      router.push("/auth/signin");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setRegisterError(error.response.data.message);
    } finally {
      setLoading(false);
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
  const [isVisibleConfirmPassword, setIsVisibleConfirmPassword] = useState(false);

  return (
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
          <p className="text-medium md:text-2xl opacity-80 font-light">Discover incredible journeys around the globe</p>

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
              <div className="w-5 h-5 flex items-center justify-center bg-primary-500 text-white rounded-full text-xs">
                2
              </div>
              <div className="text-primary-500 mt-2 text-xs">Create your password</div>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={onFinish} className="w-full">
            <div className="flex flex-col gap-4 mb-4">
              <Input
                type={isVisiblePassword ? "text" : "password"}
                label="Password"
                labelPlacement="outside"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                isInvalid={!!errors.password}
                errorMessage={errors.password}
                isRequired
                variant="bordered"
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    className="focus:outline-none"
                    type="button"
                    onClick={() => setIsVisiblePassword(!isVisiblePassword)}>
                    {isVisiblePassword ? (
                      <GoEye className="text-xl text-neutral-400 pointer-events-none" />
                    ) : (
                      <GoEyeClosed className="text-xl text-neutral-400 pointer-events-none" />
                    )}
                  </button>
                }
                classNames={{
                  input: "border-0 focus:ring-0",
                  label:
                    " group-data-[filled-within=true]:ml-3 group-data-[filled-within=true]:text-xs group-data-[filled-within=true]:text-neutral-500",
                }}
              />

              <Input
                type={isVisibleConfirmPassword ? "text" : "password"}
                label="Confirm password"
                labelPlacement="outside"
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                isInvalid={!!errors.confirmPassword}
                errorMessage={errors.confirmPassword}
                isRequired
                variant="bordered"
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    className="focus:outline-none"
                    type="button"
                    onClick={() => setIsVisibleConfirmPassword(!isVisibleConfirmPassword)}>
                    {isVisiblePassword ? (
                      <GoEye className="text-xl text-neutral-400 pointer-events-none" />
                    ) : (
                      <GoEyeClosed className="text-xl text-neutral-400 pointer-events-none" />
                    )}
                  </button>
                }
                classNames={{
                  input: "border-0 focus:ring-0",
                  label:
                    " group-data-[filled-within=true]:ml-3 group-data-[filled-within=true]:text-xs group-data-[filled-within=true]:text-neutral-500",
                }}
              />
            </div>

            <ul className="list-disc flex flex-col gap-4 ml-6">
              <li className={`text-xs ${requirements.length ? "text-primary-500" : "text-neutral-6000"}`}>
                At least 8 characters
              </li>
              <li className={`text-xs ${requirements.number ? "text-primary-500" : "text-neutral-6000"}`}>
                At least one number
              </li>
              <li className={`text-xs ${requirements.lowercase ? "text-primary-500" : "text-neutral-6000"}`}>
                Lowercase letter
              </li>
              <li className={`text-xs ${requirements.uppercase ? "text-primary-500" : "text-neutral-6000"}`}>
                Uppercase letter
              </li>
              <li className={`text-xs ${requirements.specialChar ? "text-primary-500" : "text-neutral-6000"}`}>
                Special character
              </li>
            </ul>
            {registerError ? (
              Array.isArray(registerError) ? (
                <div className="text-danger-500 text-sm mt-3 flex flex-col">
                  {registerError.map((err, index) => (
                    <span key={index}>{err.charAt(0).toUpperCase() + err.slice(1)}</span>
                  ))}
                </div>
              ) : (
                <div className="text-danger-500 text-sm mt-3 flex flex-col">
                  <span>{registerError.charAt(0).toUpperCase() + registerError.slice(1)}</span>
                </div>
              )
            ) : (
              <></>
            )}

            <Button
              type="submit"
              className={`w-full mt-6 rounded-full ${
                isFormValid() ? "bg-primary-500 text-white" : "bg-gray-300 text-neutral-500"
              }`}
              disabled={!isFormValid()}>
              Sign up
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
  );
};

export default CreatePassword;
