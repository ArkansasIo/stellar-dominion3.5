# Research Documentation Index

Quick navigation to all technology research documentation.

## Getting Started

1. **[ResearchAPITesting.md](ResearchAPITesting.md)** - 5-minute quick start, cURL examples, smoke tests

## API Reference

2. **[ResearchAPI.md](ResearchAPI.md)** - Complete REST API documentation (20+ endpoints)
3. **[ResearchAPIEndpointMap.md](ResearchAPIEndpointMap.md)** - Visual endpoint structure

## Implementation

4. **[ResearchImplementationGuide.md](ResearchImplementationGuide.md)** - Architecture, file structure, extending the system

## Research Lab

5. **[ResearchLab.md](ResearchLab.md)** - Lab management, queuing, acceleration mechanics
6. **[ResearchLabTestSummary.md](ResearchLabTestSummary.md)** - Implementation status and test results

## Source Files

| File | Purpose |
|------|---------|
| `server/routes-research.ts` | Research API endpoints |
| `server/routes-researchlab.ts` | Lab API endpoints |
| `server/routes-researchxp.ts` | Research XP endpoints |
| `server/routes-recommendations.ts` | Recommendation endpoints |
| `server/services/researchLabService.ts` | Lab business logic |
| `server/services/researchXPService.ts` | XP tracking logic |
| `server/services/researchTradingService.ts` | Trading logic |
| `server/services/researchRecommendationsService.ts` | Recommendations logic |
| `shared/config/technologyTreeConfig.ts` | Tech tree framework |
| `shared/config/technologyTreeExpandedConfig.ts` | Procedural generators |
| `shared/config/researchQueueConfig.ts` | Queue configuration |
