# 🚀 API 레이어 컨벤션 설명

- 백엔드 측에서 API 명세 문서를 작성해주어도
  API 레이어는 유지/보수할 때 다른 프론트엔드 개발자가 참고할 API 명세표라 생각해주세요.



## 네이밍 기준

- 문법상 어색해도 OK!
  행위와 도메인, 어떤 API인지 파악이 쉽도록 순차적으로 네이밍 지정합니다.

  ```
  fetch + {Http Method} + {CRUD} + {Target}
  (http method와 crud가 겹칠 시 하나로 입력)
  
  EX:
  fetchGetReviewForm
  - Http method: GET
  - (생략) CRUD: GET
  - Target: ReviewForm
  
  fetchPutUpdateReviewForm
  - Http method: PUT
  - CRUD: Update
  - Target: ReviewForm
  ```



## 타입 선언 기준

- API 명세 볼 필요도 없도록 Request, Response 타입은 API 레이어에서 타이핑하고
  하위 계층에서 겹치는 타입은 Models로 분리해주세요.
  : 여기서 겹치는 타입은 백엔드의 Entity or DTO 기준입니다. 중복된다고 임의로 타입 빼면 안됩니다.
  : 백엔드 크루들과 가장 작은 Entity, DTO 단위부터 API 명세 함께 협의 하세요.

- API 레이어에서 타입 선언 시 type으로 선언하여주세요.
  : interface 선언 시, 동일 타입명 선언 케이스 시 선언적 확장으로 혼동 생길 수 있어요.
- API 레이어에서 객체의 최상위 계층에서는 확장하지말고, 직접 타이핑해주세요.
  : 유지/보수 과정에서 다른 타입의 변동사항이 생길 때 사이드 이펙트가 생길 수 있어요.
-  

