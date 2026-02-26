# API Specification: Trello Copy 🔗

## 1. 인증 (Authentication - 2FA Flow)
- `POST /api/v1/auth/login`: 1단계 비밀번호 확인 (성공 시 임시 2FA 세션 토큰 응답)
- `POST /api/v1/auth/2fa/setup`: 사용자의 OTP Secret 생성 및 QR 코드 정보 제공
- `POST /api/v1/auth/2fa/verify`: OTP 번호 검증 (최종 JWT Access Token 발급)
- `POST /api/v1/auth/token/refresh`: Refresh Token을 이용한 세션 갱신

## 2. 보드 (Boards)
- `GET /api/v1/boards`: 참여 중인 보드 목록 조회
- `POST /api/v1/boards`: 보드 생성
- `GET /api/v1/boards/{id}`: 특정 보드 상세(리스트+카드 포함) 조회
- `PUT /api/v1/boards/{id}`: 보드 설정 변경

## 3. 리스트 (Lists)
- `POST /api/v1/lists`: 리스트 생성
- `PUT /api/v1/lists/{id}`: 리스트 제목 변경 및 위치(`position`) 이동

## 4. 카드 (Cards)
- `POST /api/v1/cards`: 카드 생성
- `GET /api/v1/cards/{id}`: 카드 상세 정보 조회 (댓글 포함)
- `PUT /api/v1/cards/{id}`: 카드 내용, 담당자, 마감일, 위치(`position`) 수정
- `DELETE /api/v1/cards/{id}`: 카드 삭제

## 5. 실시간 이벤트 (WebSocket Events)
*클라이언트는 보드 ID 룸에 접속한 상태여야 함*
- `SEND: join_board { "board_id": "uuid" }`
- `RECV: card_updated { "type": "move", "card_id": "uuid", "from_list": "...", "to_list": "..." }`
- `RECV: list_created { "list_id": "uuid", "title": "..." }`
