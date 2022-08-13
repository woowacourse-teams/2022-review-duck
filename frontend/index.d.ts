declare module '*.scss';
declare module '*.css';

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

type numberString = `${number}` | number;
