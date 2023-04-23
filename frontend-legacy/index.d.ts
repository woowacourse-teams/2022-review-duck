declare module '*.scss';
declare module '*.css';

declare const __MSW_DIR__: string;

declare module '*.svg' {
  import React from 'react';
  const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

declare module '*.png' {
  const value: string;
  export = value;
}
declare module '*.jpg' {
  const value: string;
  export = value;
}
declare module '*.gif' {
  const value: string;
  export = value;
}

/*
  프로젝트 전반적으로 사용하는 범용 타입
*/

type URLString = `http${'s' | ''}://${string}`;

type ElapsedTime = `${number}${'초 전' | '분 전' | '시간 전' | '일 전'}`;

type numberString = `${number}` | number;

type RequiredPartialType<Type, P extends keyof Type> = Type & {
  [key in P]-?: Type[key];
};

type ValueOf<T extends Record<string, unknown>> = T[keyof T];

type Mutable<T> = { -readonly [P in keyof T]: T[P] };

type ArrayToUnion<T extends Array<unknown>> = T[number];
