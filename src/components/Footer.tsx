export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/8 bg-slate-950/55 py-8 backdrop-blur-xl">
      <div className="mx-auto flex w-[min(1180px,calc(100%-2rem))] flex-col items-center justify-between gap-3 text-center text-sm text-slate-500 md:flex-row md:text-left">
        <p>© {new Date().getFullYear()} Ajay Chodankar. Built with Next.js, Prisma, and a better migration pass.</p>
        <p className="font-mono uppercase tracking-[0.16em] text-slate-600">Berlin time / global work</p>
      </div>
    </footer>
  );
}
