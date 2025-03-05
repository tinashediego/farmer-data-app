import { Stack } from "expo-router";

const RootLayout=()=> {
  return <Stack
    screenOptions={{
      headerStyle: {
        backgroundColor: "#f4511e",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold",
      },
    }}
  >
    <Stack.Screen name="index" options={{title:"LoginScreen"}}  />
    
  </Stack>;
}
export default RootLayout;