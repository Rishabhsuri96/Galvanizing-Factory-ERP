# Galvanizing Factory ERP

A custom-built ERP system for hot-dip galvanizing factories designed to manage challans, production workflow, dispatch operations, user permissions, and factory reporting.

## Project Status

**Phase 1 Complete**

Current version is production-ready for initial factory deployment and testing.

---

# Technology Stack

## Frontend

* Next.js 16 (App Router)
* React 19
* TypeScript
* Tailwind CSS

## Backend

* Next.js Server Actions
* API Routes
* JWT Authentication

## Database

* PostgreSQL
* Prisma ORM

## Deployment

* GitHub
* Supabase PostgreSQL (planned)
* Vercel (planned)

---

# Features

## Authentication

* Secure login system
* JWT-based sessions
* Session persistence
* Logout functionality

## User Management

Roles:

* OWNER
* MANAGER
* ACCOUNTANT

Permission-based access control:

* VIEW_DASHBOARD
* VIEW_SEARCH
* MANAGE_PARTIES
* MANAGE_CHALLANS
* MANAGE_PRODUCTION
* MANAGE_DISPATCH
* VIEW_REPORTS
* MANAGE_USERS
* VIEW_ACTIVITY_LOGS

Route protection enforced through middleware/proxy.

---

# Business Workflow

## Challan Entry

When material arrives:

Create Challan

Item status:

RECEIVED

---

## Production

Production screen shows:

RECEIVED items

When galvanizing is completed:

RECEIVED → READY

using the Mark Ready action.

---

## Dispatch

Dispatch screen shows:

READY
PARTIALLY_DISPATCHED

Dispatch reduces currentWeight.

Status transitions:

READY → PARTIALLY_DISPATCHED

or

READY → COMPLETED

when remaining weight becomes zero.

---

# Modules

## Dashboard

Displays:

* Pending For Galvanizing
* Ready For Dispatch
* Pending Challans
* Today's Dispatch
* Vehicles Today
* Total Parties

Additional sections:

* Pending Challans Preview
* Recent Dispatches

---

## Party Management

Stores:

* Party Name
* GST Number
* Address
* Phone
* Email
* Contact Person

Supports:

* Active Parties
* Disabled Parties

Disabled parties are hidden from new challan creation.

---

## Challan Management

Stores:

* Challan Number
* Vehicle Number
* E-Way Number
* Received Weight
* Item Details

Supports multiple items per challan.

---

## Production Module

Displays pending items.

Allows:

RECEIVED → READY

workflow transition.

---

## Dispatch Module

Supports:

* Partial Dispatch
* Full Dispatch

Prevents dispatch quantity from exceeding available weight.

---

## Search

Global search functionality across ERP records.

---

## Reports

Factory reporting module.

---

## Activity Logs

Tracks:

* User actions
* ERP activities
* Operational changes

---

# Database Models

* User
* Permission
* UserPermission
* Party
* Challan
* ChallanItem
* Dispatch
* DispatchItem
* ActivityLog

---

# Prisma Migrations

Current migration history:

1. Initial Schema
2. Permissions System
3. Activity Log Enhancements
4. User Active Flag
5. Party Active Flag

---

# Development Commands

Install dependencies:

npm install

Run development server:

npm run dev

Build production:

npm run build

Run production server:

npm run start

Open Prisma Studio:

npx prisma studio

Cleanup test data:

npm run cleanup

---

# Default Seed

Seed script creates:

* System Owner account
* Default permissions
* Owner permission mappings

Run:

npx prisma db seed

---

# Current Status

Phase 1 Complete

Next Steps:

* Supabase PostgreSQL Migration
* Vercel Deployment
* Production Rollout
* Phase 2 Enhancements

---

# Author

Rishabh Suri

Developed for real-world galvanizing factory operations and workflow digitization.
