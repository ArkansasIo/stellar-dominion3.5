# Architecture & Technical Overview

Stellar Dominion is built as a modern Single Page Application (SPA) designed for speed and interactivity.

## 🛠️ Tech Stack
*   **Frontend**: React (Vite), TypeScript.
*   **Styling**: Tailwind CSS, Shadcn/UI, Lucide Icons.
*   **Routing**: Wouter.
*   **State Management**: React Context API (GameContext).
*   **Mock Backend**: Client-side simulation for prototype phase (no server-side persistence yet).

## 🧩 System Design

### GameContext
The central brain of the client-side application. It manages:
*   **Resources**: Real-time tickers for Metal/Crystal/Deut.
*   **GameState**: Buildings, Research levels, Fleet counts.
*   **Mission Loop**: Processes fleet movements and combat resolution.
*   **Cron Jobs**: Handles periodic tasks like auto-mining.

### Game Loop
A `useEffect` hook runs every second (1000ms) to:
1.  Calculate resource production.
2.  Process the Construction/Research queues.
3.  Update fleet positions and resolve mission arrivals.
4.  Trigger random events.

## 💾 Data Structure
Data is currently held in memory.
*   `user`: Commander profile.
*   `planets`: Array of colonized worlds.
*   `fleet_movements`: Active missions.

## UML: Architecture

```mermaid
graph TD
    Client[React Client]
    Context[GameContext State]
    Logic[GameLogic Library]
    
    Client -->|Action: Build| Context
    Client -->|Action: Research| Context
    Client -->|Action: Attack| Context
    
    Context -->|Tick| Logic
    Logic -->|Calculate Production| Context
    Logic -->|Resolve Combat| Context
    
    subgraph Data Models
        Resources
        Buildings
        Tech
        Units
        Missions
    end
    
    Context --- Data Models
```
