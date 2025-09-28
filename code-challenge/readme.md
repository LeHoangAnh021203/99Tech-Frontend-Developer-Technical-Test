# 99Tech Frontend Developer Technical Test

Complete 6 tests from 99Tech – Frontend Developer Technical Test

## Overview

This repository contains solutions to 6 frontend development challenges covering various aspects of modern web development including JavaScript, TypeScript, React, Node.js, and system design.

## Problem Solutions

### Problem 1: JavaScript Fundamentals
**Location:** `src/problem1/`
**Description:** Basic JavaScript concepts and algorithms
**Status:** ✅ Completed

### Problem 2: Frontend Development with Vite
**Location:** `src/problem2/`
**Description:** Modern frontend development using Vite build tool
**Status:** ✅ Completed

**How to run:**
```bash
cd src/problem2
npm install
npm run dev
```
Open http://localhost:5173 in your browser

### Problem 3: TypeScript & React Refactoring
**Location:** `src/problem3/`
**Description:** TypeScript implementation and React component refactoring
**Status:** ✅ Completed

**Files:**
- `demo.ts` - Original TypeScript demo
- `refactored.tsx` - Refactored React component
- `analysis.md` - Detailed analysis and improvements

**How to run:**
```bash
cd src/problem3
npm install
npm run dev
```

### Problem 4: Algorithm Implementation
**Location:** `src/problem4/`
**Description:** Three unique implementations of sum_to_n function
**Status:** ✅ Completed

**Files:**
- `simple.ts` - Basic implementation
- `sum_implementations.ts` - Three different approaches
- `analysis.md` - Performance analysis

**How to run:**
```bash
cd src/problem4
npm install
npx ts-node simple.ts
npx ts-node sum_implementations.ts
```

### Problem 5: Node.js Backend API
**Location:** `src/problem5/`
**Description:** Complete REST API with TypeScript, Express, and SQLite
**Status:** ✅ Completed

**Features:**
- User CRUD operations
- Input validation
- Error handling
- TypeScript support
- SQLite database

**How to run:**
```bash
cd src/problem5
npm install
npm run build
npm start
```

**API Endpoints:**
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

**Database:** SQLite database with sample data in `data/users.db`

### Problem 6: System Design & Architecture
**Location:** `src/problem6/`
**Description:** System architecture design and improvements
**Status:** ✅ Completed

**Files:**
- `README.md` - Problem description
- `diagrams.md` - System architecture diagrams
- `improvements.md` - Detailed improvement suggestions

## Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+), TypeScript, React
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** SQLite
- **Build Tools:** Vite, npm
- **Development:** TypeScript, ESLint

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/LeHoangAnh021203/99Tech-Frontend-Developer-Technical-Test.git
   cd 99Tech-Frontend-Developer-Technical-Test
   ```

2. **Navigate to specific problem:**
   ```bash
   cd code-challenge/src/problem[X]
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Run the solution:**
   ```bash
   npm run dev    # For frontend problems
   npm start      # For backend problems
   npx ts-node [file.ts]  # For TypeScript files
   ```

## Project Structure

```
code-challenge/
├── src/
│   ├── problem1/          # JavaScript Fundamentals
│   ├── problem2/          # Frontend with Vite
│   ├── problem3/          # TypeScript & React
│   ├── problem4/          # Algorithm Implementation
│   ├── problem5/          # Node.js Backend API
│   └── problem6/          # System Design
└── readme.md              # This file
```

## Notes

- Each problem is self-contained with its own dependencies
- All solutions include proper error handling and validation
- Code follows modern JavaScript/TypeScript best practices
- Comprehensive documentation and analysis provided
- Ready for production deployment

## Contact

**Developer:** Hoang Anh  
**Email:** [Your Email]  
**GitHub:** [LeHoangAnh021203](https://github.com/LeHoangAnh021203)

---

*Note: This repository contains solutions to 99Tech Frontend Developer Technical Test. All problems have been completed with detailed analysis and documentation.*
