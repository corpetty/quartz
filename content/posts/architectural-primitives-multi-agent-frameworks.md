---
title: "Architectural Primitives of Multi-Agent Orchestration Frameworks"
date: 2026-04-15
description: "A primitive-level decomposition of the agentic framework landscape — what's converged, what's diverged, and what's still unsolved."
tags:
  - agents
  - ai
  - architecture
  - distributed-systems
  - openclaw
  - hermes
  - claude-code
  - mcp
draft: false
---

> The field has converged on a surprisingly small set of essential primitives: an LLM reasoning engine, a tool-calling interface, a while-loop executor, and a context window manager. Everything else — supervisor hierarchies, graph-based orchestration, role-based crews, swarm handoffs — constitutes orchestration topology choices built atop this irreducible core.

Across 12+ frameworks with independent development histories, the convergence on tool-calling as the fundamental action primitive, MCP as the standardization layer, and the ReAct loop as the canonical execution pattern provides strong evidence that these are the "true" primitives rather than historical accidents. The divergences — code-as-action vs. JSON tool calls, graph vs. conversation vs. SOP orchestration, centralized vs. decentralized coordination — reflect genuine design trade-offs that map directly to the expressiveness-vs-safety and determinism-vs-emergence axes familiar from distributed systems theory.

This analysis covers the three frameworks that have captured the current zeitgeist (OpenClaw at **138K stars**, Hermes Agent at **81K stars**, Claude Agent SDK/Code), contrasts them against eight secondary frameworks, and decomposes 16 architectural primitives across all of them.

---

## The three frameworks that actually won

### OpenClaw: the gateway-as-control-plane architecture

OpenClaw (formerly Moltbot → Clawdbot → OpenClaw) is a TypeScript/Node.js monorepo with **138K GitHub stars** and weekly releases. Its core architectural insight is radically different from Python-centric frameworks: **agents are config, not code**. An agent is defined by a `SOUL.md` markdown file (personality/instructions), a workspace (isolated filesystem), a model assignment, and plugin-provided capabilities — all declared in `openclaw.json`. There are no Python classes to subclass, no graph nodes to wire.

The **Gateway** is the control plane — a single WebSocket server (`ws://127.0.0.1:18789`) that mediates all interactions across 23+ messaging channels (WhatsApp, Telegram, Slack, Discord, Signal, Matrix, IRC, etc.). Message routing uses deterministic **binding rules** resolved by `(channel, accountId, peer/guild)` tuples — no LLM involvement in routing decisions. This is architecturally closer to a message broker or service mesh than a typical agent framework.

OpenClaw's **plugin system** is typed and versioned. Plugins declare an `openclaw.plugin.json` manifest and implement lifecycle hooks (`before_prompt_build`, `agent_end`, `agent:bootstrap`). Some categories are **exclusive slots** — only one memory plugin can be active at a time, preventing subsystem conflicts. The plugin SDK exposes subpaths for different concerns: `models-provider-runtime`, `skill-commands-runtime`, `reply-dispatch-runtime`. Security scanning via VirusTotal is built into the ClawHub skills marketplace (**5,400+ community skills**).

The **memory subsystem** implements a tiered architecture. The default `memory-core` uses SQLite with FTS5 full-text search, exposing a two-step `memory_search` → `memory_get` interface. The `memory-lancedb` plugin (the one relevant to a Qwen3-14B-AWQ + vLLM setup) uses LanceDB columnar storage with a simpler single-tool `memory_recall` interface. Its auto-recall flow embeds the user message, retrieves top-k memories (default 3, minimum 0.3 cosine similarity), and injects them into system prompt as `<relevant-memories>` context — explicitly marked as **untrusted data** with HTML-entity escaping as a prompt injection defense. The community `memory-lancedb-pro` extends this with hybrid retrieval: vector + BM25 → RRF fusion → Jina cross-encoder reranking → recency boost → importance weighting → MMR diversity filtering, with multi-scope isolation (`global`, `agent:<id>`, `project:<id>`).

Multi-agent coordination in OpenClaw follows four patterns: **sub-agent spawning** (`sessions_spawn` with `maxSpawnDepth: 1-2`, `maxConcurrent: 8`), **peer-to-peer messaging** (`agentToAgent` with configurable allow-lists), **addressable sessions** (`sessions_send` where the session key is the address), and the **Lobster** deterministic workflow engine (YAML-based with branching, loops, parallel branches, and explicit joins). The in-progress **Octopus** orchestrator proposes a "one head plans, many arms execute" model where any CLI agentic tool becomes a potential arm.

For model provider abstraction, OpenClaw ships **30+ providers** with vLLM as a first-class citizen (not just generic OpenAI-compatible). Configuration declares `api: "openai-completions"`, cost tracking per session, and provider-agnostic model profiles tagged with capabilities like `local`, `private`, `cheap`, `tool-reliable`, `vision`. Failover chains support `primary` + `fallbacks` with auth profile rotation.

### Hermes: the three-layer ecosystem from models to runtime

The Hermes ecosystem occupies a unique position spanning three architectural layers simultaneously: **models** (Hermes LLM family), **protocol** (Hermes function calling format), and **runtime** (Hermes Agent framework). Understanding this layering is critical.

**The Hermes function calling format** has become the de facto standard for local LLM tool use. Unlike OpenAI's structured API fields, Hermes encodes tool definitions and calls as **XML tags embedded in the text stream** — `<tools>`, `<tool_call>`, `<tool_response>`. This design decision is architecturally significant: because it works with any text-generation endpoint, it requires no API-level modifications. vLLM has a dedicated `Hermes2ProToolParser` that converts `<tool_call>` XML → OpenAI-compatible `tool_calls` response objects. **Qwen 2.5 and Qwen 3 adopted this format natively**, and it's supported in SGLang, llama.cpp, and LocalAI. The parallel tool call format uses separate `<tool_call>` tags per invocation rather than an array wrapper.

The **Hermes 3 model** (Llama 3.1 base, 8B/70B/405B variants) introduced special **agentic tokens** trained into the model: `<SCRATCHPAD>`, `<REASONING>`, `<INNER_MONOLOGUE>`, `<PLAN>`, `<EXECUTION>`, `<REFLECTION>`, `<THINKING>`, `<SOLUTION>`. These are not prompt-injected instructions — they are behaviors the model was trained to exhibit. **Hermes 4** (April 2026, Qwen 3.5 base, including a 35B-A3B MoE variant that runs on a single RTX 4090) was trained primarily on **real agentic traces** (~5M samples, ~60B tokens) rather than chat-shaped Q&A, and maintains tool-calling composure past 100+ steps where previous local models degraded by step 10-20.

**Hermes Agent** (81.3K stars, released February 2026) is the runtime layer. Its core is a synchronous orchestration engine (`AIAgent` in `run_agent.py`) implementing a **self-improving learning loop**: Execute → Evaluate → Extract → Refine → Retrieve. State is SQLite with FTS5 in WAL mode. Memory is four-layered: `MEMORY.md` (project context), `USER.md` (user model), Skills (procedural knowledge the agent has discovered), and session history (FTS5-indexed). The multi-agent system (v0.6.0) uses **hierarchical task decomposition** — an orchestrator analyzes tasks into a work breakdown structure, spawns specialist workers with **selective context sharing** (workers receive only task-relevant subsets), and workers exchange **typed result objects** (not natural language summaries). The project is actively evolving toward true multi-agent with DAG-based structured workflows and agent-to-agent communication channels.

### Claude Agent SDK: subagent isolation as the core design principle

The Claude Agent SDK packages Claude Code's agent loop as an embeddable Python/TypeScript library. Its architectural signature is **context isolation through subagent boundaries**. A subagent is an isolated Claude instance with its own context window (up to 200K tokens), custom system prompt, specific tool access, and independent permissions. The critical constraint: **subagents cannot spawn other subagents** — no recursive nesting. This is deliberate: it prevents uncontrolled resource consumption and keeps the architecture reasoned-about.

The communication pattern enforces strict isolation. The **only** parent→subagent channel is the `Agent` tool's `prompt` string. The subagent starts with a **fresh conversation** — it does not see the parent's turns. The only subagent→parent channel is the subagent's **final message**, returned verbatim as the tool result. All intermediate tool calls, file reads, and exploratory work stay inside the subagent's context. This means the parent's context grows only by the summary size, not the full subtask transcript — a critical property for long-horizon tasks.

The **Skills system** implements progressive disclosure across three levels. Level 1 loads YAML frontmatter (~100 tokens per skill) at startup for discovery. Level 2 loads the `SKILL.md` body (<5K tokens) only when a user request matches the skill description. Level 3 loads additional resources and executes scripts on demand, with only **output** entering context (never the script source). This is an elegant solution to the tool-explosion problem — many capabilities with minimal context cost.

Anthropic's published guidance codifies a clear taxonomy: **workflows** (predefined code paths) vs. **agents** (dynamic LLM-directed processes). Their five workflow patterns — prompt chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer — escalate in complexity. Their consistent advice: **"start with the simplest solution possible."** Framework warning: "They often create extra layers of abstraction that can obscure the underlying prompts and responses, making them harder to debug."

---

## Primitive-by-primitive decomposition

### What is an agent? Eight different answers

This is the most revealing architectural question. The answer varies dramatically and reflects each framework's computational metaphor:

- **OpenClaw**: An agent is a **composite config entity** — a `SOUL.md` + workspace + model assignment + memory scope + tool permissions + channel bindings. It is declared, not programmed.
- **Hermes Agent**: An agent is a **self-improving learning loop** — Execute → Evaluate → Extract → Refine → Retrieve. The agent accumulates Skills (procedural knowledge) over time.
- **Claude Agent SDK**: An agent is an **isolated LLM instance** with a context window, tools, and a system prompt. Subagents are ephemeral instances with strict communication boundaries.
- **LangGraph**: An agent is **emergent from graph topology** — a node (any Python function `(state) → state_update`) wired into a `StateGraph` with conditional edges. There is no `Agent` class.
- **CrewAI**: An agent is a **role-playing entity** with `role`, `goal`, `backstory` — the most anthropomorphic abstraction. Conceptualized as a team member.
- **AutoGen/AG2**: An agent is a **ConversableAgent** — a class that can send/receive messages. The conversation itself is the coordination mechanism.
- **MetaGPT**: An agent is a **Role** in an SOP — a Pydantic `BaseModel` with `name`, `profile`, `actions`, and subscription patterns. Produces structured artifacts (PRDs, system designs), not chat.
- **smolagents**: An agent is a **ReAct loop that generates Python code** — a `MultiStepAgent` that reasons, writes code, and executes it.
- **Pydantic AI**: An agent is a **typed generic container** — `Agent[DepsType, OutputType]` with dependency injection. Internally implemented as a graph.
- **OpenAI Agents SDK**: An agent is a **minimal config + Runner** — name, model, instructions, tools, handoffs. The `Runner` manages the execution loop.

The convergence is clear: an agent is always an **LLM + system prompt + tools + loop**. The divergence is in what additional structure wraps this core — config declarations (OpenClaw), learning loops (Hermes), role-play (CrewAI), graph nodes (LangGraph), typed containers (Pydantic AI), or minimal configs (Agents SDK).

### Tool registration and the function calling contract

Every framework has converged on tools defined by **name, description, and JSON schema parameters**. The registration patterns differ:

```python
# LangChain/LangGraph: decorator-based
@tool
def get_weather(location: str) -> str:
    """Get weather for a location."""
    return "72°F"

# Pydantic AI: decorator with typed context injection
@agent.tool
def get_weather(ctx: RunContext[MyDeps], location: str) -> str:
    """Get weather for a location."""
    return ctx.deps.weather_api.get(location)

# AutoGen: annotated types for inline documentation
@agent.register_for_llm(description="Get weather")
def get_weather(city: Annotated[str, "City name"]) -> str:
    return f"Weather for {city}: Sunny"
```

```typescript
// Mastra (TypeScript): Zod schemas
const getWeather = createTool({
  id: 'get-weather',
  inputSchema: z.object({ location: z.string() }),
  execute: async ({ context }) => ({ temp: 72 }),
});

// OpenClaw: declarative in plugin config, no code
// Tools defined in openclaw.plugin.json + TypeScript runtime module
```

The key divergence is **code-as-action** (smolagents, Claude Code) vs. **JSON tool calls** (everyone else). smolagents' `CodeAgent` generates executable Python instead of JSON:

```python
# JSON tool call (standard pattern):
{"tool": "search", "args": {"query": "latest papers"}}

# Code-as-action (smolagents):
results = search("latest papers")
for paper in results[:5]:
    details = get_paper_details(paper.id)
    summary = summarize(details.abstract)
final_answer(summaries)
```

The research paper "Executable Code Actions Elicit Better LLM Agents" found code agents use **~30% fewer LLM calls** because a single code block can chain multiple tool calls, use loops, and pass complex objects between calls. The trade-off is security: code execution requires robust sandboxing (E2B, Docker, WASM, or constrained interpreters).

### Memory subsystems: the five-tier hierarchy

Memory implementations span a spectrum from minimal to sophisticated. The emerging consensus is a **tiered architecture**:

**Tier 1 — Conversation history** (universal): Raw message list. Every framework implements this. The context window itself is the "memory." Growth is unbounded and creates the primary scaling challenge.

**Tier 2 — Working/structured memory** (Mastra, Hermes Agent, OpenClaw): Persistent structured data (user preferences, goals, key facts) injected into the system prompt. Mastra's implementation is the most sophisticated — background agents compress old messages into dense "observations" that replace raw history. OpenClaw's `USER.md` and `MEMORY.md` serve this function through markdown files.

**Tier 3 — Semantic/vector memory** (OpenClaw memory-lancedb, CrewAI, Mastra): Embedding-based retrieval of relevant past context. OpenClaw's auto-recall flow (embed query → top-k retrieval → inject as `<relevant-memories>`) and Mastra's cross-thread semantic recall both implement this. CrewAI uses ChromaDB.

**Tier 4 — Episodic/long-term memory** (Hermes Agent, CrewAI, MetaGPT): Persistent insights across sessions. Hermes' self-improving Skills represent procedural memory — learned multi-step workflows the agent discovered. MetaGPT stores executable feedback from previous projects. CrewAI's long-term memory uses SQLite3 for cross-execution knowledge.

**Tier 5 — Context compaction** (Claude Code, Mastra, OpenAI Agents SDK, Cognition/Devin): Active strategies to survive context limits. Claude Code uses summarize-and-reinitiate. Mastra's **observational memory** runs a background LLM (default: Gemini 2.5 Flash) to compress conversation into observations. OpenAI's `OpenAIResponsesCompactionSession` triggers compaction after 10 non-user items. Cognition uses a **fine-tuned summarization model** for context compression — their core thesis that single-threaded agents with good compression beat multi-agent systems.

**The critical gap**: No framework has solved the fundamental tension between context fidelity and context efficiency. Even with 1M token windows, Anthropic's research shows **context rot** — recall accuracy decreases as token count increases. The field needs memory primitives that are reliable, composable, and cost-efficient simultaneously.

### Context window management and the 67.6% problem

Braintrust's analysis reveals that in typical agent conversations, **tool responses consume 67.6% of total tokens** while system prompts account for just 3.4%. This means context engineering of tool outputs matters far more than prompt engineering. The strategies frameworks employ:

- **Sub-agent offloading** (Claude Code, OpenClaw): Delegate subtasks to isolated instances. The parent's context grows only by the summary, not the full transcript. This is the dominant production strategy.
- **Summarization/compaction** (Claude Code, Mastra, OpenAI Agents SDK): Periodically summarize conversation history and reinitiate with compressed context + recent messages. Anthropic's guidance: summarize context nearing limits, reinitiate with compressed summary plus the most recent files.
- **External scratchpads** (OpenClaw workspaces, Hermes MEMORY.md): Offload persistent state to filesystem. The agent reads back specific files when needed rather than keeping everything in context.
- **Selective tool exposure** (Claude Skills progressive disclosure, Pydantic AI dynamic toolsets): Only load tool definitions when they're likely to be used. Claude Skills loads metadata (~100 tokens) at startup and full instructions (<5K) on trigger.
- **Hierarchical memory** (OpenClaw memory-lancedb auto-recall): Only inject memories above a similarity threshold (0.3 cosine), limiting memory-sourced tokens to the most relevant few.

### Planning and decomposition patterns

Five distinct planning architectures have emerged:

**ReAct loops** (universal): The dominant pattern. Reason → Act → Observe → repeat. Every framework implements this as the base execution loop. Harrison Chase's observation: "The algorithm of just running the LLM in a loop and letting it orchestrate — that is so simple and so general purpose."

**Plan-and-execute** (LangGraph, CrewAI): Separate planner generates a task list, then an executor works through it. CrewAI's `Crew(planning=True)` uses a dedicated planner LLM. LangGraph supports this via separate planner/executor subgraphs.

**SOP/assembly-line** (MetaGPT): The plan IS the human workflow encoded as software process. ProductManager → Architect → ProjectManager → Engineer → QA. No LLM-generated plans — the structure is predefined, the LLM fills in the content.

**Hierarchical task decomposition** (Hermes Agent, Claude Code): An orchestrator analyzes the task, generates a work breakdown structure, and spawns specialist workers. Hermes' workers receive only task-relevant context subsets and exchange typed result objects.

**Emergent from conversation** (AutoGen/AG2): No explicit planner — planning happens through agent dialogue. Agents debate, critique, and iterate. This is the most "emergent" approach but also the least predictable.

The trend is clear: **planning is migrating from framework scaffolding into the model itself**. Chase's "scaffolds to harnesses" observation captures this — as models improve at multi-step reasoning, explicit planning infrastructure becomes less necessary.

### Inter-agent communication: five topological patterns

**Shared state with reducers** (LangGraph): The central innovation. A typed `StateGraph` with `Annotated` fields specifying how concurrent updates merge (e.g., `add_messages` appends). This is Redux-inspired and provides the strongest guarantees about state consistency. Analogous to CRDT-based shared memory in distributed systems.

**Publish-subscribe message pools** (MetaGPT, OpenClaw): Agents publish messages/artifacts to a shared environment; other agents subscribe to specific types via `_watch()` patterns. MetaGPT uses this for document-oriented communication (PRDs, designs, code). OpenClaw's `agentToAgent` enables configurable peer communication with allow-lists.

**Direct handoffs** (OpenAI Agents SDK, Swarm): The active agent transfers complete control to another agent. The new agent receives conversation history (optionally filtered) and becomes the sole responder. Conceptually clean for customer service flows but creates linear, non-concurrent execution.

**Supervisor delegation** (Claude Code, Hermes Agent, CrewAI hierarchical): A central orchestrator delegates tasks to workers and aggregates results. The dominant production pattern. Claude Code enforces strict isolation — subagents start fresh with no parent context.

**Addressable sessions** (OpenClaw): Session keys function as addresses (`agent:<agentId>:<key>`). Agents send messages to specific sessions via `sessions_send`, enabling fire-and-forget or synchronous patterns without service discovery overhead.

### Orchestration topology: the design space

| Topology | Framework | Strengths | Failure mode |
|----------|-----------|-----------|--------------|
| **Graph/DAG with cycles** | LangGraph | Maximum control, checkpointing, time-travel | Graph rigidity, state explosion |
| **Supervisor/hierarchical** | Claude Code, Hermes Agent | Context isolation, predictable | Supervisor bottleneck, compression loss |
| **Handoff/swarm** | OpenAI Agents SDK | Lightweight, composable | No parallelism, linear execution |
| **Conversation-based** | AutoGen/AG2 | Natural for debate/review | Echo chambers, combinatorial explosion |
| **SOP/assembly-line** | MetaGPT | Structured artifacts combat hallucination | Rigid, hard to generalize beyond software dev |
| **Flow + Crew** | CrewAI | Deterministic backbone + autonomous teams | Limited complex state management |
| **Gateway routing** | OpenClaw | Channel-native, deterministic routing | Gateway is single point of failure |
| **Config-driven pipeline** | OpenClaw Lobster | Restart-safe, YAML-declarative | Less dynamic than LLM-driven orchestration |

### State management and checkpointing

**LangGraph** has the most mature state management — checkpoint per superstep with backends (SQLite, Postgres, in-memory), **time-travel debugging** (replay from any checkpoint, fork alternate trajectories via `update_state()`), and durable execution that survives process crashes. This is the only framework where you can branch execution from any historical point.

**OpenAI Agents SDK** added Temporal integration (GA March 2026) for durable execution in production workflows. Sessions with multiple backends (SQLite, Redis, SQLAlchemy, Dapr, encrypted) provide persistence.

**OpenClaw** achieves durability through the Lobster workflow engine (restart-safe run state) and session persistence under `~/.openclaw/agents/<agentId>/sessions`. The gateway architecture means state is centralized and recoverable.

**Most frameworks lack production-grade state management.** CrewAI has limited checkpointing. AutoGen/AG2 relies on in-memory conversation history. MetaGPT uses artifact-based forward flow. smolagents has step-based logs with manual management. This is a major gap for production deployment.

### MCP: the universal connector that actually shipped

The **Model Context Protocol** defines three server primitives: **Tools** (executable functions), **Resources** (data sources), and **Prompts** (reusable templates). Two client primitives: **Sampling** (server requests LLM completions from host) and **Elicitation** (server requests user input). Transport over JSON-RPC 2.0 via stdio (local) or Streamable HTTP (remote, with OAuth 2.1).

Adoption as of 2026: **10,000+ active public MCP servers**, 97M+ monthly SDK downloads. Adopted by OpenAI, Google DeepMind, Anthropic, Zed, Sourcegraph, Replit, VS Code. Donated to the Linux Foundation's Agentic AI Foundation in December 2025.

Integration depth varies: Claude Agent SDK treats MCP tools identically to native tools (`mcp__<server>__<tool>` namespacing). CrewAI supports bidirectional MCP — both consuming and exposing as MCP servers. Pydantic AI offers `MCPServer` and `FastMCPToolset`. OpenClaw integrates via plugins. smolagents supports MCP client. **MetaGPT notably lacks native MCP integration.**

For the Logos stack context: MCP's transport abstraction (stdio for local, HTTP/SSE for remote) maps naturally to a distributed system where agents may run on different nodes. The protocol's JSON-RPC 2.0 foundation is lightweight enough for P2P messaging layers. However, MCP currently assumes trust between client and server — it has no built-in authentication beyond OAuth for remote servers, and security analyses have identified prompt injection, tool permission escalation, and lookalike tool attacks as real vulnerabilities.

### Safety, sandboxing, and the execution boundary

The frameworks diverge sharply on execution safety:

- **Claude Code/Agent SDK**: Docker, gVisor, Firecracker sandboxing. Network control via `allowedDomains` whitelist. Git worktree isolation for subagents. Permission modes (`default`, `acceptEdits`, `bypassPermissions`, `plan`).
- **smolagents**: Multiple sandbox options (E2B cloud, Docker, Modal, Pyodide+Deno WASM, local constrained interpreter). Local execution is explicitly "not a security boundary."
- **OpenClaw**: Built-in dangerous-code scanner, VirusTotal partnership for ClawHub skills, workspace isolation per agent, approval hooks for exec commands, `before_install` policy blocks.
- **OpenAI Agents SDK**: Guardrails running **in parallel** with agent execution — input/output validation that fail-fast on violations. This is unique and architecturally elegant.
- **LangGraph**: No built-in sandboxing — delegates to deployment infrastructure. Tool execution happens in the host process.

---

## Extensibility patterns that proved valuable

### Plugin contracts and extension surfaces

The frameworks that achieved the most extensibility follow three distinct patterns:

**Lifecycle hooks** (OpenClaw, Claude Agent SDK): The most production-proven pattern. OpenClaw's plugin hooks fire at `before_prompt_build`, `agent_end`, `agent:bootstrap`, `command:new/reset`. Claude's hooks system has 18 event types (`PreToolUse`, `PostToolUse`, `PostToolUseFailure`, etc.) with typed inputs and control objects that can block operations, inject messages, or force stops. Hooks are **interceptors**, not extensions — they modify behavior at well-defined points without changing the core loop.

**Typed plugin SDK** (OpenClaw): Plugins declare `openclaw.plugin.json` manifests and implement TypeScript modules against a versioned SDK (`v2026.4.9`). The exclusive slot system (only one memory plugin active) prevents conflicts. Discovery follows a priority chain: config paths → workspace extensions → global extensions → bundled plugins. This is the most rigorous plugin contract among the frameworks surveyed.

**Capability composition** (Pydantic AI, Claude Skills): Pydantic AI's **Capabilities** bundle tools + hooks + instructions + model settings into reusable units (`WebSearch`, `Thinking`, `MCP`). Claude's Skills package instructions + metadata + resources with progressive disclosure. Both solve the same problem — how to add cross-cutting concerns without monolithic system prompts — but through different mechanisms (programmatic composition vs. filesystem-based packaging).

### Model provider abstraction

The dominant pattern is **adapter-based**: LangChain's `init_chat_model()`, CrewAI's LiteLLM (100+ providers), Mastra's Vercel AI SDK (40+ providers), AutoGen's ~60 optional provider packages. OpenClaw ships 30+ native providers including first-class vLLM support with auto-discovery. Pydantic AI supports virtually every provider with straightforward custom adapter creation.

The Hermes function calling format represents a different kind of abstraction — it normalizes tool calling at the **text-generation level** rather than the API level, enabling any model served by any backend to support structured tool use. This is architecturally significant for local LLM deployments where API standardization is incomplete.

### Transport and I/O abstraction

OpenClaw's **23+ channel adapters** (WhatsApp, Telegram, Slack, Discord, Signal, Matrix, IRC, LINE, WeChat, etc.) represent the most extensive transport abstraction. Its Gateway architecture naturally separates I/O transport from agent logic. MCP's transport layer (stdio for local, Streamable HTTP for remote) provides a second standardization surface. Most other frameworks assume HTTP/REST or direct Python invocation, leaving transport to the deployment layer.

---

## Efficiency patterns across the field

### Parallelization strategies

**LangGraph**: `Send()` API for scatter-gather parallelism. Parallel supersteps with reducer-based state merging. The most sophisticated parallel execution model.

**Hermes Agent**: First-class parallel worker spawning with resource-aware scheduling and configurable concurrency limits.

**Claude Code/Agent SDK**: Background subagents via `run_in_background: true`. Multiple subagents execute concurrently. But subagents cannot spawn further subagents, limiting parallelism depth.

**OpenAI Agents SDK**: Guardrails run in parallel with agent execution — zero additional latency for passing inputs. Agents-as-tools enable concurrent sub-agent invocations.

**smolagents**: `max_tool_threads` for parallel tool execution within a single code block.

### Token efficiency techniques

The most impactful techniques in production, ranked by token savings:

1. **Sub-agent isolation** (Claude Code): Parent context grows by summary size, not full transcript. For tasks touching >3 files, this can reduce parent context by 10-50x.
2. **Code-as-action** (smolagents): ~30% fewer LLM calls. A single code block replaces multiple sequential JSON tool calls.
3. **Observational memory** (Mastra): Background LLM compresses conversation into observations, replacing raw history.
4. **Progressive skill disclosure** (Claude Skills): ~100 tokens per skill at startup vs. <5K when triggered.
5. **Selective tool exposure** (Pydantic AI dynamic toolsets): Only present tools relevant to the current context.
6. **Prompt caching** (OpenClaw dialect-aware: OpenAI, Anthropic, Gemini caching hints): Reuse cached prefixes across requests.
7. **Session compaction** (OpenAI Agents SDK): Automatic summarization via Responses API after threshold.

### Caching and latency

Prompt caching (Anthropic's cached prefixes, OpenAI's prompt caching) is the highest-impact latency optimization. OpenClaw supports dialect-aware caching hints across providers. KV cache reuse at the inference server level (vLLM, SGLang) provides additional speedup for local deployments. Result caching of deterministic tool outputs is framework-agnostic and underutilized.

---

## Convergences that reveal essential primitives

### The while loop is the universal primitive

Braintrust's analysis crystallizes it: many of the most popular and successful agents — including Claude Code and the OpenAI Agents SDK — share a common, straightforward architecture: **a while loop that makes tool calls.** This pattern wins for the same reason as UNIX pipes — it's simple, composable, and flexible enough to handle complexity without becoming complex itself. The canonical implementation:

```python
while not done:
    response = call_llm(messages)
    if response.has_tool_calls:
        results = execute_tools(response.tool_calls)
        messages.append(tool_results)
    else:
        return response.text
```

Every framework is, at its core, an elaboration of this loop with different policies for state management, error handling, and multi-agent coordination.

### MCP as the USB-C of agent integrations

MCP solved the N×M integration problem. Before MCP, every framework needed custom integrations for every tool provider. Now, a single MCP server implementation works across Claude, OpenAI, LangChain, Pydantic AI, CrewAI, and more. The remaining gaps are security (prompt injection, tool permission escalation), governance (no standard for capability negotiation), and performance (context window constraints with many connected servers).

### Co-evolutionary convergence on ReAct

Letta's insight is critical: as models become more heavily post-trained on agentic patterns, agent architectures benefit from converging to match these patterns — staying "in-distribution" relative to the data the LLM was trained on. The frameworks and models are co-evolving: frameworks converge on ReAct because models are trained on it, and models are trained on it because frameworks produce that training data. This creates path dependence — the ReAct loop is now an **attractor state** in the design space.

### The supervisor pattern won (with caveats)

Despite the appeal of fully decentralized swarm coordination, every production system that achieves reliability uses some form of centralized orchestration. Anthropic's multi-agent research system uses a lead orchestrator. Claude Code uses single-level subagent delegation. Hermes Agent uses hierarchical task decomposition. OpenClaw's Octopus proposes "one head plans, many arms execute." Even OpenAI's Agents SDK, which inherited Swarm's peer handoff model, is most commonly deployed with a triage agent routing to specialists — a de facto supervisor.

DeepMind's "Scaling Laws of Agency" research found centralized MAS with a lower-capability orchestrator + high-capability sub-agents can **outperform homogeneous high-capability teams by 31%**. The supervisor pattern is not just practical — it's empirically superior for many task types.

---

## The divergences that matter

### Code-as-action vs. JSON: expressiveness vs. safety

This is the most fundamental architectural divergence in the field. smolagents' code agents achieve 30% fewer steps and enable compositional actions (loops, conditionals, variable assignment) impossible in flat JSON. Claude Code generates and executes code as its primary action mode. But JSON tool calls are universal, predictable, and require no sandboxing infrastructure. **This tension maps directly to the expressiveness-vs-safety trade-off in smart contract design** — Turing-complete execution (Solidity) vs. constrained scripting (Bitcoin Script). The right answer depends on trust assumptions about the execution environment.

### Configuration vs. code: two agent definition philosophies

OpenClaw's config-first approach (JSON + Markdown, no programming required) stands in sharp contrast to LangGraph's code-first approach (Python functions, graph construction, reducer definitions). CrewAI, Pydantic AI, and smolagents also require code. The config-first approach dramatically lowers the barrier to entry (OpenClaw has 135K+ active instances) but trades away fine-grained control. For a framework targeting the Logos stack, this axis deserves careful consideration — configuration-driven systems compose more naturally with declarative protocol specifications, while code-driven systems offer more flexibility for novel coordination patterns.

---

## Failure modes and what the critics get right

### The compound reliability problem

Even at 95% per-step accuracy, a 20-step workflow yields only **36% overall success** (0.95^20 ≈ 0.36). The MAST study (Cemri et al., March 2025) analyzed 1,642 execution traces across 7 frameworks and found that coordination gains plateau beyond 4 agents, with each additional agent adding more coordination overhead than task-solving capacity. Error cascading is the dominant failure mode — a routing misclassification propagates through downstream agents, each compounding the error.

### The multi-agent debate: Cognition vs. Anthropic

On June 12, 2025, Cognition published "Don't Build Multi-Agents," arguing that context sharing and implicit decision conflicts make multi-agent systems fundamentally unreliable. Their solution: single-threaded linear agents with a fine-tuned context compression model. The next day, Anthropic published results showing their multi-agent research system achieved **90.2% performance improvement** on breadth-first research tasks.

The resolution is that **"multi-agent" and "single-agent" are orchestration choices, not fundamental technology differences**. Both are compound AI systems built on the same core: reasoning models, prompts, tools, and memory. Cognition's real critique is about implicit decision conflicts when agents don't share full context — a coordination problem, not an architecture problem.

### The over-engineering critique

A consistent practitioner criticism: frameworks add unnecessary abstraction layers. As one developer summarized: in 2023, building an agent was simple — a `while True` loop in Python, a list called messages, and the OpenAI API. Now we're drowning in frameworks. Harrison Chase himself acknowledged this shift: the algorithm of just running the LLM in a loop is so simple and so general purpose that it was the core idea of agents all along.

The counter-argument: production systems need state management, error handling, observability, human-in-the-loop gates, and durable execution that a bare while loop doesn't provide. The sweet spot is frameworks that add these production concerns without obscuring the underlying loop.

### Cost explosion is the practical ceiling

Anthropic's whitepaper states multi-agent systems use roughly **10-15x more tokens than single agents**. AutoGen's conversational patterns generate 20+ LLM calls per task. A documented case showed an agent spending **$847 in API costs** on a single ambiguous customer support ticket. Cost-per-task (not cost-per-token) is the real constraint. This creates natural selection pressure toward architectures that minimize LLM calls — code-as-action, aggressive caching, and local model deployment (as with the Qwen3-14B-AWQ + vLLM setup).

---

## Open problems and unsolved primitives

### Reliable long-horizon planning remains unsolved

Current agents work for short-horizon tasks (coding a function, answering a question) but degrade on multi-hour, multi-day tasks. The compound reliability problem (0.95^n) means that without near-perfect per-step accuracy, long-horizon agents fail more often than they succeed. No framework has a robust solution — the best approaches (Claude Code's subagent isolation, Cognition's context compression) are mitigations, not solutions.

### Agent-to-agent trust has no cryptographic equivalent

Google's A2A protocol and MCP enable agents to communicate and share tools, but neither provides mechanisms for **verifying that an agent's output is trustworthy**. This maps directly to the oracle problem in blockchain: how do you verify that an external input from another agent is reliable? Cognition's observation captures it: nobody is putting dedicated effort into solving the cross-agent context-passing problem. **This is arguably the highest-value unsolved primitive for a framework built on blockchain infrastructure** — cryptographic attestation of agent outputs, verifiable execution traces, and stake-based trust scoring are all natural extensions of blockchain consensus mechanisms.

### Persistent agent memory that actually works

No framework has solved the fundamental tension between context fidelity and context efficiency. Vector-based retrieval loses structure. Summarization loses detail. Full history exhausts context windows. The field needs composable memory primitives that support different fidelity levels with explicit trade-off controls. OpenClaw's tiered memory architecture and Mastra's observational memory are the most promising approaches, but both rely on embedding quality and LLM summarization quality as fragile dependencies.

### Evaluation and benchmarking for agent systems

Anthropic's engineering team notes that agents operate over many turns — calling tools, modifying state, and adapting based on intermediate results. The same capabilities that make AI agents useful (autonomy, intelligence, flexibility) also make them harder to evaluate. Current benchmarks (SWE-Bench, GAIA, WebArena) test narrow capabilities. No benchmark captures the full complexity of multi-agent coordination, long-horizon planning, and real-world tool use simultaneously.

### Composability of agent skills

MCP solves tool composability. **Skill composability remains unsolved.** How do you compose an agent that can research + code + deploy without a monolithic 2,000-line system prompt (as Claude Code currently uses, per Harrison Chase's November 2025 keynote)? Claude's Skills system and OpenClaw's ClawHub marketplace are attempting this through progressive disclosure and marketplace curation, but the composition semantics — how skills interact, override, or conflict — are ad hoc.

### Safety at the system level

OWASP found prompt injection in 73% of assessed production LLM deployments. In multi-agent systems, one compromised agent can propagate malicious instructions to every downstream agent. OpenClaw's approach of marking recalled memories as "untrusted" with HTML-entity escaping is a practical defense, but the field lacks principled security models for multi-agent systems. **Sandboxing solves execution safety but not reasoning safety** — an agent can be tricked into making harmful decisions even within a sandbox.

---

## What the convergence evidence tells us about essential vs. contingent primitives

### Primitives that are essential (convergent across all frameworks)

1. **The LLM call** — the reasoning engine
2. **Tool-calling with JSON schemas** — the action interface
3. **The ReAct loop** — the execution heartbeat
4. **Conversation history as context** — the working memory
5. **Stopping conditions** — iteration limits, cost caps, success criteria
6. **System prompt as agent definition** — the personality/instruction surface

### Primitives that appear essential but may be emergent properties

- **Planning**: Currently scaffolded in frameworks but migrating into models as they improve at multi-step reasoning. May become an inference-time capability rather than a framework primitive.
- **Long-term memory**: Currently external (vector stores, databases) but may be absorbed by expanding context windows or model-native memory mechanisms.
- **Multi-agent coordination**: May be a scaling pattern rather than a primitive — analogous to how multi-threading is a pattern built on single-threaded execution, not a new computational primitive.

### Primitives that are contingent historical accidents

- **Role-playing agent definitions** (CrewAI's `backstory`): Anthropomorphism that helps with prompt engineering but isn't architecturally necessary.
- **Graph-based topology** (LangGraph): Powerful for complex state machines but not the only valid orchestration model. The graph is an implementation choice, not a primitive.
- **SOP-encoded workflows** (MetaGPT): Domain-specific to software engineering. The SOP is content, not infrastructure.
- **Handoff-as-primitive** (OpenAI Agents SDK): A useful abstraction for customer service flows but not generalizable to all coordination patterns.

### Extension surfaces that proved most valuable in practice

1. **MCP** — the clear winner for tool/data extensibility. Universal adoption, standard protocol, composable servers.
2. **Lifecycle hooks** (OpenClaw, Claude SDK) — the most practical way to modify agent behavior without forking the framework.
3. **Plugin slot systems** (OpenClaw) — exclusive slots prevent conflicts while enabling swappable subsystems.
4. **Skills/capability packaging** (Claude Skills, OpenClaw ClawHub, Hermes Agent Skills) — the emerging pattern for reusable, composable agent capabilities.
5. **Model provider adapters** (universal) — the abstraction that enables framework survival across model generations.

### The physics analogy

The agent framework field is experiencing what physics encountered with renormalization: apparently complex phenomena reduce to simpler underlying interactions at the right energy scale. The "while loop with tools" is the ground state. Supervisor hierarchies, graph orchestration, role-based crews, and swarm handoffs are excited states — useful for specific applications but not fundamental. The key open question for framework design is: **what is the minimal set of primitives that makes the ground state composable into any excited state the application requires?**

For a framework targeting the Logos stack, the answer likely involves: the ReAct loop as the core executor, MCP-compatible tool interfaces as the action layer, a tiered memory system with explicit fidelity controls, blockchain-verifiable execution traces as the trust layer, P2P messaging as the transport for inter-agent communication, and content-addressed storage for durable agent state — but that synthesis is for the next conversation.

---

## Sources

### OpenClaw

- OpenClaw repository — <https://github.com/openclaw/openclaw>
- OpenClaw documentation: Plugins — <https://docs.openclaw.ai/tools/plugin>
- OpenClaw documentation: vLLM provider — <https://docs.openclaw.ai/providers/vllm>
- OpenClaw documentation: Multi-Agent Routing — <https://docs.openclaw.ai/concepts/multi-agent>
- Octopus Orchestrator proposal (Issue #64435) — <https://github.com/openclaw/openclaw/issues/64435>
- LumaDock: OpenClaw multi-agent coordination, patterns and governance — <https://lumadock.com/tutorials/openclaw-multi-agent-coordination-governance>
- mergisi/awesome-openclaw-agents (162 production templates) — <https://github.com/mergisi/awesome-openclaw-agents>
- VoltAgent/awesome-openclaw-skills (5,400+ skills) — <https://github.com/VoltAgent/awesome-openclaw-skills>
- goldmar/openclaw-code-agent — <https://github.com/goldmar/openclaw-code-agent>
- clawdotnet/openclaw.net (.NET runtime) — <https://github.com/clawdotnet/openclaw.net>
- noncelogic/openclaw-memory-lancedb — <https://github.com/noncelogic/openclaw-memory-lancedb>
- McBorisson/OpenClaw-memory-lancedb-pro — <https://github.com/McBorisson/OpenClaw-memory-lancedb-pro>
- LanceDB blog: Memory for OpenClaw — <https://www.lancedb.com/blog/openclaw-memory-from-zero-to-lancedb-pro>
- DEV: Deterministic multi-agent dev pipeline inside OpenClaw — <https://dev.to/ggondim/how-i-built-a-deterministic-multi-agent-dev-pipeline-inside-openclaw-and-contributed-a-missing-4ool>
- Medium (Yin & Yang): The Quiet Shift in AI Agents: Why Hermes Is Gaining Ground Beyond OpenClaw — <https://medium.com/@kunwarmahen/the-quiet-shift-in-ai-agents-why-hermes-is-gaining-ground-beyond-openclaw-6364df765d3a>

### Hermes (model, format, and runtime)

- Hermes Agent landing — <https://hermesagent.agency/>
- Hermes Agent v0.6.0 multi-agent docs — <https://hermes-agent.ai/features/multi-agent>
- Hermes Agent docs (Nous Research) — <https://hermes-agent.nousresearch.com/docs/>
- DEV: Hermes Agent: A Self-Improving AI Agent That Runs Anywhere — <https://dev.to/arshtechpro/hermes-agent-a-self-improving-ai-agent-that-runs-anywhere-2b7d>
- Substack: Inside Hermes Agent — <https://mranand.substack.com/p/inside-hermes-agent-how-a-self-improving>
- YUV.AI: Hermes Agent — Self-Improving AI with Persistent Memory — <https://yuv.ai/blog/hermes-agent>
- OPC Community: Hermes Agent in 2026 — <https://www.opc.community/blog/hermes-agent-open-source-ai-agent-2026>
- PopularAITools: Hermes 4 local agent model — <https://popularaitools.ai/blog/hermes-4-local-agent-model-2026>
- Medium (Ritvik Rastogi): Papers Explained 188 — Hermes 3 — <https://ritvik19.medium.com/papers-explained-188-hermes-3-67d36cfe07d8>
- Qwen function calling docs (Hermes format) — <https://qwen.readthedocs.io/en/latest/framework/function_call.html>

### Claude Code & Claude Agent SDK

- Anthropic: Building Effective AI Agents — <https://www.anthropic.com/research/building-effective-agents>
- Anthropic Engineering: Effective context engineering for AI agents — <https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents>
- Claude Code: Create custom subagents — <https://code.claude.com/docs/en/sub-agents>
- Claude Agent SDK: Subagents — <https://platform.claude.com/docs/en/agent-sdk/subagents>
- Claude Agent SDK: Hosting — <https://platform.claude.com/docs/en/agent-sdk/hosting>
- Claude Agent SDK: How the agent loop works — <https://platform.claude.com/docs/en/agent-sdk/agent-loop>
- Claude Agent SDK: Migrating from the OpenAI Agents SDK — <https://platform.claude.com/cookbook/claude-agent-sdk-04-migrating-from-openai-agents-sdk>
- Claude Agent Skills overview — <https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview>
- ksred: Claude Code Agents & Subagents: What They Actually Unlock — <https://www.ksred.com/claude-code-agents-and-subagents-what-they-actually-unlock/>
- Let's Data Science: Build Production AI Agents with Claude Agent SDK — <https://letsdatascience.com/blog/claude-agent-sdk-tutorial>
- Jidong Lab: Claude Agent SDK Deep Dive — <https://jidonglab.com/blog/claude-agent-sdk-deep-dive-en/>
- Promptfoo: Claude Agent SDK — <https://www.promptfoo.dev/docs/providers/claude-agent-sdk/>

### LangGraph & LangChain

- LangChain: Agents (oss/python) — <https://docs.langchain.com/oss/python/langchain/agents>
- LangGraph overview — <https://docs.langchain.com/oss/python/langgraph/overview>
- LangGraph checkpoints reference — <https://reference.langchain.com/python/langgraph/checkpoints>
- Sequoia podcast with Harrison Chase: Context Engineering Long-Horizon Agents — <https://sequoiacap.com/podcast/context-engineering-our-way-to-long-horizon-agents-langchains-harrison-chase/>
- Tech Insider: How to Build an AI Agent with LangGraph Python (2026) — <https://tech-insider.org/langgraph-tutorial-ai-agent-python-2026/>

### CrewAI, AutoGen/AG2, MetaGPT

- CrewAI Agents docs — <https://docs.crewai.com/core-concepts/Agents/>
- CrewAI Introduction — <https://docs.crewai.com/en/introduction>
- sparkco: Deep Dive into CrewAI Memory Systems — <https://sparkco.ai/blog/deep-dive-into-crewai-memory-systems>
- AutoGen (arXiv 2308.08155) — <https://arxiv.org/abs/2308.08155>
- AG2 (formerly AutoGen) repository — <https://github.com/ag2ai/ag2>
- Medium (Tahir): Building Multi-Agent Healthcare Chatbots with AG2 — <https://medium.com/@tahirbalarabe2/building-multi-agent-healthcare-chatbots-with-ag2-autogen-d5d3fd923f80>
- MetaGPT (arXiv 2308.00352) — <https://arxiv.org/abs/2308.00352>
- MetaGPT (HTML, v6) — <https://arxiv.org/html/2308.00352v6>
- MetaGPT on OpenReview — <https://openreview.net/forum?id=VtmBAGCN7o>
- AI-SCHOLAR: MetaGPT overview — <https://ai-scholar.tech/en/articles/agent-simulation/meta-gpt>

### smolagents, Pydantic AI, OpenAI Agents SDK, Mastra

- smolagents repository — <https://github.com/huggingface/smolagents>
- HuggingFace blog: Introducing smolagents — <https://huggingface.co/blog/smolagents>
- HuggingFace blog: Building Effective Agents with Anthropic's Best Practices and smolagents — <https://huggingface.co/blog/Sri-Vigneshwar-DJ/building-effective-agents-with-anthropics-best-pra>
- HuggingFace docs: Manage your agent's memory (smolagents) — <https://huggingface.co/docs/smolagents/en/tutorials/memory>
- Medium (Isaac Kargar): Exploring the smolagents Library — <https://kargarisaac.medium.com/exploring-the-smolagents-library-a-deep-dive-into-multistepagent-codeagent-and-toolcallingagent-03482a6ea18c>
- Morph: Smolagents — HuggingFace's 1,000-Line Agent Framework — <https://www.morphllm.com/smolagents>
- Pydantic AI: Toolsets — <https://ai.pydantic.dev/toolsets/>
- Pydantic AI: Capabilities — <https://ai.pydantic.dev/capabilities/>
- Pydantic Docs: Toolsets — <https://pydantic.dev/docs/ai/tools-toolsets/toolsets/>
- OpenAI Agents SDK (Python) — <https://openai.github.io/openai-agents-python/>
- OpenAI Agents SDK: Sessions (Python) — <https://openai.github.io/openai-agents-python/sessions/>
- OpenAI Agents SDK: Sessions (JS) — <https://openai.github.io/openai-agents-js/guides/sessions/>
- Temporal: Production-ready agents with the OpenAI Agents SDK + Temporal — <https://temporal.io/blog/announcing-openai-agents-sdk-integration>
- Mastra: Configuration — <https://mastra.ai/reference/configuration/llms.txt>
- Mastra: Agent memory — <https://mastra.ai/docs/agents/agent-memory>

### Model Context Protocol (MCP)

- MCP Architecture overview — <https://modelcontextprotocol.io/docs/learn/architecture>
- Model Context Protocol GitHub org — <https://github.com/modelcontextprotocol>
- CodiLime: MCP explained — <https://codilime.com/blog/model-context-protocol-explained/>
- Google Cloud: What is Model Context Protocol — <https://cloud.google.com/discover/what-is-model-context-protocol>
- Gupta Deepak: MCP enterprise adoption guide — <https://guptadeepak.com/the-complete-guide-to-model-context-protocol-mcp-enterprise-adoption-market-trends-and-implementation-strategies/>

### Critiques, comparisons, and field overviews

- Cognition: Don't Build Multi-Agents — <https://cognition.ai/blog/dont-build-multi-agents>
- Oracle Developers: What Is the AI Agent Loop? — <https://blogs.oracle.com/developers/what-is-the-ai-agent-loop-the-core-architecture-behind-autonomous-ai-systems>
- APXML: The ReAct Pattern for Reasoning and Acting — <https://apxml.com/courses/getting-started-with-llm-toolkit/chapter-8-developing-autonomous-agents/react-pattern-for-agents>
- o-mega: LangGraph vs CrewAI vs AutoGen — Top 10 AI Agent Frameworks — <https://o-mega.ai/articles/langgraph-vs-crewai-vs-autogen-top-10-agent-frameworks-2026>
- GuruSup: Best Multi-Agent Frameworks in 2026 — <https://gurusup.com/blog/best-multi-agent-frameworks-2026>
- StackOne: 120+ Agentic AI Tools Mapped Across 11 Categories — <https://www.stackone.com/blog/ai-agent-tools-landscape-2026/>
- Chanl: AI Agent Frameworks Compared — Which Ones Ship? — <https://www.channel.tel/blog/ai-agent-frameworks-compared-2026-what-ships>
