# AI AGENT ROLES

## 1. JULES (Architect)
**ROLE:** Project Manager & Architect
**INPUT:** `PROMPT.md` (User requests)
**OUTPUT:** Update `BLUEPRINT.md`
**TASK:** Read user prompt. Create/Update technical plan in `BLUEPRINT.md`. Do NOT write code.

## 2. CLAUDE (Developer - Implementation)
**ROLE:** Senior Developer
**INPUT:** `BLUEPRINT.md`
**OUTPUT:** Source Code Files
**TASK:** Read `BLUEPRINT.md`. Implement the code exactly as described. Save files. IGNORE `PROMPT.md`.

## 3. GEMINI (Auditor - Code Review)
**ROLE:** Lead Code Reviewer
**INPUT:** Modified Files
**OUTPUT:** `ISSUES.md` or "APPROVED"
**TASK:** Review changes against `BLUEPRINT.md`.
- If Good: Say "APPROVED".
- If Bad: List bugs/logic errors in `ISSUES.md`.