declare module 'event-stream';

export interface mergeConfig  {
    filename: string;
    filenameTwo: string;
    toMerge: string[];
}

export interface result {
    ok: boolean;
    message?: string;
    data?: object;
    err?: string;
}

export interface updateOptions {
    test: boolean;
    filename: string;
    newfilename?: string;
    delimiter?: string;
    type: string;
    options: options;
    path: string;
    excel?: boolean;
}

export interface options {
    columnA?: string;
    columnB?: string;
    columnC?: string;
    indexA?: number;
    indexB?: number;
    findValue?: void;
}

export interface optionsConstants {
    indexA?: number;
    indexB?: number;
    indexC?: number;
}