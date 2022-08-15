export const dummyTemplates = [
  {
    templateId: 0,
    templateTitle: '샬라샬라 템플릿',
    templateDescription: '이 템플릿을 이런저런이런저런 그런 템플릿입니다.',
    creator: {
      nickname: 'dommorello',
      profileUrl: 'https://avatars.githubusercontent.com/u/51396282?v=4',
    },
    updatedAt: 1660049730600,
    usedCount: 123,
  },
  {
    templateId: 1,
    templateTitle: '샬라샬라 템플릿',
    templateDescription: '이 템플릿을 이런저런이런저런 그런 템플릿입니다.',
    creator: {
      nickname: 'dommorello',
      profileUrl: 'https://avatars.githubusercontent.com/u/51396282?v=4',
    },
    updatedAt: 1660049730600,
    usedCount: 123,
  },
  {
    templateId: 2,
    templateTitle: '샬라샬라 템플릿',
    templateDescription: '이 템플릿을 이런저런이런저런 그런 템플릿입니다.',
    creator: {
      nickname: 'dommorello',
      profileUrl: 'https://avatars.githubusercontent.com/u/51396282?v=4',
    },
    updatedAt: 1660049730600,
    usedCount: 123,
  },
  {
    templateId: 3,
    templateTitle: '샬라샬라 템플릿',
    templateDescription: '이 템플릿을 이런저런이런저런 그런 템플릿입니다.',
    creator: {
      nickname: 'dommorello',
      profileUrl: 'https://avatars.githubusercontent.com/u/51396282?v=4',
    },
    updatedAt: 1660049730600,
    usedCount: 123,
  },
];

export const dummyTemplate = {
  templateId: 2,
  templateTitle: '팀 회고덕 스프린트 회고',
  templateDescription:
    '우아한테크코스 회고덕팀에서 매 스프린트 종료 후 진행하는 회고 템플릿입니다.',
  creator: {
    nickname: '돔하디',
    profileUrl: 'https://avatars.githubusercontent.com/u/51396282?v=4',
    socialId: 'DomMorello',
    bio: '세상에서 코딩이 젤 재미있어요.',
  },
  updatedAt: 1660049730600,
  usedCount: 123,
  questions: [
    {
      id: 1,
      value: '체크인 점수를 입력해 주세요.',
      description: '지금 기분은 어때요?',
    },
    {
      id: 2,
      value: '이번 스프린트에서 주요 목표는 무엇이었고 어떤 목표를 이뤘나요?',
      description: '개인의 목표와 팀의 목표를 각각 생각해보세요.',
    },
    {
      id: 3,
      value: '부족한 점은 무엇이고 어떻게하면 다음 스프린트에서 개선할 수 있을까요?',
      description: '구체적으로 어떻게 개선할지에 대한 ACTION을 도출해보세요.',
    },
  ],
};

export const dummyFormcode = '1324ABCD';

export const DUMMY_AUTH = {
  GET_ACCESS_TOKEN: { accessToken: 'dummyTokens' },
  GET_USER_PROFILE: {
    socialId: '94832610',
    socialNickname: 'compy-ryu',
    nickname: 'Ryu Hyun Seung',
    profileUrl: 'https://avatars.githubusercontent.com/u/94832610?v=4',
  },
};

export const DUMMY_REVIEW = {
  GET_FORM: {
    reviewFormTitle: '회고폼 제목',
    updatedAt: 160000,
    creator: {
      nickname: '크리에이터',
      profileUrl: 'https://avatars.githubusercontent.com/u/51396282?v=4',
    },
    isCreator: true,
    questions: [
      {
        id: 1,
        value: '질문 1',
      },
      {
        id: 2,
        value: '질문 2',
      },
    ],
  },

  GET_ANSWER: {
    contents: [
      {
        question: {
          id: 1,
          value: '질문 1',
        },
        answer: {
          id: 1,
          value: '답변 1',
        },
      },

      {
        question: {
          id: 2,
          value: '질문 1',
        },
        answer: {
          id: 2,
          value: '답변 2',
        },
      },
    ],
  },

  GET_FORM_ANSWER: [
    {
      id: 1,
      updatedAt: 100,
      isCreator: false,
      creator: {
        nickname: '유저1',
        profileUrl: 'https://avatars.githubusercontent.com/u/51396282?v=4',
      },
      contents: [
        {
          question: {
            id: 1,
            value: '질문 1',
          },
          answer: {
            id: 1,
            value: '답변 1',
          },
        },

        {
          question: {
            id: 2,
            value: '질문 1',
          },
          answer: {
            id: 2,
            value: '답변 2',
          },
        },
      ],
    },
    {
      id: 1,
      updatedAt: 100,
      isCreator: false,
      creator: {
        nickname: '유저1',
        profileUrl: 'https://avatars.githubusercontent.com/u/51396282?v=4',
      },
      contents: [
        {
          question: {
            id: 1,
            value: '질문 1',
          },
          answer: {
            id: 1,
            value: '답변 1',
          },
        },

        {
          question: {
            id: 2,
            value: '질문 1',
          },
          answer: {
            id: 2,
            value: '답변 2',
          },
        },
      ],
    },
  ],

  CREATE_FORM: {
    reviewFormCode: '123ABC',
  },

  CREATE_ANSWER: null,

  UPDATE_FORM: {
    reviewFormCode: '123ABC',
  },

  UPDATE_ANSWER: {
    contents: [
      {
        questionId: 1,
        answer: {
          id: 1,
          value: '답변 1',
        },
      },
      {
        questionId: 2,
        answer: {
          id: 2,
          value: '답변 2',
        },
      },
    ],
  },
};
