import next from "@next/eslint-plugin-next";
import js from "@eslint/js";

const eslintConfig = [
  js.configs.recommended,
  next.flatConfig.recommended,
  next.flatConfig.coreWebVitals,
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
