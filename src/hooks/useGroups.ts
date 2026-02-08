"use client";

import { useMutation } from "@tanstack/react-query";
import { generateGroups, deleteGroups, assignGroup } from "@/actions/groupActions";

export function useGenerateGroups() {
    return useMutation({
        mutationFn: (groupCount: number) => generateGroups({ groupCount }),
    });
}

export function useDeleteGroups() {
    return useMutation({
        mutationFn: () => deleteGroups(),
    });
}

export function useAssignGroup() {
    return useMutation({
        mutationFn: ({ participantId, groupId }: { participantId: number; groupId: number | null }) =>
            assignGroup({ participantId, groupId }),
    });
}
