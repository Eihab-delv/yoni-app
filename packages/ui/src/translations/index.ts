import enTranslation from "./en/translation.json";
import enClientPage from "./en/client-page.json";
import enFooter from "./en/footer.json";
import enSecondClientPage from "./en/second-client-page.json";
import enSecondPage from "./en/second-page.json";

import deTranslation from "./de/translation.json";
import deClientPage from "./de/client-page.json";
import deFooter from "./de/footer.json";
import deSecondClientPage from "./de/second-client-page.json";
import deSecondPage from "./de/second-page.json";

import itTranslation from "./it/translation.json";
import itClientPage from "./it/client-page.json";
import itFooter from "./it/footer.json";
import itSecondClientPage from "./it/second-client-page.json";
import itSecondPage from "./it/second-page.json";

export const translations = {
  en: {
    translation: enTranslation,
    "client-page": enClientPage,
    footer: enFooter,
    "second-client-page": enSecondClientPage,
    "second-page": enSecondPage,
  },
  de: {
    translation: deTranslation,
    "client-page": deClientPage,
    footer: deFooter,
    "second-client-page": deSecondClientPage,
    "second-page": deSecondPage,
  },
  it: {
    translation: itTranslation,
    "client-page": itClientPage,
    footer: itFooter,
    "second-client-page": itSecondClientPage,
    "second-page": itSecondPage,
  },
};

export const defaultNS = "translation";
export const getTranslation = async (language: string, namespace: string) => import(`./${language}/${namespace}.json`);

// Type for the resources structure
export type Resources = typeof translations

// Auto-derive namespace keys from the translations structure
export type NamespaceKeys = keyof Resources['en']

// Helper type to get nested keys from an object
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)]

// Auto-generate translation keys for all namespaces
export type AllTranslationKeys = {
  [K in NamespaceKeys]: NestedKeyOf<Resources['en'][K]>
}
