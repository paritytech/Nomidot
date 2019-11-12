import React from 'react';
interface Props {
    firstWord: string;
    secondWord: string;
    thirdWord: string;
    fourthWord: string;
    randomFourWords: Array<Array<string>>;
    handleSetFirstWord: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSetSecondWord: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSetThirdWord: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSetFourthWord: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export declare function MnemonicRewriteParts(props: Props): React.ReactElement;
export {};
