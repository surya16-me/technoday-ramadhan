'use client';

import { useState } from 'react';
import { Users, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Participant {
    id: number;
    name: string;
    section: string;
}

interface GroupWithParticipants {
    id: number;
    groupNumber: number;
    groupName: string;
    color: string;
    participants: Participant[];
}

const getSectionStyle = (section: string) => {
    const colors = [
        { bg: 'rgba(52, 211, 153, 0.2)', border: 'rgba(52, 211, 153, 0.5)', text: '#34d399' }, // Emerald
        { bg: 'rgba(96, 165, 250, 0.2)', border: 'rgba(96, 165, 250, 0.5)', text: '#60a5fa' }, // Blue
        { bg: 'rgba(167, 139, 250, 0.2)', border: 'rgba(167, 139, 250, 0.5)', text: '#a78bfa' }, // Purple
        { bg: 'rgba(251, 113, 133, 0.2)', border: 'rgba(251, 113, 133, 0.5)', text: '#fb7185' }, // Rose
        { bg: 'rgba(251, 191, 36, 0.2)', border: 'rgba(251, 191, 36, 0.5)', text: '#fbbf24' }, // Amber
        { bg: 'rgba(34, 211, 238, 0.2)', border: 'rgba(34, 211, 238, 0.5)', text: '#22d3ee' }, // Cyan
        { bg: 'rgba(244, 114, 182, 0.2)', border: 'rgba(244, 114, 182, 0.5)', text: '#f472b6' }, // Pink
        { bg: 'rgba(163, 230, 53, 0.2)', border: 'rgba(163, 230, 53, 0.5)', text: '#a3e635' }, // Lime
    ];

    let hash = 0;
    for (let i = 0; i < section.length; i++) {
        hash = section.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % colors.length;
    return colors[index];
};

interface GroupsListProps {
    initialGroups: GroupWithParticipants[];
}

export default function GroupsList({ initialGroups }: GroupsListProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredGroups = initialGroups.filter(group => {
        const searchLower = searchTerm.toLowerCase();
        // Check if group name matches
        if (group.groupName.toLowerCase().includes(searchLower)) return true;
        // Check if any participant name matches
        if (group.participants.some(p => p.name.toLowerCase().includes(searchLower))) return true;

        return false;
    });

    return (
        <div className="w-full max-w-7xl mx-auto">
            {/* Search Bar */}
            <div className="mb-12 max-w-md mx-auto relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-rama-gold/50 group-focus-within:text-rama-gold transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="Search by name or team..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-rama-dark-green/50 border border-rama-gold/30 rounded-2xl text-white placeholder-rama-white/30 focus:outline-none focus:border-rama-gold focus:ring-1 focus:ring-rama-gold/50 transition-all backdrop-blur-sm"
                />
                <div className="absolute inset-0 -z-10 bg-rama-gold/5 blur-xl rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Groups Grid */}
            {filteredGroups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                    <AnimatePresence>
                        {filteredGroups.map((group) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                key={group.id}
                                className="relative group/card h-full"
                            >
                                {/* Glowing backdrop */}
                                <div
                                    className="absolute inset-0 blur-xl opacity-20 group-hover/card:opacity-40 transition-opacity rounded-3xl"
                                    style={{ backgroundColor: group.color }}
                                ></div>

                                {/* Main Card */}
                                <div className="relative bg-[#0f2b26] border border-white/10 rounded-3xl overflow-hidden shadow-2xl h-full flex flex-col hover:border-rama-gold/30 transition-colors duration-300">
                                    {/* Group Header */}
                                    <div
                                        className="p-6 text-center border-b"
                                        style={{ borderColor: `${group.color}30` }}
                                    >
                                        <div
                                            className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2 border"
                                            style={{ borderColor: group.color, color: group.color, backgroundColor: `${group.color}10` }}
                                        >
                                            Group {group.groupNumber}
                                        </div>
                                        <h2
                                            className="text-2xl md:text-3xl font-bold font-majestic tracking-tight"
                                            style={{ color: group.color }}
                                        >
                                            {group.groupName}
                                        </h2>
                                    </div>

                                    {/* Members List */}
                                    <div className="p-6 flex-grow">
                                        <div className="flex items-center gap-2 mb-4 text-rama-white/50 text-xs font-semibold uppercase tracking-widest">
                                            <Users className="w-4 h-4" />
                                            <span>Team Members ({group.participants.length})</span>
                                        </div>
                                        <div className="space-y-3">
                                            {group.participants.map((person, idx) => (
                                                <div
                                                    key={person.id}
                                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${person.name.toLowerCase().includes(searchTerm.toLowerCase()) && searchTerm !== ''
                                                        ? 'bg-rama-gold/20 border-rama-gold/50'
                                                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                                                        }`}
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-rama-dark-green flex items-center justify-center text-rama-gold text-xs font-bold border border-rama-gold/30">
                                                        {idx + 1}
                                                    </div>
                                                    <div className="flex flex-col items-start">
                                                        <span className={`font-medium text-sm md:text-base leading-tight ${person.name.toLowerCase().includes(searchTerm.toLowerCase()) && searchTerm !== ''
                                                            ? 'text-rama-gold'
                                                            : 'text-white'
                                                            }`}>
                                                            {person.name}
                                                        </span>
                                                        <span
                                                            className="text-[10px] px-2 py-0.5 rounded-full mt-1 font-bold uppercase tracking-wider border"
                                                            style={{
                                                                backgroundColor: getSectionStyle(person.section).bg,
                                                                borderColor: getSectionStyle(person.section).border,
                                                                color: getSectionStyle(person.section).text
                                                            }}
                                                        >
                                                            {person.section}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer decoration */}
                                    <div
                                        className="h-2 w-full"
                                        style={{ backgroundColor: group.color }}
                                    ></div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                        <Search className="w-10 h-10 text-rama-white/20" />
                    </div>
                    <h3 className="text-2xl font-bold text-rama-gold/50 mb-2">No results found</h3>
                    <p className="text-rama-white/40">Try searching for a different name or group.</p>
                </div>
            )}
        </div>
    );
}
