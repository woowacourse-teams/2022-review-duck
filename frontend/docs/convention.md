# Front-End 코딩 컨벤션

작업 중 고려되어야 하는 컨벤션을 주기적으로 추가하며
신규 제안 시 체크박스를 해제한 상태로 추가하되, PR 제출을 통해 협의 후 확정이 된다 요소들을 체크 후 Merge를 진행합니다.



## 컨벤션 제안 관련

* 서로 협의되지 않은 사항이라면, 하단에 해당 컨벤션이 추가되어야 하는 이유에 대해 간단히 설명하는 것을 권장합니다.
* 비슷하거나 관련이 있는 컨벤션끼리 위치하도록 정리하여주세요.



## 디렉토리 구조 관련

* [x] 디렉토리는 `common`, `service`로 크게 나뉘어진다.
* [x] `common` 디렉토리는 현재 서비스가 아니더라도 사용할 수 있는 수준의 요소가 위치한다.
  * [x] 현재 서비스와 전혀 연관이 없는 서비스에도 npm으로 배포하여, 바로 투입하여 적용할 수 있는 요소여야 한다.
* [x] `service` 디렉토리는 현재 서비스와 관련이 있는 요소들이 위치한다.
  * [x] `service/@shared` 디렉토리는 현재 개발 중인 서비스와 연관이 있고, 여러 서비스에서 사용될 수 있는 요소가 위치한다.
  * [x] 이외 디렉토리는 큰 범위의 도메인 단위로 나뉘며, 이런 도메인의 분리 기준은 서비스 특성이 크게 달라지거나 전반적인 레이아웃이 변경될 때 분리한다.
  * [x] `service/review` 는 회고덕의 회고 관련 서비스 범위의 요소를 위치시킨다.
  * [x] `service/community`는 회고덕의 템플릿, 회원 관련 서비스 범위의 요소를 위치시킨다.



## 컴포넌트 분리 기준 관련

* [x] components로 분리할 시 분리된 컴포넌트에서는 내부적으로 상태를 가지지 않아야합니다.
  * pages 영역의 컴포넌트는 상태를 가지고 있어도 됩니다, (전반적으로 **페이지 컴포넌트**에서 상태를 props를 통해 내려주는 방식으로 구현합니다.)
  * components 영역의 컴포넌트 예외사항으로는 UI 관련 상태는 가지고 있어도 됩니다.

* [x] 컴포넌트 위치 기준은 아래와 같습니다.

  **common/components**

  * 현재 서비스와 전혀 연관 없이, 디자인 시스템에서 활용할 수 있는 수준의 범용 컴포넌트만 위치합니다.
  * 가능한 서비스 영역에서 컴포넌트를 작성할 때 가장 작은 요소가 되는 컴포넌트들을 위치시켜야 하며, 2개 이상의 목적을 가지고 있어선 안됩니다.
  * 예시 : Button, TextBox, SnackBar, Modal

  **service/*/components**

  * 여러 Element, Component를 혼합하여 사용하는 경우 이 영역에 위치시킵니다.

  **service/@shared/components**

  * 2개 이상의 도메인에서 사용되는 컴포넌트들을 위치시킵니다.

  **service/{도메인명}/components**

  * 해당 도메인에서만 사용되는 컴포넌트들만 위치시킵니다.

* [x] 컴포넌트 분리 시 체크 리스트는 아래와 같습니다. 아래 리스트에서 2개 이상 해당된다면 분리 부탁드립니다.
  1. 해당 컴포넌트가 재사용될 가능성이 있는가?
  2. 해당 코드를 컴포넌트로 분리하였을 때 코드 라인이 10줄 이상 줄어드는가?
  3. 해당 컴포넌트가 반복문을 통해 여러번 출력되는가?
  4. 해당 컴포넌트의 의도를 네이밍으로 드러내야할 필요성이 있는가?
  5. 해당 컴포넌트에서 너무 많은 기능을 담당하지는 않는가?



## API 관련

* [x] API 통신은 기본적으로 React Query를 통하여 작성한다.
* [x] React Query API 커스텀 훅은 pages 디렉토리 외의 영역에서는 사용을 금한다.
  * 여러 위치에서 사용하는 컴포넌트를 API에 종속시키는 것은 재사용성을 크게 떨어뜨리게 된다.

* [x] React Query에서 사용하는 API를 커스텀훅으로 분리할 때는 파일명을 아래와 같이 네이밍한다.

  ```react
  // useQuery
  useGet();
  
  // useMutation
  useCreate();
  useDelete();
  useUpdate();
  ```



## State, Props, Event 관련

* [x] 이벤트 핸들러의 네이밍은 `on{행위}`로 통일한다.

* [x] 컴포넌트-컴포넌트에서 Props를 내려줄 때는 상태를 변경하는 함수를 직접적으로 내려주지 않고
  아래와 같이 상위 컴포넌트에서 이벤트 핸들러 함수 네이밍을 통해 행위를 명시한 후 래핑하여 내려준다.

  ```react
  /*
  	제안한 이유 : 
  	상위 컴포넌트에서 하위 컴포넌트에서 발생되는 상태가 변경 사유를
  	바로 알아볼 수 있도록 명시하기 위함.
  */
  
  function Parent() {
  	const [state, setState] = useState(false);
    
    const onContentLoaded = () => {
      setState(true);
    }
  
  	return <Child onContentLoaded={onContentLoaded}/>
  }
  ```

* [x] **서버 상태를 제외한 상태는** 가능한 상위 컴포넌트에서 일괄적으로 관리하고, Props를 통해 상태를 내려준다.
  예시 : Page Component - Container Component(Stateless Component)

  제안한 이유 : 페이지 컴포넌트에서 상태 흐름을 한번에 파악할 수 있도록 하기 위함입니다.
  관리하는 상태가 많아지거나, Prop Driling이 심할 시 아래 우선 순위를 기준으로 리팩토링 부탁드립니다.

  1. 커스텀훅으로 분리
  2. 여러 Container에서 사용하는 상태는 Page, Container 개별적으로 사용하는 상태는 해당 Container에 상태 위임
  3. Context를 통해 해결

* [x] useRef를 사용할 시 해당 변수의 네이밍의 Subfix로 Ref를 표기한다.

  예시 : linkInputRef.current





## 에러 핸들링 / 유효성 검사 관련





## 타입 선언 관련

* [x] 1개 이상의 위치에서 사용되는 타입은 types/index.ts에 위치시킨다.
  * [x] TODO: 추후, 타입이 늘어난다면 해당 폴더에 도메인 단위로 분리시킨다.



## JSX 관련

* [x] JSX 작성 시 Children 요소가 없다면 바로 태그를 닫는 구조로 표현합니다.

* [x] ClassNames 라이브러리를 사용하는 기준은 해당 Element에 className이 여러개가 입력될 때 사용합니다.

  ```jsx
  // className의 요소가 한개만 있을 때
  <TextBox className={styles.classA}/>
  
  // className의 요소가 여러개가 있을 때
  <TextBox className={cn(styles.classA, styles.classB)}/>
  ```

  



## 커스텀훅 관련

* [x] **단일 페이지**에서 사용되는 커스텀훅이라면 컴포넌트와 함께 위치시킨다.
  * 예시 : 단일 페이지 내에서 비즈니스 로직을 분리하기 위한 커스텀훅.



## CSS 스타일 관련

* [x] 상위 컴포넌트의 스타일시트에서 자식 선택자를 통해 하위 컴포넌트의 Element를 선택하여 스타일을 추가할 수 없다.

  * 예시 : 상위 페이지에서 Button 요소에 스타일을 추가한다.

    ```
    // ⛔️ 올바르지 않은 방법
    <div className={styles.container}>
    	<Editor>컴포넌트입니다.</Editor>
    </div>
    
    .container > div {
    	background-color: red;
    }
    
    // ✅ 올바른 방법
    <div className={styles.container}>
    	<Editor className={styles.editor}>컴포넌트입니다.</Editor>
    </div>
    
    .editor {
    	background-color: green;
    }
    ```

  * 이유 : 이런식으로 스타일을 내려줄 시 계층에 종속된 구조로 작성되어 컴포넌트의 유연성이 떨어질 것으로 생각됩니다.
