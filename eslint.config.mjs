import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextVitals,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      "reference/**",
      "reference-full/**"
    ],
    rules: {
      "@next/next/no-page-custom-font": "off",
    },
  },
];

export default config;
