import {nextui} from '@nextui-org/theme';
import { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";
import aspectRatio from "@tailwindcss/aspect-ratio";

function customColors(cssVar: string) {
  return ({ opacityVariable, opacityValue }: { opacityVariable?: string; opacityValue?: number }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${cssVar}), ${opacityValue})`;
    }
    if (opacityVariable !== undefined) {
      return `rgba(var(${cssVar}), var(${opacityVariable}, 1))`;
    }
    return `rgb(var(${cssVar}))`;
  };
}

const config: Config = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        "2xl": "128px",
      },
    },
    extend: {
      colors: {
        primary: {
          50: customColors("--c-primary-50")({}),
          100: customColors("--c-primary-100")({}),
          200: customColors("--c-primary-200")({}),
          300: customColors("--c-primary-300")({}),
          400: customColors("--c-primary-400")({}),
          500: customColors("--c-primary-500")({}),
          6000: customColors("--c-primary-600")({}),
          700: customColors("--c-primary-700")({}),
          800: customColors("--c-primary-800")({}),
          900: customColors("--c-primary-900")({}),
        },
        secondary: {
          50: customColors("--c-secondary-50")({}),
          100: customColors("--c-secondary-100")({}),
          200: customColors("--c-secondary-200")({}),
          300: customColors("--c-secondary-300")({}),
          400: customColors("--c-secondary-400")({}),
          500: customColors("--c-secondary-500")({}),
          6000: customColors("--c-secondary-600")({}),
          700: customColors("--c-secondary-700")({}),
          800: customColors("--c-secondary-800")({}),
          900: customColors("--c-secondary-900")({}),
        },
        neutral: {
          50: customColors("--c-neutral-50")({}),
          100: customColors("--c-neutral-100")({}),
          200: customColors("--c-neutral-200")({}),
          300: customColors("--c-neutral-300")({}),
          400: customColors("--c-neutral-400")({}),
          500: customColors("--c-neutral-500")({}),
          6000: customColors("--c-neutral-600")({}),
          700: customColors("--c-neutral-700")({}),
          800: customColors("--c-neutral-800")({}),
          900: customColors("--c-neutral-900")({}),
        },
      },
    },
  },
  plugins: [typography,forms,aspectRatio,nextui()],
};

export default config;
