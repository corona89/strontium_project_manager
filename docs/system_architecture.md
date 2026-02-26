# System Architecture: Trello Copy (v2 - Modern Stack) 🏗️

## 1. 기술 스택 (Modern Tech Stack)
- **Backend Service (API)**
  - **FastAPI**: 고성능 비동기 처리를 위한 Python 프레임워크.
  - **SQLAlchemy / Alembic**: DB ORM 및 마이그레이션 관리.
  - **PyOTP**: Google Authenticator 등 2FA(TOTP) 구현용.
- **Web Service (Frontend)**
  - **Next.js (App Router, TypeScript)**: SSR/ISR 및 타입 안정성 확보.
  - **Tailwind CSS**: 유틸리티 우선의 빠른 스타일링.
  - **Lucide React**: 일관된 시스템 아이콘 세트.
- **Database**: **PostgreSQL** (Docker 환경에서의 안정성을 위해 SQLite에서 승격)
- **Containerization**: **Docker & Docker Compose**
  - API와 Web 서비스를 독립된 이미지로 빌드.
  - Kubernetes Pod 또는 Docker Swarm에 최적화된 설정 제공.

## 2. 인증 및 보안 전략 (Auth & 2FA)
- **Session**: ID/PW 기반 로그인 후 **JWT (Access & Refresh Tokens)** 발급.
- **2FA (Multi-Factor)**: 
  - 최초 로그인 후 OTP 등록 시 Secret Key를 사용자 DB에 암호화하여 저장.
  - 로그인 성공 후 OTP 검증 단계(`auth/2fa/verify`) 통과 시 최종 JWT 교부.
- **Security**: JWT는 쿠키(HttpOnly, Secure) 또는 Authorization 헤더로 관리.

## 3. 배포 아키텍처 (Deployment)
- **Image A (api-service)**: FastAPI 소스 전용 컨테이너.
- **Image B (web-service)**: Next.js 빌드 산출물 전용 컨테이너.
- 두 서비스는 환경변수(`API_URL`)를 통해 통신하며, 각각 독립적으로 스케일링 가능.
