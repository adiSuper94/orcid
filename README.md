# WIP: ORCID

A TypeScript/JavaScript wrapper to call ORCID API endpoints.

## Installation

### Deno

```bash
deno add jsr:@adisuper94/orcid
// or
deno add npm:@adisuper94/orcid
```

### Node

```bash
npx jsr add @adisuper94/orcid
// or
npm install @adisuper94/orcid
```

## Basic Usage

```typescript
const orcidId = "0000-0000-0000-0000";
const [edu, err] = await getEmployment(orcidId);
if (err) {
  //handle err
}
```
