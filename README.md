(작성중)

## BAAM
고교학점제 반영 커뮤니티 앱

#### 개요
- 기간: 2024-06 ~ 2024-11
- **원본 프로젝트:** 
  - 백엔드: [project-baam/baam-server](https://github.com/project-baam/baam-server.git)
  - 프론트엔드: [project-baam/frontend](https://github.com/project-baam/frontend.git)

#### 서비스 소개
<div align="center">
<img src="./baam_img1.jpg" alt="서비스 소개1" width="800"/>
<img src="./baam_img2.jpg" alt="서비스 소개2" width="800"/>
</div>


##### 주요 기능
1. 학교 정보 및 시간표 관리
- NEIS Open API 연동을 통한 학교 정보, 학급 정보 조회
- 2015 및 2022 개정 교육과정 과목 데이터 DB화
- 공지사항, 급식 데이터 조회

2. 과목별 채팅
- 분반별 자동 참여: 시간표에 등록된 과목 기반 채팅방 자동 참여
- 학급 단톡방: 학급 기준 채팅방 자동 생성 및 참여
- 채팅 메시지 암호화, 모든 사용자가 읽는 즉시 서버에서 삭제

3. 친구 관리
- 같은 학교 학생 검색 및 친구 요청
- 친구 시간표 확인 및 현재 수업 상태 표시
- 초성별 친구 목록 필터링

4. 알림 관리 & 푸시 알림
- 푸시 알림: 예약 일정, 친구 요청 수락/거절 알림
  
5. 개인/학급/학교 일정, 메모



#### 기술 스택
##### 프론트엔드
- React Native

##### 백엔드
- TypeScript / NestJS
- PosgreSQL / TypeORM
- Socket.io(WebSocket)
- Redis
- FCM(Firebase Cloud Messaging)

##### 인프라
- Digital Ocean
  - Droplet (VM)
  - Spaces Object Storage
  - Databases: Redis
- Supabase: PostgreSQL




### 헥사고날 아키텍처 도입
- 헥사고날 아키텍처 첫 시도로 실험적 적용  
  👉[이후 더 엄격하게 구현💡](https://naver.com)👈
- 완전한 구조가 아닌 기본 개념만 도입

##### 도입한 것
- 포트(추상 Repository 인터페이스)와 어댑터(구현) 분리
  - 도메인: `module/<기능>/domain`
  - 애플리케이션: `module/<기능>/application`, 유스케이스 서비스, 포트(인터페이스)
  - 어댑터: 
    - `module/<기능>/adapter/persistence`: TypeORM/Redis 구현
    - `module/<기능>/adapter/presenter`: REST 컨트롤러/WebSocket 게이트웨이

#### 공통 예외 처리 시스템
  ####
  ```typescript
  // 어댑터와 관계없이(REST API, WebSocket, GraphQL..) 동일한 도메인 예외 사용
  throw new ContentNotFoundError('Room', roomId);
  ```
   ➡️ 도메인 로직에서는 RET API나 WebSocket등 어떤 인터페이스를 통해 전달되는지 신경쓰지 않음
   ➡️ 각 어댑터에 연결된 예외 필터가 알맞은 형식으로 변환

  - 프레젠터 계층별 커스텀 데코레이터와 예외필터 연결
    - `@RestApi` - `RestExceptionFilter`
    - `@AppWebSocketGateway` - `WebsocketExceptionFilter`
    ```typescript
    // 커스텀 데코레이터
    export function RestApi(): MethodDecorator & ClassDecorator;
    export function RestApi(prefix: string | string[],): MethodDecorator & ClassDecorator;
    export function RestApi(options: ControllerOptions): MethodDecorator & ClassDecorator;
    export function RestApi(param?: string | string[] | ControllerOptions) {
    const decorators: (MethodDecorator | ClassDecorator)[] = [
      UseFilters([InternalServerErrorFilter,RestExceptionFilter, // <--
      ParameterValidationExceptionFilter]),
      ];
    // ...

    // 커스텀 예외 필터
    @Catch(ApplicationException)
    export class RestExceptionFilter<T extends ApplicationException> implements ExceptionFilter
    {
      catch(exception: T, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse<Response>();
        response.status(exception.getStatus()).json({
          code: exception.code,
          message: exception.message,
        });
      }
    }
    ```


#### ERD
<div align="center">
<a href="./erd.png" target="_blank">
  <img src="./erd_thumb.jpg" alt="ERD 썸네일" width="400"/>
</a>
</div>



