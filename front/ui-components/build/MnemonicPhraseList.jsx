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
var Shared_styles_1 = require("./Shared.styles");
function MnemonicPhraseList(props) {
    var phrase = props.phrase.split(' ');
    var firstHalf = phrase.slice(0, phrase.length / 2);
    var secondHalf = phrase.slice(phrase.length / 2, phrase.length);
    return (<Shared_styles_1.WrapperDiv margin='0' padding='0'>
      <index_1.StackedHorizontal margin='0' justifyContent='space-around'>
        <ol>
          {firstHalf.map(function (word) {
        return (<li key={word}>
                  <index_1.WithSpace>
                    <index_1.DynamicSizeText>
                      <index_1.FadedText>
                        {word}
                      </index_1.FadedText>
                    </index_1.DynamicSizeText>
                  </index_1.WithSpace>
                </li>);
    })}
        </ol>
        <ol start={phrase.length / 2 + 1}>
          {secondHalf.map(function (word) {
        return (<li key={word}>
                  <index_1.WithSpace>
                    <index_1.DynamicSizeText>
                      <index_1.FadedText>
                        {word}
                      </index_1.FadedText>
                    </index_1.DynamicSizeText>
                  </index_1.WithSpace>
                </li>);
    })}
        </ol>
      </index_1.StackedHorizontal>
    </Shared_styles_1.WrapperDiv>);
}
exports.MnemonicPhraseList = MnemonicPhraseList;
