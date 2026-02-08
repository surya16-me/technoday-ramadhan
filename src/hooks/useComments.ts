"use client";

import { useQuery } from "@tanstack/react-query";
import { shuffleComments } from "@/actions/commentActions";

// Public: Shuffle Comments
export function useShuffleComments() {
    return useQuery({
        queryKey: ["comments", "shuffle"],
        queryFn: () => shuffleComments(),
        // Consider stale time if you don't want to re-shuffle on window focus
        staleTime: 1000 * 60,
    });
}
