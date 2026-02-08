"use client";

import { useState, useEffect } from "react";
import {
    Users,
    RefreshCw,
    Users as UsersIcon,
    Trash2,
    Loader2,
    Settings,
    Eye,
    GripVertical
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import AdminShell from "@/components/AdminShell";
import Alert from "@/components/Alert";
import ModalConfirmation from "@/components/ModalConfirmation";
import { useGenerateGroups, useDeleteGroups, useAssignGroup } from "@/hooks/useGroups";
import { Group, Participant } from "@/services/groupService";

interface Props {
    initialGroups: Group[];
    unassignedParticipants: Participant[];
    attendingCount: number;
}

export default function AdminGroupManager({ initialGroups, unassignedParticipants, attendingCount }: Props) {
    const [groups, setGroups] = useState<Group[]>(initialGroups);
    const [unassigned, setUnassigned] = useState<Participant[]>(unassignedParticipants);
    const [groupCount, setGroupCount] = useState(1);

    // UI State
    const [alert, setAlert] = useState<{ isOpen: boolean; message: string; type: "success" | "error" }>({
        isOpen: false, message: "", type: "success"
    });
    const [confirmationModal, setConfirmationModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        variant?: "danger" | "default";
    }>({
        isOpen: false, title: "", message: "", onConfirm: () => { }, variant: "default"
    });
    const [draggedParticipant, setDraggedParticipant] = useState<Participant | null>(null);

    // Queries / Mutations
    const generateMutation = useGenerateGroups();
    const deleteMutation = useDeleteGroups();
    const assignMutation = useAssignGroup();

    const handleGenerateGroups = () => {
        generateMutation.mutate(groupCount, {
            onSuccess: () => {
                window.location.reload();
                setAlert({ isOpen: true, message: "Groups generated successfully!", type: "success" });
            },
            onError: (error: any) => {
                setAlert({ isOpen: true, message: error.response?.data?.error || "Failed to generate groups", type: "error" });
            }
        });
    };

    const handleDeleteGroups = () => {
        setConfirmationModal({
            isOpen: true,
            title: "Reset All Groups?",
            message: "This action cannot be undone. Participants will be returned to the unassigned pool.",
            // No change needed if services are used via hooks. But if types are imported from services.
            // Let's verify imports first.
            variant: "danger",
            onConfirm: () => {
                setConfirmationModal(prev => ({ ...prev, isOpen: false }));
                deleteMutation.mutate(undefined, {
                    onSuccess: () => {
                        window.location.reload();
                        setAlert({ isOpen: true, message: "All groups have been reset.", type: "success" });
                    },
                    onError: (error: any) => {
                        setAlert({ isOpen: true, message: error.response?.data?.error || "Failed to reset groups", type: "error" });
                    }
                });
            }
        });
    };

    const handleDragStart = (e: React.DragEvent, participant: Participant) => {
        setDraggedParticipant(participant);
        e.dataTransfer.setData("participantId", participant.id.toString());
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent, targetGroupId: number | null) => {
        e.preventDefault();
        const participantId = parseInt(e.dataTransfer.getData("participantId"));

        if (!participantId || !draggedParticipant) return;

        // 1. Optimistic Update
        const newUnassigned = unassigned.filter(p => p.id !== participantId);
        const newGroups = groups.map(g => ({
            ...g,
            participants: g.participants.filter(p => p.id !== participantId)
        }));

        if (targetGroupId === null) {
            newUnassigned.push(draggedParticipant);
        } else {
            const targetGroupIndex = newGroups.findIndex(g => g.id === targetGroupId);
            if (targetGroupIndex !== -1) {
                newGroups[targetGroupIndex].participants.push(draggedParticipant);
            }
        }

        setUnassigned(newUnassigned);
        setGroups(newGroups);
        setDraggedParticipant(null);

        // 2. Server Mutation
        assignMutation.mutate({ participantId, groupId: targetGroupId }, {
            onError: () => {
                // Revert state on error if needed, or just alert and reload
                setAlert({ isOpen: true, message: "Failed to move participant. Refreshing...", type: "error" });
                setTimeout(() => window.location.reload(), 1500);
            }
        });
    };

    const isGenerating = generateMutation.isPending || deleteMutation.isPending;

    return (
        <AdminShell>
            <Alert
                isOpen={alert.isOpen}
                message={alert.message}
                type={alert.type}
                onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
            />

            <ModalConfirmation
                isOpen={confirmationModal.isOpen}
                title={confirmationModal.title}
                message={confirmationModal.message}
                variant={confirmationModal.variant}
                onConfirm={confirmationModal.onConfirm}
                onCancel={() => setConfirmationModal(prev => ({ ...prev, isOpen: false }))}
                isLoading={isGenerating}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-rama-gold flex items-center gap-3">
                        <Settings className="w-8 h-8" />
                        Group Management
                    </h1>
                    <p className="text-white/40 text-sm mt-1">Drag and drop to manage groups manually</p>
                </div>

                <div className="flex gap-3">
                    <Link
                        href="/groups"
                        target="_blank"
                        className="bg-rama-gold/10 hover:bg-rama-gold/20 text-rama-gold border border-rama-gold/30 px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
                    >
                        <Eye className="w-4 h-4" />
                        Public View
                    </Link>
                    <button
                        onClick={handleDeleteGroups}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                        Reset All
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Control Panel & Unassigned Pool */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Generator */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-rama-gold">
                            <RefreshCw className="w-5 h-5" />
                            Auto Generate
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-white/60 mb-2">
                                    Total Groups
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={groupCount}
                                    onChange={(e) => setGroupCount(parseInt(e.target.value))}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-rama-gold/50 text-white"
                                />
                            </div>
                            <button
                                onClick={handleGenerateGroups}
                                disabled={isGenerating || attendingCount === 0}
                                className="w-full bg-rama-gold hover:bg-rama-gold-muted text-black font-bold py-3 rounded-xl transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                            >
                                {isGenerating ? <Loader2 className="animate-spin" /> : "Shuffle Groups!"}
                            </button>
                        </div>
                    </div>

                    {/* Unassigned Pool */}
                    <div
                        className="bg-white/5 border border-white/10 rounded-2xl p-4 sticky top-24 min-h-[500px] flex flex-col"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, null)}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-white/80">Unassigned</h2>
                            <span className="bg-white/10 px-2 py-1 rounded text-xs font-mono">{unassigned.length}</span>
                        </div>

                        <div className="flex-grow space-y-2 overflow-y-auto max-h-[60vh] custom-scrollbar pr-2">
                            {unassigned.length === 0 ? (
                                <div className="text-center py-10 text-white/20 text-sm border-2 border-dashed border-white/10 rounded-xl">
                                    Pool Empty
                                </div>
                            ) : (
                                unassigned.map(p => (
                                    <div
                                        key={p.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, p)}
                                        className="bg-rama-dark-green border border-white/10 p-3 rounded-lg cursor-grab active:cursor-grabbing hover:border-rama-gold/50 transition-colors flex items-center gap-3 shadow-sm group"
                                    >
                                        <GripVertical className="w-4 h-4 text-white/20 group-hover:text-white/50" />
                                        <div>
                                            <p className="font-medium text-sm text-white">{p.name}</p>
                                            <p className="text-[10px] text-rama-gold">{p.section}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Groups Kanban Board */}
                <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <UsersIcon className="w-6 h-6 text-rama-gold" />
                            Groups Board ({groups.length})
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        <AnimatePresence>
                            {groups.map((group) => (
                                <motion.div
                                    key={group.id}
                                    layout
                                    className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col h-full min-h-[300px]"
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, group.id)}
                                >
                                    {/* Group Header */}
                                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20" style={{ borderTop: `4px solid ${group.color}` }}>
                                        <div>
                                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Group {group.groupNumber}</p>
                                            <h3 className="font-bold text-lg" style={{ color: group.color }}>{group.groupName}</h3>
                                        </div>
                                        <span className="text-xs bg-white/10 px-2 py-1 rounded-full">{group.participants.length}</span>
                                    </div>

                                    {/* Drop Zone */}
                                    <div className="p-4 flex-grow space-y-2 relative">
                                        {group.participants.length === 0 && (
                                            <div className="absolute inset-0 flex items-center justify-center text-white/10 pointer-events-none text-sm font-medium">
                                                Drop Here
                                            </div>
                                        )}
                                        {group.participants.map(p => (
                                            <div
                                                key={p.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, p)}
                                                className="bg-black/40 border border-white/5 p-2 rounded-lg cursor-grab active:cursor-grabbing hover:border-white/20 transition-colors flex items-center justify-between group/item"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-8 rounded-full bg-white/10"></div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white/90">{p.name}</p>
                                                        <p className="text-[10px] text-white/40">{p.section}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {groups.length === 0 && (
                        <div className="bg-white/5 border border-white/10 border-dashed rounded-3xl p-12 text-center h-[400px] flex flex-col items-center justify-center">
                            <Users className="w-16 h-16 text-white/10 mx-auto mb-4" />
                            <p className="text-white/40">Canvas is empty. Generate groups to start.</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminShell>
    );
}
