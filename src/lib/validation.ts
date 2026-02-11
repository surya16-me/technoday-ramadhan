
// Basic XSS Prevention & Profanity Filter

// Common Indonesian & English Profanity List (Self-contained to avoid dependencies)
// Sensor sensitive words
const PROFANITY_LIST = [
    // Indo - Hewan & Makian Dasar
    "anj", "anjing", "babi", "bangsat", "bgst", "asu", "monyet", "kunyuk", "bajingan", "kampret", "keparat", "bejat", "edan", "sinting", "coeg", "su", "anjrit", "anjir", "njir",
    // Indo - Kelamin & Seksual
    "kontol", "kntl", "memek", "mmk", "jembut", "jmbt", "itil", "pentil", "titit", "tytyd", "peler", "bijik", "ngaceng", "sange", "sangek",
    "ngentot", "ngntt", "entot", "ewe", "ngewe", "bokep", "porno", "colok", "coli", "peju", "crot", "smean", "wikwik",
    // Indo - Hinaan Fisik/Mental/Status
    "tolol", "goblok", "bodoh", "bego", "idiot", "autis", "cacat", "gila", "bencong", "banci", "homo", "lesbi", "maho", "gay", "sarap", "gembel",
    // Indo - Kasar Daerah/Lainnya
    "pantek", "puki", "pukimak", "cukimay", "matamu", "ndasmu", "haram", "kafir", "setan", "iblis", "dajjal", "sialan", "brengsek",
    // Indo - Profesi Negatif
    "lonte", "lonthe", "pelacur", "perek", "bispak", "jablay", "ayam kampus", "kimcil",
    // English
    "fuck", "fck", "shit", "sh1t", "bitch", "b1tch", "asshole", "dick", "cock", "pussy", "cunt", "whore", "slut", "bastard",
    "motherfucker", "faggot", "nigger", "nigga", "retard", "sex", "porn", "xxx", "nude", "boobs", "tits"
];

export function containsProfanity(text: string): boolean {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    return PROFANITY_LIST.some(word => {
        // Simple word boundary check or direct inclusion
        // Using word boundary to avoid false positives in substrings (e.g. 'analisis' contains 'anal')
        // However, for Indo slang, substrings are common (e.g. 'anjiang'). 
        // Let's do a mix: check if the word exists as a token or part of a token.
        // For safety, let's just check if the bad word appears as a standalone word or surrounded by non-alpha chars.
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        return regex.test(lowerText);
    });
}

export function sanitizeInput(text: string): string {
    if (!text) return "";
    // Basic prevention of script tags and common XSS vectors
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export function validateInput(text: string): { isValid: boolean; message?: string } {
    if (!text) return { isValid: true };

    // Check for XSS attempts (basic heuristic)
    if (/<script\b[^>]*>([\s\S]*?)<\/script>/gm.test(text) || /javascript:/i.test(text) || /on\w+=/i.test(text)) {
        return { isValid: false, message: "Input mengandung karakter berbahaya (XSS detected)." };
    }

    // Check for Profanity
    if (containsProfanity(text)) {
        return { isValid: false, message: "Input mengandung kata-kata yang tidak pantas. Harap gunakan bahasa yang sopan." };
    }

    return { isValid: true };
}
