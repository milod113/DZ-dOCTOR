import { Link, usePage } from "@inertiajs/react";
import { useI18n } from "@/lib/i18n";
import {
  Home,
  Search,
  LayoutDashboard,
  Calendar,
  Clock,
  UserPlus,
  Shield,
  Settings,
  LogOut,
  User,
  UserCog,
  FileCheck,
  Users,
  ChevronRight,
  Stethoscope,
  HelpCircle,
  Zap,
  Activity,
  BookOpen,
  MessageSquare,
  Lock,
  HeartPulse,
  FlaskConical,
  ClipboardList,
  Scan,
  QrCode,
  ChevronDown,
  ChevronUp,
  CreditCard,
  FileText,
  Building,
  MapPin,
  Phone,
  Mail,
  Star,
  TrendingUp,
  PlusCircle,
  Award,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";
import { useState } from 'react';

export default function Sidebar() {
  const { t } = useI18n();
  const { url, props } = usePage();
  const user: any = props.auth?.user;

  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    navigation: false,
    dashboard: false,
    tools: false,
    health: false,
    administration: false,
    resources: false,
    settings: false,
  });

  // Safe check for route active state
  const isActive = (routeName: string) => {
    try {
        if (routeName.endsWith('*')) {
            return route().current(routeName);
        }
        return route().current(routeName);
    } catch (e) {
        return false;
    }
  };

  // --- ROLE DEFINITIONS ---
  const isDoctor = user?.role === 'doctor';
  const isSecretary = user?.role === 'secretary';
  const isLaboratory = user?.role === 'laboratory';
  const isImaging = user?.role === 'imagerie';
  const isAdmin = user?.role === 'admin';
  const isPatient = user?.role === 'patient';
  const isClinical = isDoctor || isSecretary;

  // --- ROLE ICONS ---
  const getRoleIcon = () => {
    if (isDoctor) return <Stethoscope className="w-5 h-5" />;
    if (isSecretary) return <Users className="w-5 h-5" />;
    if (isLaboratory) return <FlaskConical className="w-5 h-5" />;
    if (isImaging) return <Scan className="w-5 h-5" />;
    if (isAdmin) return <Shield className="w-5 h-5" />;
    if (isPatient) return <User className="w-5 h-5" />;
    return <User className="w-5 h-5" />;
  };

  // --- ROLE COLORS ---
  const getRoleColor = () => {
    if (isDoctor) return "from-blue-500 via-blue-400 to-cyan-400";
    if (isSecretary) return "from-purple-500 via-purple-400 to-pink-400";
    if (isLaboratory) return "from-violet-500 via-violet-400 to-fuchsia-400";
    if (isImaging) return "from-indigo-500 via-indigo-400 to-violet-400";
    if (isAdmin) return "from-amber-500 via-amber-400 to-orange-400";
    if (isPatient) return "from-emerald-500 via-emerald-400 to-teal-400";
    return "from-gray-600 via-gray-500 to-gray-400";
  };

  const getRoleColorLight = () => {
    if (isDoctor) return "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300";
    if (isSecretary) return "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300";
    if (isLaboratory) return "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-300";
    if (isImaging) return "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300";
    if (isAdmin) return "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-300";
    if (isPatient) return "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-300";
    return "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300";
  };

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const NavItem = ({
    href,
    icon: Icon,
    label,
    active,
    badge,
    badgeColor = "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    isHighlighted = false,
    isSubItem = false
  }: any) => (
    <Link
      href={href}
      className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 my-1 ${
        active
          ? `${getRoleColorLight()} shadow-sm border border-gray-200 dark:border-gray-700`
          : "text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:from-gray-800 dark:hover:to-gray-800 dark:hover:text-gray-200"
      } ${isHighlighted ? 'relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-8 before:bg-gradient-to-b before:from-blue-500 before:to-cyan-400 before:rounded-r-full' : ''} ${
        isSubItem ? 'ml-6 pl-8 border-l-2 border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600' : ''
      }`}
    >
      <div className={`p-2 rounded-xl transition-all duration-200 ${
        active
          ? `bg-gradient-to-r ${getRoleColor()} text-white shadow-md`
          : 'bg-gray-100 text-gray-500 group-hover:bg-gradient-to-r group-hover:from-blue-100 group-hover:to-cyan-100 group-hover:text-blue-600 dark:bg-gray-800 dark:text-gray-400 dark:group-hover:from-gray-800 dark:group-hover:to-gray-800 dark:group-hover:text-blue-400'
      }`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className={`flex-1 font-medium ${isSubItem ? 'text-sm' : ''}`}>{label}</span>
      {badge && (
        <span className={`px-2 py-1 text-xs font-bold rounded-full ${badgeColor} animate-pulse`}>
          {badge}
        </span>
      )}
      <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
        active
          ? 'text-blue-400 dark:text-blue-300'
          : 'text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-400'
      }`} />
    </Link>
  );

  const SectionHeader = ({
    title,
    icon: Icon,
    sectionKey,
    badge,
    badgeColor = "bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
  }: any) => {
    const isCollapsed = collapsedSections[sectionKey];

    return (
      <button
        onClick={() => toggleSection(sectionKey)}
        className="group relative flex items-center justify-between gap-3 px-4 py-3 my-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 w-full text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl">
            <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </div>
          <span className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            {title}
          </span>
          {badge && (
            <span className={`px-2 py-0.5 text-xs font-bold rounded-lg ${badgeColor}`}>
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isCollapsed ? (
            <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          ) : (
            <ChevronUp className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          )}
        </div>
      </button>
    );
  };

  // Helper to get Dashboard Route based on role
  const getDashboardRoute = () => {
    if (isClinical) return route("doctor.dashboard");
    if (isLaboratory) return route().has("laboratory.dashboard") ? route("laboratory.dashboard") : "#";
    if (isImaging) return route().has("imaging.dashboard") ? route("imaging.dashboard") : "#";
    if (isAdmin) return route("admin.doctors.index");
    return route("dashboard");
  }

  // Helper to verify verification status
  const isVerified = () => {
    if (isDoctor) return user.verification_status === 'approved';
    if (isLaboratory) return user.laboratory?.verification_status === 'verified';
    if (isImaging) return user.imaging_center?.verification_status === 'verified';
    return true;
  }

  return (
    <nav className="flex flex-col gap-1 p-4 bg-gradient-to-b from-white via-white to-gray-50/80 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 min-h-screen border-r border-gray-100 dark:border-gray-800 shadow-xl transition-colors duration-300 relative overflow-hidden">

      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-900/10 dark:to-purple-900/10 rounded-full -translate-y-16 translate-x-8 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-emerald-500/5 to-teal-500/5 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-full -translate-x-12 translate-y-12 blur-3xl"></div>

      {/* User Profile Card */}
      {user && (
        <div className={`relative mb-6 p-4 bg-gradient-to-br ${getRoleColor()} rounded-2xl text-white shadow-2xl overflow-hidden group`}>
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 shadow-lg">
                  {getRoleIcon()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  <Award className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-lg truncate">{user.name}</div>
                <div className="text-white/90 text-sm flex items-center gap-2 mt-1">
                  <span className="capitalize font-medium bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    {user.role}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-white/50"></div>
                  <span className="text-xs opacity-75">ID: {user.id}</span>
                </div>
              </div>
            </div>

            {/* Verification & Stats */}
            <div className="flex items-center justify-between">
              {(isDoctor || isLaboratory || isImaging) && (
                <div className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 backdrop-blur-sm ${
                  isVerified() ? 'bg-green-500/30 text-green-100' : 'bg-amber-500/30 text-amber-100'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    isVerified() ? 'bg-green-400 animate-pulse' : 'bg-amber-400 animate-ping'
                  }`}></div>
                  {isVerified() ? '✓ Verified' : 'Pending Verification'}
                </div>
              )}

              {/* Quick Stats */}
              <div className="flex items-center gap-3 text-xs">
                <div className="text-center">
                  <div className="font-bold">24/7</div>
                  <div className="opacity-75">Support</div>
                </div>
                <div className="w-px h-4 bg-white/20"></div>
                <div className="text-center">
                  <div className="font-bold">99.9%</div>
                  <div className="opacity-75">Uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {/* Navigation Section */}
        <SectionHeader
          title="Navigation"
          icon={Home}
          sectionKey="navigation"
        />

        {!collapsedSections.navigation && (
          <div className="space-y-1">
            <NavItem
              href={route("welcome")}
              icon={Home}
              label={t("Home") || "Accueil"}
              active={isActive("welcome")}
            />
            <NavItem
              href={route("search")}
              icon={Search}
              label={t("Find a doctor") || "Trouver un médecin"}
              active={isActive("search") || url.startsWith("/doctor/")}
            />
            <NavItem
              href={route("laboratories.search")}
              icon={FlaskConical}
              label="Trouver un Labo"
              active={isActive("laboratories.search")}
            />
            <NavItem
              href={route("imaging.search")}
              icon={Scan}
              label="Trouver Imagerie"
              active={isActive("imaging.search")}
              badge="New"
              badgeColor="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm"
            />
          </div>
        )}

        {/* Authenticated User Links */}
        {user && (
          <>
            {/* Dashboard Section */}
            <SectionHeader
              title="Dashboard"
              icon={LayoutDashboard}
              sectionKey="dashboard"
            />

            {!collapsedSections.dashboard && (
              <div className="space-y-1">
                <NavItem
                  href={getDashboardRoute()}
                  icon={LayoutDashboard}
                  label={t("Dashboard") || "Tableau de bord"}
                  active={isActive("dashboard") || isActive("doctor.dashboard") || isActive("laboratory.dashboard") || isActive("imaging.dashboard")}
                />
              </div>
            )}

            {/* Patient Section */}
            {isPatient && (
              <>
                <SectionHeader
                  title="Ma Santé"
                  icon={HeartPulse}
                  sectionKey="health"
                />

                {!collapsedSections.health && (
                  <div className="space-y-1">
                    <NavItem
  href={route("patient.appointments.index")} // ✅ UPDATE THIS LINE
  icon={Calendar}
  label="Mes Rendez-vous"
  active={isActive("patient.appointments.index")} // ✅ UPDATE THIS LINE
/>
<NavItem
          href={route("patient.qr-code")}
          icon={QrCode}
          label="Mon QR Code"
          active={isActive("patient.qr-code")}
        />
<NavItem
  href={route("patient.family.index")}
  icon={Users}
  label="Mes Proches"
  active={isActive("patient.family.*")}
  badge="Famille"
/>

                    <NavItem
                      href={route("patient.analyses.index")}
                      icon={Activity}
                      label="Mes Résultats"
                      active={isActive("patient.analyses.*")}
                      badgeColor="bg-gradient-to-r from-emerald-500 to-teal-400 text-white"
                    />
                    <NavItem
                      href={route("patient.imaging.requests.index")}
                      icon={Scan} // Use Scan icon
                      label="Mes Imageries"
                      active={isActive("patient.imaging.requests.*")}
                    />
                    <NavItem
                      href="#"
                      icon={Calendar}
                      label="Mes Rendez-vous"
                      active={false}
                    />
                  </div>
                )}
              </>
            )}

            {/* Doctor Section */}
            {isDoctor && (
              <>
                <SectionHeader
                  title="Doctor Tools"
                  icon={Stethoscope}
                  sectionKey="tools"
                  badge="Pro"
                />

                {!collapsedSections.tools && (
                  <div className="space-y-1">
                    <NavItem
                      href={route("doctor.verification.show")}
                      icon={FileCheck}
                      label={t("Verification") || "Vérification"}
                      active={isActive("doctor.verification.show")}
                      badge={user.verification_status !== 'approved' ? "!" : null}
                      badgeColor={user.verification_status === 'approved'
                        ? "bg-gradient-to-r from-green-500 to-emerald-400 text-white"
                        : "bg-gradient-to-r from-amber-500 to-orange-400 text-white"}
                    />
                    <NavItem
                      href={route("doctor.schedule.edit")}
                      icon={Clock}
                      label="Horaires"
                      active={isActive("doctor.schedule.*")}
                    />
                    <NavItem
                      href={route("doctor.team.index")}
                      icon={Users}
                      label="Mon Équipe"
                      active={isActive("doctor.team.*")}
                    />
                    <NavItem
                      href={route("doctor.profile.edit")}
                      icon={UserCog}
                      label="Profil Médecin"
                      active={isActive("doctor.profile.*")}
                    />
                  </div>
                )}
              </>
            )}

            {/* Secretary Section */}
            {isSecretary && (
              <>
                <SectionHeader
                  title="Secrétariat"
                  icon={ClipboardList}
                  sectionKey="tools"
                  badge="Staff"
                  badgeColor="bg-gradient-to-r from-purple-500 to-pink-400 text-white"
                />

                {!collapsedSections.tools && (
                  <div className="space-y-1">
                    <NavItem
                      href={route("doctor.appointments.index")}
                      icon={CalendarDays}
                      label="Rendez-vous"
                      active={isActive("doctor.appointments.*")}
                      badge="Gérer"
                    />
                    <NavItem
                      href={route("doctor.team.index")}
                      icon={Users}
                      label="Médecins"
                      active={isActive("doctor.team.*")}
                    />
                  </div>
                )}
              </>
            )}

            {/* Laboratory Section */}
            {isLaboratory && (
              <>
                <SectionHeader
                  title="Laboratory"
                  icon={FlaskConical}
                  sectionKey="tools"
                />

                {!collapsedSections.tools && (
                  <div className="space-y-1">
                    <NavItem
                      href={route("laboratory.verification.show")}
                      icon={FileCheck}
                      label="Agrément"
                      active={isActive("laboratory.verification.show")}
                      badge={user.laboratory?.verification_status !== 'verified' ? "!" : null}
                      badgeColor="bg-gradient-to-r from-amber-500 to-orange-400 text-white"
                    />
                    {user.laboratory?.verification_status === 'verified' && (
                      <>
                        <NavItem
                          href={route("laboratory.requests.index")}
                          icon={ClipboardList}
                          label="Demandes"
                          active={isActive("laboratory.requests.*")}
                          badge="New"
                          badgeColor="bg-gradient-to-r from-violet-500 to-purple-400 text-white"
                        />
                        <NavItem
                          href={route("laboratory.settings.index")}
                          icon={Settings}
                          label="Paramètres"
                          active={isActive("laboratory.settings.*")}
                        />
                      </>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Imaging Center Section */}
            {isImaging && (
              <>
                <SectionHeader
                  title="Imagerie"
                  icon={Scan}
                  sectionKey="tools"
                />

                {!collapsedSections.tools && (
                  <div className="space-y-1">
                    <NavItem
                      href={route("imaging.setup")}
                      icon={FileCheck}
                      label="Agrément"
                      active={isActive("imaging.setup")}
                      badge={user.imaging_center?.verification_status !== 'verified' ? "!" : null}
                      badgeColor="bg-gradient-to-r from-amber-500 to-orange-400 text-white"
                    />
                    {user.imaging_center?.verification_status === 'verified' && (
                      <>
                        <NavItem
                          href={route("imaging.dashboard")}
                          icon={LayoutDashboard}
                          label="Dashboard Imagerie"
                          active={isActive("imaging.dashboard")}
                        />
                        <NavItem
                          href={route("imaging.requests.index")}
                          icon={Calendar}
                          label="Rendez-vous"
                          active={isActive("imaging.requests.*")}
                          badge="New"
                          badgeColor="bg-gradient-to-r from-indigo-500 to-purple-400 text-white"
                        />
                        <NavItem
                          href={route("imaging.appointments.index")}
                          icon={CalendarDays}
                          label="Agenda"
                          active={isActive("imaging.appointments.*")}
                        />
                        <NavItem
                          href={route("imaging.settings.index")}
                          icon={Settings}
                          label="Paramètres"
                          active={isActive("imaging.settings.*")}
                        />
                      </>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Admin Section */}
            {isAdmin && (
              <>
                <SectionHeader
                  title="Administration"
                  icon={Shield}
                  sectionKey="administration"
                  badge="Admin"
                />

                {!collapsedSections.administration && (
                  <div className="space-y-1">
                    <NavItem
                      href={route("admin.doctors.index")}
                      icon={Stethoscope}
                      label="Médecins"
                      active={isActive("admin.doctors.*")}
                    />
                    <NavItem
                      href={route("admin.verifications.index")}
                      icon={Lock}
                      label="Vérif. Médecins"
                      active={isActive("admin.verifications.index")}
                      badgeColor="bg-gradient-to-r from-blue-500 to-cyan-400 text-white"
                    />
                    <NavItem
                      href={route("admin.verifications.labs.index")}
                      icon={FlaskConical}
                      label="Vérif. Labos"
                      active={isActive("admin.verifications.labs.*")}
                      badgeColor="bg-gradient-to-r from-purple-500 to-pink-400 text-white"
                    />
                    <NavItem
                      href={route("admin.verifications.imaging.index")}
                      icon={Scan}
                      label="Vérif. Imagerie"
                      active={isActive("admin.verifications.imaging.*")}
                      badge="New"
                      badgeColor="bg-gradient-to-r from-indigo-500 to-violet-400 text-white"
                    />
                  </div>
                )}
              </>
            )}

            {/* Resources Section */}
            <SectionHeader
              title="Resources"
              icon={BookOpen}
              sectionKey="resources"
            />

            {!collapsedSections.resources && (
              <div className="space-y-1">
                <NavItem href="#" icon={HelpCircle} label="Help Center" active={false} />
                <NavItem
                  href="#"
                  icon={MessageSquare}
                  label="Support"
                  active={false}
                  badge="Live"
                  badgeColor="bg-gradient-to-r from-green-500 to-emerald-400 text-white"
                />
              </div>
            )}
          </>
        )}

        {/* Guest Links */}
        {!user && (
          <>
            <SectionHeader
              title="Account"
              icon={User}
              sectionKey="account"
            />

            {!collapsedSections.account && (
              <div className="space-y-1">
                <NavItem
                  href={route("login")}
                  icon={User}
                  label={t("Login") || "Connexion"}
                  active={isActive("login")}
                />
                <NavItem
                  href={route("register")}
                  icon={UserPlus}
                  label={t("Register") || "Inscription"}
                  active={isActive("register")}
                  badge="Join Free"
                  badgeColor="bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 text-white shadow-lg"
                  isHighlighted={true}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Section */}
      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700/50">
        {user ? (
          <>
            <SectionHeader
              title="Settings"
              icon={Settings}
              sectionKey="settings"
            />

            {!collapsedSections.settings && (
              <div className="space-y-1">
                <NavItem
                  href={isDoctor ? route("doctor.profile.edit") : route("profile.edit")}
                  icon={Settings}
                  label={t("Profile") || "Profil"}
                  active={isActive("profile.edit") || isActive("doctor.profile.edit")}
                />
                <Link
                  href={route("logout")}
                  method="post"
                  as="button"
                  className="group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 my-1 text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 dark:hover:from-red-900/20 dark:hover:to-rose-900/20 hover:text-red-700 dark:hover:text-red-300 w-full"
                >
                  <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-rose-400 group-hover:text-white transition-all shadow-sm">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <span className="flex-1 font-medium text-left">{t("Logout") || "Déconnexion"}</span>
                  <ChevronRight className="w-4 h-4 text-red-300 dark:text-red-800 group-hover:text-red-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border border-blue-100 dark:border-blue-800/50 shadow-sm">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 rounded-full blur-xl"></div>
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium relative z-10">
              Join 500+ medical professionals
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300 border-2 border-white dark:border-gray-800"></div>
                ))}
              </div>
              <PlusCircle className="w-5 h-5 text-blue-500 dark:text-blue-400" />
            </div>
          </div>
        )}

        {/* System Status */}
        <div className="mt-4 relative overflow-hidden rounded-2xl p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/5 to-green-500/5 dark:from-emerald-500/10 dark:to-green-500/10 rounded-full -translate-y-8 translate-x-8"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping"></div>
                </div>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">System Status</span>
              </div>
              <Zap className="w-4 h-4 text-emerald-500 animate-pulse" />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="text-center p-2 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Online</div>
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">24/7</div>
              </div>
              <div className="text-center p-2 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Secure</div>
                <div className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  ✓
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">Uptime</span>
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-emerald-400 to-green-400 h-full rounded-full w-[99.9%]"></div>
                </div>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">99.9%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </nav>
  );
}
