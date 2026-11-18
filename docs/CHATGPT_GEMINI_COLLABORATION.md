# ChatGPT ↔ Gemini Collaboration

## Goal

Use ChatGPT as the project lead and Gemini as an independent reviewer/research partner on the same BhriguSetu task:

1. ChatGPT inspects the relevant repository files and defines a bounded task.
2. ChatGPT calls the BhriguSetu MCP tool `consult_gemini_tool` with the task and only the context that should be shared.
3. Gemini returns an independent research, architecture or code-review perspective.
4. ChatGPT checks the response against the repository, tests and source material, then proposes or implements the verified changes.
5. ChatGPT can call Gemini again with the revised draft or unresolved points. Gemini output is advisory; it never changes repository files or deploys code.

This is a review/delegation loop, not an autonomous agent with unrestricted repository access.

## Remote MCP endpoint

- URL: `https://bhrigusetu-api.onrender.com/mcp`
- Transport: MCP Streamable HTTP
- Authentication: HTTP Bearer token
- Required Render environment variables:
  - `BHRIGUSETU_MCP_TOKEN` — protects the remote MCP endpoint.
  - `GEMINI_API_KEY` — Google Gemini Developer API key, used only by the backend.
  - `GEMINI_MODEL` — optional model override; otherwise the backend default is used.

Never place either secret in GitHub, frontend code, a URL, screenshots or chat messages. Keep both in Render's secret environment-variable settings.

## Gemini tool contract

Use `consult_gemini_tool` for independent model consultation. Inputs:

- `task`: the specific question, implementation proposal or review request.
- `context`: optional caller-supplied source excerpts, requirements, code or ChatGPT draft.
- `model`: optional Gemini model override.
- `max_output_tokens`: bounded response size.

Only the supplied task and context are sent to Google. The tool does not automatically attach repository files, user birth data, prior chats or secrets. ChatGPT must first retrieve the exact files it wants reviewed and pass only the relevant excerpts. Gemini cannot commit, edit, deploy or claim to have inspected files it was not given.

## Recommended collaboration prompt

When the BhriguSetu MCP app is connected in ChatGPT, explicitly request:

> Use BhriguSetu MCP's consult_gemini_tool as an independent reviewer. First inspect the relevant repository files with the GitHub connection. Send Gemini only the task and the minimum relevant excerpts. Ask it to identify correctness risks, missing edge cases, test gaps and alternative designs. Then independently verify its claims against the repository and tests. Do not apply Gemini suggestions blindly. Make changes only after the review is complete, and report which suggestions were accepted or rejected and why.

For a second pass, pass ChatGPT's revised proposal and the unresolved review points as the next task/context.

## ChatGPT connection availability

ChatGPT's current Help Center documents custom MCP server connections for Business and Enterprise/Edu workspaces on ChatGPT web. It does not list the Free plan as eligible, and custom MCP server setup is not available from the ChatGPT mobile app. Availability and plan rules can change; check the current ChatGPT Plugins / Apps settings before attempting setup.

There is also an authentication integration gap: this BhriguSetu endpoint currently validates a static Bearer token, while ChatGPT's documented custom-server flow lists OAuth, no authentication, or OAuth-or-no-auth. This repository does not yet implement an OAuth authorization server for the MCP endpoint. Therefore, do not assume the existing static token can be entered into ChatGPT, and do not choose unauthenticated access. A secure OAuth-compatible auth layer must be implemented and tested before direct ChatGPT custom-MCP connection can be called complete.

When the account and surface support custom MCP connections:

1. Open ChatGPT on the web and open Plugins / Apps.
2. Choose Add custom MCP server.
3. Enter the remote MCP URL above.
4. Use the supported OAuth flow after BhriguSetu's OAuth-compatible MCP authentication layer has been implemented; never choose unauthenticated access.
5. Review the discovered tool list and enable only the required Gemini consultation tool.
6. Start a new conversation, select the BhriguSetu app, and ask ChatGPT to call `consult_gemini_tool`.

If the current ChatGPT plan or surface does not offer custom MCP connections, do not weaken the endpoint's authentication to work around that limitation. The BhriguSetu `/ai-workspace` page remains a separate manual Gemini interface; it is not itself a direct ChatGPT connector.

## Privacy and change control

- Gemini output is external model output and must be treated as untrusted, unverified advice.
- Send only task-relevant, non-secret context.
- Do not send personal birth data unless the task genuinely requires it and the user explicitly intends to share it with Google.
- Keep GitHub write access with ChatGPT's existing repository workflow and review diffs/tests before merging.
- Gemini never receives an implicit GitHub token and cannot change the repository through this tool.
- Preserve the project's research-first policy: classical textual evidence, modern interpretations and empirical claims must remain clearly separated; unverified BCP/BSP rules must not become production predictions.
