# Stillwater Security Specification

## Data Invariants
1. A user can only read and write to documents under the `/users/$(request.auth.uid)` path.
2. Every document must contain a `userId` field that matches the `request.auth.uid` (except for the user profile itself which is indexed by UID).
3. Timestamps like `createdAt` and `timestamp` must be validated against `request.time`.
4. String lengths must be bounded to prevent resource exhaustion.

## The "Dirty Dozen" Payloads (Denial Tests)
1. **Identity Theft**: Try to write to `/users/attackerId/mood_logs/doc1` with `userId = 'attackerId'` while authenticated as `victimId`.
2. **ID Poisoning**: Use a 2KB string as a `{routineId}`.
3. **Ghost Fields**: Add `isAdmin: true` to a `User` profile update.
4. **State Shortcut**: Try to update `createdAt` on an existing `JournalEntry`.
5. **PII Leak**: Try to list `/users` collection without a specific UID filter.
6. **Type Poisoning**: Send `intensity: "very high"` (string) instead of a number.
7. **Size Attack**: Post a 1MB string in the `note` field of `MoodLog`.
8. **Orphaned Writes**: Try to create a `RoutineTask` for a `routineId` that doesn't exist.
9. **Role Escalation**: Try to update `email` of another user.
10. **Time Spoofing**: Provide a `timestamp` from 1999.
11. **Negative Intensity**: Set mood `intensity` to -500.
12. **Blanket Read**: Query `/users/{userId}/journal_entries` without being the owner of `{userId}`.

## Test Runner (Mock Tests)
- `it('blocks cross-user writes', ...)`
- `it('enforces intensity range 1-10', ...)`
- `it('validates IDs', ...)`
