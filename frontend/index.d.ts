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

type numberString = `${number}` | number;

type RequiredPartialType<Type, P extends keyof Type> = Type & {
  [key in P]-?: Type[key];
};

type PickParameterType<T extends (...rest: any[]) => any> = T extends (...rest: infer P) => any
  ? P
  : never;

type PickReturnType<T extends (...rest: any[]) => any> = T extends (...rest: any[]) => infer P
  ? P
  : never;
