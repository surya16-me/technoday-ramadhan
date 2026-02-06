"use client";

import { motion } from "framer-motion";

export default function DesertScene() {
    return (
        <div className="fixed bottom-0 left-0 w-full z-0 pointer-events-none opacity-30">
            <svg
                viewBox="0 0 1440 320"
                className="w-full h-auto"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Sky/Ground Gradient Overlay (Optional) */}

                {/* Palm Trees */}
                <g transform="translate(50, 40)">
                    {/* Palm 1 */}
                    <path fill="#071a17" d="M30,250 Q40,150 30,100 Q10,120 0,110 Q20,100 30,100 Q40,80 20,70 Q40,90 40,100 Q60,80 70,100 Q50,110 40,100 Q40,150 50,250 Z" />
                    {/* Palm 2 */}
                    <path fill="#071a17" d="M120,260 Q130,180 120,130 Q100,150 90,140 Q110,130 120,130 Q130,110 110,100 Q130,120 130,130 Q150,110 160,130 Q140,140 130,130 Q130,180 140,260 Z" />
                </g>

                <g transform="translate(1250, 20)">
                    {/* Palm 3 Right */}
                    <path fill="#071a17" d="M30,250 Q40,150 30,100 Q10,120 0,110 Q20,100 30,100 Q40,80 20,70 Q40,90 40,100 Q60,80 70,100 Q50,110 40,100 Q40,150 50,250 Z" />
                </g>

                {/* Dunes (Foreground) */}
                <path
                    fill="#A38560"
                    fillOpacity="1"
                    d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320H0Z"
                ></path>

                {/* Camel Silhouette wrapped in motion for walking effect */}
                <motion.g
                    initial={{ x: -200 }}
                    animate={{ x: 1600 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                >
                    <g transform="translate(0, 180) scale(0.4)">
                        <path fill="#051412" d="M48.5,145.5c-4.5,0-8.5,1.5-11.5,4c-1.5,1.5-4.5,1.5-6.5,0c-3-2.5-7-4-11.5-4c-9,0-16.5,7.5-16.5,16.5v28
                c0,2.5,2,4.5,4.5,4.5s4.5-2,4.5-4.5v-19c0-2.5,2-4.5,4.5-4.5s4.5,2,4.5,4.5v16c0,2.5,2,4.5,4.5,4.5s4.5-2,4.5-4.5v-16
                c0-2.5,2-4.5,4.5-4.5h5c2.5,0,4.5,2,4.5,4.5v25c0,2.5,2,4.5,4.5,4.5s4.5-2,4.5-4.5v-27.5l-3.5,0c-2.5,0-4.5-2-4.5-4.5
                s2-4.5,4.5-4.5h8.5c7,0,13-4,15.5-10c0.5-1.5,0-3-1.5-3.5C64,139,56.5,145.5,48.5,145.5z M98,135.5c-1.5-3.5-5-6-9-6h-6
                c-5.5,0-10,4.5-10,10v10c0,1,0.5,2,1,2.5c4,5.5,5.5,12.5,4,19c-0.5,2,1,4.5,3,4.5c0.5,0,1,0,1.5-0.5c2-0.5,3.5-2.5,3-4.5
                c-1-4.5-3.5-8.5-6.5-11.5v-8.5h6c1,0,2.5,0.5,3,1.5c1.5,3,2,6.5,1,10c-0.5,2,0.5,4,2.5,4.5c2,0.5,4-0.5,4.5-2.5
                C103.5,155,102.5,144,98,135.5z" />
                        <circle fill="#051412" cx="75" cy="115" r="2.5" />
                    </g>
                </motion.g>

                {/* Mosque Domes (Background layers) */}
                <path fill="#FFC845" fillOpacity="0.1" d="M100,280 Q150,150 200,280 Z" />
                <path fill="#FFC845" fillOpacity="0.15" d="M1100,250 Q1200,100 1300,250 Z" />
                <path fill="#FFC845" fillOpacity="0.1" d="M600,250 Q720,50 840,250 Z" />
            </svg>
        </div>
    );
}
