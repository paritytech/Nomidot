export declare const GlobalStyle: import("styled-components").GlobalStyleComponent<{}, import("styled-components").DefaultTheme>;
export declare const substrateLightTheme: {
    black: string;
    grey: string;
    redOrange: string;
    coral: string;
    tangerine: string;
    orangeYellow: string;
    hotPink: string;
    electricPurple: string;
    purple: string;
    darkBlue: string;
    lightBlue2: string;
    lightBlue1: string;
    neonBlue: string;
    robinEggBlue: string;
    eggShell: string;
    white: string;
};
export declare type Color = keyof typeof substrateLightTheme;
export declare type StyledProps = {
    theme: typeof substrateLightTheme;
};
