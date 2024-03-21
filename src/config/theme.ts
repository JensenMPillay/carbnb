import tailwindConfig from "@/tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";

import type { Theme } from "@supabase/auth-ui-shared";
import type { Config } from "tailwindcss";
import type { DefaultColors } from "tailwindcss/types/generated/colors";

/**
 * Object containing color definitions from the Tailwind CSS configuration.
 */
export const { colors } =
  // Reset colors theme type with extended colors
  resolveConfig(tailwindConfig).theme as unknown as Config["theme"] & {
    colors: DefaultColors & typeof tailwindConfig.theme.extend.colors;
  };

/**
 * Custom Theme for Supabase Auth-UI.
 */
export const authUITheme: Theme = {
  default: {
    colors: {
      brand: colors.primary.DEFAULT,
      brandAccent: colors.ring,
      brandButtonText: colors.primary.foreground,
      defaultButtonBackground: colors.primary.DEFAULT,
      defaultButtonBackgroundHover: colors.ring,
      defaultButtonBorder: colors.border,
      defaultButtonText: colors.primary.foreground,
      dividerBackground: colors.muted.DEFAULT,
      inputBackground: "",
      inputBorder: colors.border,
      inputBorderHover: colors.ring,
      inputBorderFocus: colors.ring,
      inputText: colors.foreground,
      inputLabelText: colors.foreground,
      inputPlaceholder: colors.muted.foreground,
      messageText: "#2b805a",
      messageBackground: "#e7fcf1",
      messageBorder: "#d0f3e1",
      messageTextDanger: "#ff6369",
      messageBackgroundDanger: "#fff8f8",
      messageBorderDanger: "#822025",
      anchorTextColor: colors.foreground,
      anchorTextHoverColor: colors.primary.DEFAULT,
    },
    space: {
      spaceSmall: "4px",
      spaceMedium: "8px",
      spaceLarge: "16px",
      labelBottomMargin: "8px",
      anchorBottomMargin: "4px",
      emailInputSpacing: "4px",
      socialAuthSpacing: "4px",
      buttonPadding: "10px 15px",
      inputPadding: "10px 15px",
    },
    fontSizes: {
      baseBodySize: "13px",
      baseInputSize: "14px",
      baseLabelSize: "14px",
      baseButtonSize: "14px",
    },
    // fonts: {
    //   bodyFontFamily: `ui-sans-serif, sans-serif`,
    //   buttonFontFamily: `ui-sans-serif, sans-serif`,
    //   inputFontFamily: `ui-sans-serif, sans-serif`,
    //   labelFontFamily: `ui-sans-serif, sans-serif`,
    // },
    // fontWeights: {},
    // lineHeights: {},
    // letterSpacings: {},
    // sizes: {},
    borderWidths: {
      buttonBorderWidth: "1px",
      inputBorderWidth: "1px",
    },
    // borderStyles: {},
    radii: {
      borderRadiusButton: "8px",
      buttonBorderRadius: "8px",
      inputBorderRadius: "8px",
    },
    // shadows: {},
    // zIndices: {},
    // transitions: {},
  },
  dark: {
    colors: {
      messageText: "#85e0b7",
      messageBackground: "#072719",
      messageBorder: "#2b805a",
      messageBackgroundDanger: "#1f1315",
    },
  },
};
