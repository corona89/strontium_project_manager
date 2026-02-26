# Data Schema: Trello Copy 🦴

## 1. 관계형 스키마 (PostgreSQL/SQLite 기준)

### users (사용자)
- `id`: PK (UUID)
- ... (기존 필드)
- `totp_secret`: String (Encrypted OTP Secret)
- `is_2fa_enabled`: Boolean (Default: false)
- `recovery_codes`: JSON (백업 코드 목록)

### workspaces (워크스페이스)
- `id`: PK (UUID)
- `name`: String
- `owner_id`: FK (users.id)
- `created_at`: Timestamp

### workspace_members (워크스페이스 멤버)
- `workspace_id`: FK (workspaces.id)
- `user_id`: FK (users.id)
- `role`: Enum ('admin', 'member')

### boards (보드)
- `id`: PK (UUID)
- `workspace_id`: FK (workspaces.id)
- `title`: String
- `background`: String (Color code or URL)
- `is_public`: Boolean (Default: false)
- `position`: Float (Sort order)

### lists (리스트)
- `id`: PK (UUID)
- `board_id`: FK (boards.id)
- `title`: String
- `position`: Float (리스트 내 순서 정렬용 - Fractional Indexing 방식 채택)

### cards (카드)
- `id`: PK (UUID)
- `list_id`: FK (lists.id)
- `title`: String, NOT NULL
- `description`: Text (Markdown)
- `position`: Float (리스트 내 카드 순서)
- `due_date`: Timestamp (Nullable)
- `priority`: Enum ('low', 'med', 'high')
- `is_archived`: Boolean (Default: false)

### card_members (카드 담당자)
- `card_id`: FK (cards.id)
- `user_id`: FK (users.id)

### comments (댓글)
- `id`: PK (UUID)
- `card_id`: FK (cards.id)
- `author_id`: FK (users.id)
- `content`: Text
- `created_at`: Timestamp

### attachments (첨부 파일)
- `id`: PK (UUID)
- `card_id`: FK (cards.id)
- `file_name`: String
- `file_url`: String (S3 or Local path)
- `file_type`: String (MIME)
- `created_at`: Timestamp

---

## 3. 정밀도 관리 전략
- `position` 값이 소수점 10자리 이하로 좁아질 경우, 해당 리스트/보드의 모든 아이템 순서를 100, 200, 300 단위로 재정렬(Normalization)하는 백그라운드 태스크를 수행한다.

리스트와 카드의 `position` 필드는 정밀(Float) 타입으로 저장합니다. 
- 카드를 1번과 2번 사이로 옮길 때: `(1.0 + 2.0) / 2 = 1.5`
- 이 방식을 통해 순서 변경 시 주변 모든 데이터의 인덱스를 업데이트하는 불합리함을 제거하고, 단 한 건의 데이터만 수정하여 50인 동시 접속 환경에서의 성능을 극대화합니다.
