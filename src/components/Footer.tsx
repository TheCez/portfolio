export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black py-8 mt-20">
      <div className="container mx-auto px-6 text-center">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Ajay Chodankar. Built with Next.js, Tailwind, and AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
