# ADR 0009: Support Live Exam Window Plus Later Mock Attempts

## Status

Accepted

## Context

The desired exam model should mimic a real exam with a scheduled participation window, but students may also need to take the exam later as an online mock test.

## Decision

Support two participation modes:

- Live exam window: the scheduled time used for official participation and ranking.
- Mock attempt: later practice attempt allowed by the teacher after the live exam ends and result is released.

Teachers can enable or disable mock mode per exam.

## Consequences

Benefits:

- Preserves the motivational value of a real scheduled exam.
- Allows absent students to still practice.
- Increases long-term value of each exam after the live window ends.

Risks:

- Mixing late mock attempts into live ranking can make rank unfair.
- Students may delay participation if late attempts feel equivalent.

Guardrails:

- Keep live ranking separate from later mock/practice ranking.
- Show clear labels for live result versus mock attempt.
- Let teachers configure whether late attempts are allowed.
- Do not unlock mock attempts before result release.
