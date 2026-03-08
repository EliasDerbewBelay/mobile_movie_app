import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="font-bold text-primary-400 text-5xl">Welcome!</Text>
      <Text className="font-bold text-accent-200">
        This is my first React Native app
      </Text>
      <Link href="/onboarding">onboarding</Link>
    </View>
  );
}
