import React from 'react';
export declare type AlertType = 'error' | 'info' | 'success' | 'warning';
export interface AlertWithoutId {
    content: React.ReactNode;
    type: AlertType;
}
export interface Alert extends AlertWithoutId {
    id: number;
    timerCb: number;
}
export declare const AlertsContext: React.Context<{
    enqueue: (newAlertWithoutId: AlertWithoutId) => void;
    remove: (Alertid: number) => void;
    alerts: Alert[];
}>;
interface Props {
    children: any;
}
export declare function AlertsContextProvider(props: Props): React.ReactElement;
export {};
