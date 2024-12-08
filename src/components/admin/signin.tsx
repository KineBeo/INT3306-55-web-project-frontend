"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@nextui-org/react";
import { useOverlay } from "@/context/OverlayContext";
import { useNotification } from "@/context/NotificationContext";
import { login } from "@/redux/auth/thunks";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const SignIn = () => {
  const router = useRouter();
  const { setLoading } = useOverlay();
  const { showNotification } = useNotification();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.persistedReducer.auth);

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
  }, [errors, phone, password]);

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

  const [redirectPath, setRedirectPath] = useState("/");
  useEffect(() => {
    const path = new URLSearchParams(window.location.search).get("redirect") || "/";
    setRedirectPath(path);
  }, []);

  useEffect(() => {
    setLoading(loading);
  }, [loading, setLoading]);

  const onFinish = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isFormValid) {
      // Call login function from AuthContext
      try {
        await dispatch(login({ phone_number: phone, password: password }));
        if (!error) {
          showNotification("Login successfully!");
          router.push(redirectPath);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
      <div className="flex justify-center h-[60%] mt-16">
          <div className="flex flex-col px-10 md:px-20 py-8 bg-primary-500 md:rounded-3xl justify-center items-center">
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
              "group-data-[filled-within=true]:text-neutral-200 group-data-[filled-within=true]:ml-3 group-data-[filled-within=true]:text-xs",
          }}
        />
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
          className={`w-full mt-6 rounded-full ${isFormValid ? "bg-primary-700 text-neutral-100" : "bg-gray-300"}`}>
          Sign In
        </Button>
      </form>
    </div>
    </div>
  );
};

export default SignIn;
