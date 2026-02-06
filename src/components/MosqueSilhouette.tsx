"use client";

export default function MosqueSilhouette() {
    return (
        <div className="fixed bottom-0 left-0 w-full z-0 pointer-events-none opacity-20">
            <svg
                viewBox="0 0 1440 320"
                className="w-full h-auto"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill="#A38560"
                    fillOpacity="1"
                    d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320H0Z"
                ></path>
                {/* Simple Mosque Domes */}
                <path fill="#FFC845" fillOpacity="0.3" d="M100,280 Q150,150 200,280 Z" />
                <path fill="#FFC845" fillOpacity="0.4" d="M1100,250 Q1200,100 1300,250 Z" />
                <path fill="#FFC845" fillOpacity="0.2" d="M600,250 Q720,50 840,250 Z" />
            </svg>
        </div>
    );
}
