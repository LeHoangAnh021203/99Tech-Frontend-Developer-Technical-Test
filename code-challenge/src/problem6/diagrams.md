# Scoreboard API Service - System Diagrams

## 1. System Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Server    │    │   Database      │
│   (React/Vue)   │◄──►│   (Express.js)  │◄──►│   (PostgreSQL)  │
│                 │    │                 │    │                 │
│ - Scoreboard    │    │ - Authentication│    │ - Users         │
│ - Real-time UI  │    │ - Score Logic   │    │ - Scores        │
│ - WebSocket     │    │ - Rate Limiting │    │ - History       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   WebSocket     │    │   Redis Cache   │    │   Audit Logs    │
│   Server        │    │                 │    │                 │
│                 │    │ - Session Data  │    │ - All Actions   │
│ - Live Updates  │    │ - Rate Limits   │    │ - Security      │
│ - Broadcasting  │    │ - Leaderboard   │    │ - Compliance    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 2. Score Increment Flow

```
User Action
    │
    ▼
┌─────────────────┐
│ Complete Action │
│ (Game, Quiz,    │
│  etc.)          │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ Frontend App    │
│ - Generate      │
│   Action Proof  │
│ - Send Request  │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ API Server      │
│ - Validate JWT  │
│ - Check Rate    │
│   Limits        │
│ - Verify Action │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ Database        │
│ - Update Score  │
│ - Log History   │
│ - Update Cache  │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ WebSocket       │
│ - Broadcast     │
│   Update        │
│ - Notify All    │
│   Clients       │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ All Clients     │
│ - Update UI     │
│ - Show New      │
│   Leaderboard   │
└─────────────────┘
```

## 3. Authentication Flow

```
User Login
    │
    ▼
┌─────────────────┐
│ Enter Credentials│
│ (Username/Pass) │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ API Server      │
│ - Hash Password │
│ - Check Database│
│ - Generate JWT  │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ Return Tokens   │
│ - Access Token  │
│   (15 min)      │
│ - Refresh Token │
│   (7 days)      │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ Store Tokens    │
│ - Local Storage │
│ - HTTP Only     │
│   Cookies       │
└─────────────────┘
```

## 4. Security Layers

```
Request
    │
    ▼
┌─────────────────┐
│ Rate Limiting   │
│ - Per IP        │
│ - Per User      │
│ - Per Endpoint  │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ Authentication  │
│ - JWT Validation│
│ - Token Expiry  │
│ - User Active   │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ Input Validation│
│ - Schema Check  │
│ - Type Safety   │
│ - Sanitization  │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ Business Logic  │
│ - Action Proof  │
│ - Score Limits  │
│ - Audit Logging │
└─────────────────┘
```

## 5. Database Schema Relationships

```
┌─────────────────┐
│     Users       │
│                 │
│ - id (UUID)     │
│ - username      │
│ - email         │
│ - password_hash │
│ - created_at    │
└─────────────────┘
         │
         │ 1:1
         ▼
┌─────────────────┐
│     Scores      │
│                 │
│ - id (UUID)     │
│ - user_id (FK)  │
│ - current_score │
│ - total_increments│
│ - last_increment│
└─────────────────┘
         │
         │ 1:Many
         ▼
┌─────────────────┐
│  Score History  │
│                 │
│ - id (UUID)     │
│ - user_id (FK)  │
│ - increment_amt │
│ - action_type   │
│ - action_proof  │
│ - created_at    │
└─────────────────┘
```

## 6. WebSocket Event Flow

```
Client A                    Server                    Client B
    │                         │                         │
    │─── leaderboard:subscribe ──►│                         │
    │                         │                         │
    │◄── leaderboard:data ────│                         │
    │                         │                         │
    │─── score:increment ────►│                         │
    │                         │                         │
    │                         │─── leaderboard:updated ──►│
    │◄── score:updated ───────│                         │
    │                         │                         │
    │                         │◄── leaderboard:updated ──│
```

## 7. Error Handling Flow

```
API Request
    │
    ▼
┌─────────────────┐
│ Validation      │
│ - Input Check   │
│ - Schema Verify │
└─────────────────┘
    │
    ▼ (if error)
┌─────────────────┐
│ 400 Bad Request │
│ - Error Details │
│ - Field Info    │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ Authentication  │
│ - JWT Check     │
│ - Token Valid   │
└─────────────────┘
    │
    ▼ (if error)
┌─────────────────┐
│ 401 Unauthorized│
│ - Token Invalid │
│ - Expired       │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ Rate Limiting   │
│ - Check Limits  │
│ - Count Requests│
└─────────────────┘
    │
    ▼ (if error)
┌─────────────────┐
│ 429 Too Many    │
│ - Rate Exceeded │
│ - Retry After   │
└─────────────────┘
```

## 8. Deployment Architecture

```
┌─────────────────┐
│   Load Balancer │
│   (Nginx/AWS)   │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│   API Servers   │
│   (Docker)      │
│                 │
│ ┌─────────────┐ │
│ │ Server 1    │ │
│ └─────────────┘ │
│ ┌─────────────┐ │
│ │ Server 2    │ │
│ └─────────────┘ │
│ ┌─────────────┐ │
│ │ Server N    │ │
│ └─────────────┘ │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│   Database      │
│   (PostgreSQL)  │
│                 │
│ - Primary DB    │
│ - Read Replicas │
│ - Backup        │
└─────────────────┘
```

## 9. Monitoring & Alerting

```
┌─────────────────┐
│   Application   │
│   Metrics       │
│                 │
│ - Response Time │
│ - Error Rate    │
│ - Throughput    │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│   Monitoring    │
│   System        │
│                 │
│ - Prometheus    │
│ - Grafana       │
│ - AlertManager  │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│   Alerts        │
│                 │
│ - High Error    │
│ - Slow Response │
│ - Security      │
└─────────────────┘
```

## 10. Data Flow for Real-time Updates

```
User Action
    │
    ▼
┌─────────────────┐
│ Score Update    │
│ Request         │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ API Processing  │
│ - Validate      │
│ - Update DB     │
│ - Update Cache  │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ WebSocket       │
│ Broadcasting    │
│ - Leaderboard   │
│ - User Score    │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│ All Connected   │
│ Clients         │
│ - Update UI     │
│ - Show Changes  │
└─────────────────┘
```

---

*These diagrams illustrate the complete system architecture, data flow, and security measures for the Scoreboard API Service.*
