# Flat Question Tags

## Decision

Use flat tags for MVP. A question can have many tags. Do not force teachers into a strict subject/topic tree yet.

## Why

Government-job preparation questions often belong to multiple useful categories at the same time: subject, topic, exam type, previous exam, year, post, institution, and source. A flat model is faster to operate and gives enough data for weak-zone reports.

## Tag Rules

- Use lowercase English slugs for system tags.
- Use hyphen between words, for example `general-knowledge`.
- Allow many tags per question.
- Store original metadata fields separately when available, such as exam year, post name, and institution.
- Allow Bangla question text and explanations; keep tags machine-friendly.

## Initial Subject Tags

- `bangla`
- `english`
- `math`
- `general-knowledge`
- `ict`

## Initial Topic Examples

- `grammar`
- `spelling`
- `vocabulary`
- `bangla-literature`
- `arithmetic`
- `algebra`
- `geometry`
- `constitution`
- `bangladesh-affairs`
- `international-affairs`
- `computer-basics`

## Exam And Source Examples

- `bcs`
- `bcs-15`
- `primary`
- `primary-2023`
- `health`
- `health-22`
- `bank-job`
- `ntrca`
- `previous-exam`
- `teacher-original`

## Import Format

In CSV import, tags are stored in one `tags` column separated by semicolon:

```csv
bangladesh-affairs;constitution;bcs-15;previous-exam
```
