"use strict";
// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var index_1 = require("./index");
function MnemonicRewriteParts(props) {
    var randomFourWords = props.randomFourWords, firstWord = props.firstWord, secondWord = props.secondWord, thirdWord = props.thirdWord, fourthWord = props.fourthWord, handleSetFirstWord = props.handleSetFirstWord, handleSetSecondWord = props.handleSetSecondWord, handleSetThirdWord = props.handleSetThirdWord, handleSetFourthWord = props.handleSetFourthWord;
    return (<index_1.WrapperDiv margin='0' padding='0'>
      <index_1.StackedHorizontal>
        <index_1.Stacked>
          <index_1.Labelled label={randomFourWords[0][0]} withLabel>
            <index_1.Input onChange={handleSetFirstWord} value={firstWord}/>
          </index_1.Labelled>
          <index_1.Margin top/>
          <index_1.Labelled label={randomFourWords[1][0]} withLabel>
            <index_1.Input onChange={handleSetSecondWord} value={secondWord}/>
          </index_1.Labelled>
        </index_1.Stacked>

        <index_1.Stacked>
          <index_1.Labelled label={randomFourWords[2][0]} withLabel>
            <index_1.Input onChange={handleSetThirdWord} value={thirdWord}/>
          </index_1.Labelled>
          <index_1.Margin top/>
          <index_1.Labelled label={randomFourWords[3][0]} withLabel>
            <index_1.Input onChange={handleSetFourthWord} value={fourthWord}/>
          </index_1.Labelled>
        </index_1.Stacked>
      </index_1.StackedHorizontal>
    </index_1.WrapperDiv>);
}
exports.MnemonicRewriteParts = MnemonicRewriteParts;
