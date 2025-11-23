import 'intl-pluralrules';
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { translations, type NamespaceKeys } from "@repo/ui"; // Import the static translations and types

// Auto-derive namespace array from the translations structure
const namespaces = Object.keys(translations.en) as NamespaceKeys[]

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem("language");
  if (!savedLanguage) {
    savedLanguage = Localization.getLocales()[0].languageCode!;
  }
  i18n.use(initReactI18next).init({
    compatibilityJSON: "v4",
    lng: savedLanguage,
    fallbackLng: "en",
    resources: translations,
    ns: namespaces, // Auto-derived from translations structure
    defaultNS: "translation",
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;
