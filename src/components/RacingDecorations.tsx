"use client";

import { motion } from "framer-motion";

export default function RacingDecorations() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            {/* Tire Tracks - Subtle Floor Texture */}
            <svg className="absolute bottom-0 left-0 w-full h-[50vh] opacity-[0.03]" preserveAspectRatio="none" viewBox="0 0 1000 500">
                {/* Racing Lines */}
                <path
                    d="M-100,500 C200,500 400,300 800,400 S1200,500 1600,300"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="80"
                />
                {/* Tire Tread Pattern Masked or Stroked */}
                <path
                    d="M-100,500 C200,500 400,300 800,400 S1200,500 1600,300"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="60"
                    strokeDasharray="5 10"
                />
                <path
                    d="M-100,560 C200,560 400,360 800,460 S1200,560 1600,360"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="60"
                    strokeDasharray="5 10"
                />
            </svg>

            {/* Checkered Flags hanging with the Lanterns? No, let's put them on the sides */}

            {/* Floating Checkered Cubes - Abstract */}
            <FloatingCube left="10%" top="20%" size={30} delay={0} />
            <FloatingCube left="85%" top="15%" size={40} delay={2} />
            <FloatingCube left="15%" top="70%" size={25} delay={1} />
            <FloatingCube left="80%" top="80%" size={35} delay={3} />
        </div>
    );
}

function FloatingCube({ left, top, size, delay }: { left: string, top: string, size: number, delay: number }) {
    return (
        <motion.div
            className="absolute opacity-20"
            style={{ left, top, width: size, height: size }}
            animate={{
                y: [0, -20, 0],
                rotate: [0, 45, 0],
                opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
        >
            {/* Checkered Pattern CSS */}
            <div className="w-full h-full border border-rama-gold/30"
                style={{
                    backgroundImage: `linear-gradient(45deg, #FFC845 25%, transparent 25%), 
                                   linear-gradient(-45deg, #FFC845 25%, transparent 25%), 
                                   linear-gradient(45deg, transparent 75%, #FFC845 75%), 
                                   linear-gradient(-45deg, transparent 75%, #FFC845 75%)`,
                    backgroundSize: `${size / 2}px ${size / 2}px`,
                    backgroundPosition: `0 0, 0 ${size / 4}px, ${size / 4}px -${size / 4}px, -${size / 4}px 0px`
                }}
            ></div>
        </motion.div>
    )
}
