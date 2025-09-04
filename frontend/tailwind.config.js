/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Updated primary color with more shades
                primary: {
                    light: '#6366F1', // Indigo 500
                    DEFAULT: '#4F46E5', // Indigo 600
                    dark: '#4338CA', // Indigo 700
                },
                // Updated secondary color for vibrant accents
                secondary: {
                    light: '#F472B6', // Pink 400
                    DEFAULT: '#EC4899', // Pink 500
                    dark: '#DB2777', // Pink 600
                },
                // Added new accent colors for variety
                accent: {
                    teal: '#14B8A6',
                    amber: '#F59E0B',
                    lime: '#84CC16',
                },
                background: '#F3F4F6', // Gray 100
                surface: '#FFFFFF', // White
                textPrimary: '#1F2937', // Gray 800
                textSecondary: '#6B7280', // Gray 500
            },
            fontFamily: {
                sans: ['Poppins', 'sans-serif'],
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}