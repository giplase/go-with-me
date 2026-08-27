import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import barrelBoundary from "eslint-plugin-barrel-boundary"
import boundaries from "eslint-plugin-boundaries"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  barrelBoundary.configs["flat/recommended"],
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      boundaries,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
      "boundaries/legacy-templates": false,
      "boundaries/elements": [
        {
          type: "shared-package",
          pattern: "src/shared/*",
          mode: "folder",
          partialMatch: false,
          capture: ["elementName"],
        },
        {
          type: "component-entry",
          pattern: "src/components/*.{ts,tsx}",
          mode: "full",
          partialMatch: false,
        },
        {
          type: "component-package",
          pattern: "src/components/*",
          mode: "folder",
          partialMatch: false,
          capture: ["elementName"],
        },
        {
          type: "modules",
          pattern: "src/modules/*",
          mode: "folder",
          partialMatch: false,
          capture: ["elementName"],
        },
        {
          type: "app",
          pattern: ["src/app/**/*.{ts,tsx}"],
          mode: "full",
          partialMatch: false,
        },
      ],
    },
    rules: {
      "no-console": "warn",
      "barrel-boundary/enforce-barrel-files": ["error", { detectAliases: true }],
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          message:
            "Layers boundaries violation: components -> only shared; modules -> components and shared (not other modules); app -> components/shared/modules(index).",
          rules: [
            {
              allow: {
                dependency: {
                  relationship: { to: "internal" },
                },
              },
            },
            {
              from: { type: "shared-package" },
              allow: {
                to: {
                  type: "shared-package",
                  captured: {
                    elementName: "{{ from.element.captured.elementName }}",
                  },
                },
              },
            },
            {
              from: {
                type: ["component-entry", "component-package"],
              },
              allow: { to: { type: "shared-package" } },
            },
            {
              from: { type: "modules" },
              allow: {
                to: {
                  type: ["component-entry", "component-package", "shared-package"],
                },
              },
            },
            {
              from: { type: "app" },
              allow: {
                to: {
                  type: ["app", "component-entry", "component-package", "shared-package"],
                },
              },
            },
            {
              from: { type: "app" },
              allow: {
                to: {
                  type: "modules",
                  internalPath: "index.{ts,tsx}",
                },
              },
            },
            {
              to: {
                type: "modules",
                internalPath: "!index.{ts,tsx}",
              },
              disallow: {
                dependency: {
                  relationship: { to: "!internal" },
                },
              },
              message:
                "Imports through public API only allowed: `…/modules/<Name>` (index.ts / index.tsx), without deep paths inside the module.",
            },
          ],
        },
      ],
    },
  },
])

export default eslintConfig
