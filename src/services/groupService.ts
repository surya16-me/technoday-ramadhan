// Deprecated: Group logic moved to Server Actions (src/actions/groupActions.ts)
// This file can be kept for type definitions if needed, or types can be moved to a types file.

export interface Participant {
    id: number;
    name: string;
    section: string;
    groupId?: number | null;
}

export interface Group {
    id: number;
    groupNumber: number;
    groupName: string;
    color: string;
    participants: Participant[];
}
