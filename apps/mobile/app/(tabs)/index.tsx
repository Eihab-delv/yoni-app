import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { useTranslation } from "@/hooks/useTranslation";
import { ThemedText } from "@/components/ThemedText";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { env } from "@/lib/env";

export default function HomeScreen() {
  const { t, i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  };
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: t("h1") });
  }, [navigation, t])

  return (
    <View style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <ThemedText>{t('h1')}</ThemedText>
      <Text>{env.EXPO_PUBLIC_API_BASE_URL}</Text>
      <Text>{env.EXPO_PUBLIC_SERVER_IDENTIFIER}</Text>
      <Text>{env.EXPO_PUBLIC_ENVIRONMENT}</Text>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 20,
        paddingTop: 100
      }}>
        <TouchableOpacity onPress={() => changeLanguage("de")}>
          <Text>
            Switch to German
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeLanguage("it")}>
          <Text>
            Switch to Italian
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeLanguage("en")}>
          <Text>
            Switch to English
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
