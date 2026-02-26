# Folder Structure: Trello Copy (Dockerized) 📂

```text
trello_copy/
├── backend/                # API Service (FastAPI)
│   ├── app/                # Backend Source
│   ├── tests/
│   ├── Dockerfile          # Backend Image Build
│   └── requirements.txt
├── frontend/               # Web Service (Next.js)
│   ├── src/                # Next.js App (TSX)
│   ├── public/
│   ├── Dockerfile          # Frontend Image Build
│   ├── tailwind.config.ts
│   └── package.json
├── docker-compose.yml      # Local Orchestration
├── docs/                   # BMAD Documents
└── .env.example            # Environment Template
```
