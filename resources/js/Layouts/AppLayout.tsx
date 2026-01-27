import FlashMessage from '@/Components/FlashMessage';
import { PropsWithChildren, useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import LanguageSwitcher from "@/Components/LanguageSwitcher";
import ThemeToggle from "@/Components/ThemeToggle"; // ✅ 1. Import ThemeToggle
import Sidebar from "@/Components/Sidebar";
import NotificationDropdown from "@/Components/NotificationDropdown";
import { useI18n } from "@/lib/i18n";
import { Menu, X } from "lucide-react";

export default function AppLayout({ children }: PropsWithChildren) {
  const { t, locale, dir } = useI18n();
  const page = usePage();
  const { auth } = page.props as any;
  const user = auth?.user;
  const [mobileOpen, setMobileOpen] = useState(false);

  // Handle Language Direction
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  // Close mobile sidebar on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [page.url]);

  return (
    // ✅ 2. Added dark mode background and text colors to root
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">

      {/* 1. Flash Message */}
      <FlashMessage />

      {/* ---------------------------------------------------------------------------
       * 2. DESKTOP SIDEBAR (Fixed Left)
       * --------------------------------------------------------------------------- */}
      {/* ✅ 3. Added dark mode background and border */}
      <aside className="fixed inset-y-0 start-0 z-50 w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col h-screen transition-colors duration-200">
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-700 shrink-0">
           <Link href={route("welcome")} className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold shadow-sm">
                 DB
              </span>
              <span className="font-bold text-xl text-slate-800 dark:text-white tracking-tight">
                {t("app_name") || "DzDoctor"}
              </span>
           </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <Sidebar />
        </div>

        {/* Sidebar Footer (User Info) */}
        {user && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 shrink-0">
             <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-200 font-bold uppercase text-sm">
                   {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user.name}</p>
                   <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                </div>
             </div>
          </div>
        )}
      </aside>

      {/* ---------------------------------------------------------------------------
       * 3. MOBILE SIDEBAR (Drawer)
       * --------------------------------------------------------------------------- */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Panel */}
          {/* ✅ 4. Added dark mode background */}
          <aside className="absolute inset-y-0 start-0 w-80 bg-white dark:bg-gray-800 shadow-2xl flex flex-col h-screen animate-slide-in transition-colors duration-200">
             <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-700">
                <span className="font-bold text-xl text-slate-800 dark:text-white">{t("app_name") || "DzDoctor"}</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                   <X className="w-6 h-6" />
                </button>
             </div>
             <div className="flex-1 overflow-y-auto p-4">
                <Sidebar />
             </div>
          </aside>
        </div>
      )}

      {/* ---------------------------------------------------------------------------
       * 4. MAIN CONTENT WRAPPER
       * --------------------------------------------------------------------------- */}
      <div className="flex-1 md:ms-80 flex flex-col min-h-screen transition-all duration-300">

        {/* Top Header */}
        {/* ✅ 5. Added dark mode background and border */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4 sm:px-6 transition-colors duration-200">

           {/* Left: Mobile Toggle */}
           <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
              >
                 <Menu className="w-6 h-6" />
              </button>
           </div>

           {/* Right: Actions */}
           <div className="flex items-center gap-2 sm:gap-4">
              {/* ✅ 6. Added ThemeToggle next to LanguageSwitcher */}
              <ThemeToggle />
              <LanguageSwitcher />

              {/* Notification Dropdown */}
              {user && (
                 <div className="relative">
                    <NotificationDropdown />
                 </div>
              )}
           </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
           {children}
        </main>

        {/* Footer */}
        <footer className="py-6 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100/50 dark:border-gray-700/50 mx-6">
           © {new Date().getFullYear()} • {t("app_name") || "DzDoctor"}
        </footer>

      </div>
    </div>
  );
}
