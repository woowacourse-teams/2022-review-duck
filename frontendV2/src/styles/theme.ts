// 💡 추후 다크 모드 도입 시 CSS Variable 활용

const theme = {
  color: {
    white: {
      '20': 'rgba(255,255,255,0.02)',
      '50': 'rgba(255,255,255,0.05)',
      '100': 'rgba(255,255,255,0.1)',
      '200': 'rgba(255,255,255,0.2)',
      '300': 'rgba(255,255,255,0.3)',
      '400': 'rgba(255,255,255,0.4)',
      '500': 'rgba(255,255,255,.5)',
      '600': 'rgba(255,255,255,0.6)',
      '800': 'rgba(255,255,255,0.8)',
      '900': '#fff',
    },
    black: {
      '20': 'rgba(0,0,0,0.02)',
      '50': 'rgba(0,0,0,0.05)',
      '100': 'rgba(0,0,0,0.1)',
      '200': 'rgba(0,0,0,0.2)',
      '300': 'rgba(0,0,0,.3)',
      '400': 'rgba(0,0,0,0.4)',
      '500': 'rgba(0,0,0,.5)',
      '600': 'rgba(0,0,0,0.6)',
      '700': 'rgba(0,0,0,0.7)',
      '800': 'rgba(0,0,0,0.8)',
      '900': '#000',
    },
    gray: {
      '100': '#151515',
      '150': '#222',
      '300': '#555',
      '500': '#777',
      '600': '#a1a7ad',
      '700': '#aaa',
      '800': '#ccc',
      '850': '#ddd',
      '870': '#f0f1f3',
      '900': '#f3f3f3',
      '950': '#f5f5f5',
      '970': '#fbfbfb',
    },
    deepGreen: {
      '25': '#F4F6F7',
      '50': '#E9EEEF',
      '100': '#D5DEDF',
      '200': '#ACBDBF',
      '300': '#849EA0',
      '400': '#617F82',
      '500': '#317172',
      '600': '#344E50',
      '700': '#273A3C',
      '800': '#1C2729',
      '900': '#111617',
    },
    blue: {
      '100': '#D0DAF7',
      '200': '#A2B6F0',
      '300': '#7894EA',
      '400': '#5372E4',
      '500': '#3752DE',
      '600': '#2B41AC',
      '700': '#21317D',
      '800': '#172150',
      '900': '#0E1328',
    },
    orange: {
      '100': '#F8E7C7',
      '200': '#F2D193',
      '300': '#ECBA64',
      '400': '#E8A43D',
      '500': '#ff9000',
      '600': '#B0701D',
      '800': '#52360E',
      '900': '#291C08',
    },
    red: {
      '100': '#F2CECC',
      '200': '#E8A29D',
      '300': '#E07970',
      '400': '#DC5648',
      '500': '#D83E27',
      '600': '#A73120',
      '700': '#792419',
      '800': '#4E1912',
      '900': '#270E0B',
    },
  },
};

export default theme;
