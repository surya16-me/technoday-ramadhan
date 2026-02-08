"use client";

import { useMutation } from "@tanstack/react-query";
import { ParticipantData } from "@/services/participantService";
import { checkInParticipant, createParticipant, registerParticipant } from "@/actions/participantActions";
import { useRouter } from "next/navigation";

// Public: Standard Registration (Now using Server Action)
export function useRegisterParticipant() {
    return useMutation({
        mutationFn: (data: ParticipantData) => registerParticipant({
            name: data.name,
            npk: data.npk,
            section: data.section,
            attendance: data.attendance || "hadir",
            comment: data.comment || ""
        }),
    });
}

// Admin: Toggle Check-in
export function useCheckInParticipant() {
    const router = useRouter();
    return useMutation({
        mutationFn: ({ id, isCheckedIn }: { id: number; isCheckedIn: boolean }) =>
            checkInParticipant({ id, isCheckedIn }),
        onSuccess: () => {
            // Server action already revalidates, but router.refresh() updates the client cache of the server component payload
            router.refresh();
        },
    });
}

// Admin: Manual Create
export function useCreateParticipant() {
    const router = useRouter();
    return useMutation({
        mutationFn: (data: ParticipantData) => createParticipant({
            name: data.name,
            npk: data.npk,
            section: data.section
        }),
        onSuccess: () => {
            router.refresh();
        },
    });
}
