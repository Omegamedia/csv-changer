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
    quotes?: boolean;
    type: string;
    options: options;
    path: string;
    excel?: boolean;
    modify?: modify;
}

export interface modify {
    maxCharacters: number;
    maxForAll: boolean;
    maxFor?: maxFor[];
}

export interface maxFor {
    name: string;
    max: number;
    index?: number;
}

export interface options {
    columnA?: string;
    columnsA?: string[];
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
    multipleIndexes?: number[];
    maxCharacters?: optionsMaxCharacters;
}

export interface optionsMaxCharacters {
    maxFor: maxFor[];
    maxCharacters: number;
}
