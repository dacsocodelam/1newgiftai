/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Scan các file trong src
  ],
  theme: {
    extend: {
      colors: {
        // Thêm tông màu sang trọng như kế hoạch
        navy: "#001f3f",
        gold: "#FFD700",
        cream: "#FFFDD0",
      },
    },
  },
  plugins: [],
};
