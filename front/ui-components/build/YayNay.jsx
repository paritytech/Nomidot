"use strict";
// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var recharts_1 = require("recharts");
exports.YayNay = function (props) {
    var yay = props.yay, nay = props.nay, height = props.height, width = props.width;
    var data = [
        {
            name: 'yay',
            yay: yay
        },
        {
            name: 'nay',
            nay: nay
        }
    ];
    return (<recharts_1.ResponsiveContainer height={height || 100} width={width || '100%'}>
      <recharts_1.BarChart data={data} margin={{ top: 0, right: 40, left: 40, bottom: 20 }} layout='vertical' barCategoryGap='0' barGap={1} maxBarSize={25}>
        <recharts_1.CartesianGrid horizontal={false} stroke='#a0a0a0' strokeWidth={0.5}/>
        <recharts_1.Tooltip />
        <recharts_1.XAxis type='number' axisLine={false} stroke='#a0a0a0'/>
        <recharts_1.YAxis type='category' dataKey={'name'} width={40}/>
        <recharts_1.Bar animationDuration={1000} barSize={25} dataKey='yay' fill='#5c53fc' label={{ position: 'right' }}/>
        <recharts_1.Bar animationDuration={1000} barSize={25} dataKey='nay' fill='#ff5d3e' label={{ position: 'right' }}/>
      </recharts_1.BarChart>
    </recharts_1.ResponsiveContainer>);
};
