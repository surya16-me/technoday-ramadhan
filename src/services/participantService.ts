// Deprecated: Participant logic moved to Server Actions (src/actions/participantActions.ts)
// Retaining interface for shared typing.

export interface ParticipantData {
    name: string;
    npk: string;
    section: string;
    attendance?: string;
    comment?: string;
}
