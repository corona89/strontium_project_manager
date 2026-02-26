# Trello Copy: BMAD Design Document 🏗️

이 문서는 BMAD(Business-Model-Architecture-Design) 방법론을 바탕으로 작성되었습니다.

## Phase 1: Business (비즈니스 요구사항)
- **Target**: 동시 사용자 50명 이하의 스타트업 또는 프로젝트 팀.
- **Value Proposition**: 
  - Trello의 복잡한 기능을 걷어낸 **초경량 속도**.
  - 설정 없이 즉시 사용할 수 있는 **직관적인 UX**.
  - 소규모 팀에 최적화된 **실시간 협업**.

## Phase 2: Model (도메인 모델링)

### 2.1 핵심 엔티티 (Entities)
1. **User**: 계정 정보 (Email, Nickname, Avatar).
2. **Workspace**: 보드들의 컨테이너 (Name, Description).
3. **Board**: 협업의 단위 (Title, Background, Visibility).
4. **List**: 카드의 단계 (Title, Position).
5. **Card**: 실제 작업 단위 (Title, Desc, Due_Date, Priority, Position).
6. **Comment/Activity**: 소통 및 이력 기록.

### 2.2 관계도 (Relationships)
- `User` (1) --- (N) `Workspace` (Owner/Member)
- `Workspace` (1) --- (N) `Board`
- `Board` (1) --- (N) `List`
- `List` (1) --- (N) `Card`
- `Card` (N) --- (M) `User` (Assignees)

## Phase 3: Architecture (시스템 아키텍처) - *계획*
- **Backend**: Python FastAPI (비동기 처리로 50명 동시 접속 최적화).
- **Database**: SQLite (50명 이하 규모에서 관리 효율 극대화) 또는 PostgreSQL.
- **Real-time**: WebSockets (카드 이동 시 즉각 반영).
- **Frontend**: Pure HTML/Javascript (jQuery) - *Node.js 빌드 생략*.

## Phase 4: Design (상세 API 설계) - *To be continued*
