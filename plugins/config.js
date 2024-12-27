import { useRuntimeConfig } from "#app";

const loadConfig = () => {
  const $config = useRuntimeConfig().public; // Access public runtime config

  let customization = {};
  try {
    // Directly assign the object if it's already an object
    customization = typeof $config.appCustomization === "string"
      ? JSON.parse($config.appCustomization)
      : $config.appCustomization || {};
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to parse appCustomization:", error);
  }

  return {
    title: $config.appTitle,
    logoUrl: $config.appLogoUrl,
    theme: $config.appTheme,
    appName: $config.appName,
    customization: {
      brand: {
        name: customization.brand?.name || "Zeeve",
        theme: {
          primary: customization.brand?.theme?.primary || "#000",
          secondary: customization.brand?.theme?.secondary || "#fff",
        },
        favicon: customization.brand?.favicon || "https://f005.backblazeb2.com/file/tracehawk-prod/logo/Zeeve/Dark.png",
        logo: {
          light:
            customization.brand?.logo?.light || "https://f005.backblazeb2.com/file/tracehawk-prod/logo/Zeeve/Light.png",
          dark:
            customization.brand?.logo?.dark || "https://f005.backblazeb2.com/file/tracehawk-prod/logo/Zeeve/Dark.png",
        },
      },
    },
  };
};

export default loadConfig;
