import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useTheme } from '../context/ThemeContext';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Sun, 
  Moon, 
  Plus, 
  ShieldCheck, 
  ChevronDown, 
  Calculator, 
  Hammer, 
  Ruler, 
  TrendingUp, 
  Building2, 
  Home, 
  Users, 
  BookOpen,
  Sparkles
} from 'lucide-react';
import Button from './ui/Button';
import Logo from './ui/Logo';
import AuthModal from './AuthModal';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  // Auth Popup Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'

  const openAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  const exploreRef = useRef(null);
  const toolsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exploreRef.current && !exploreRef.current.contains(event.target)) {
        setExploreDropdownOpen(false);
      }
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        setToolsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm transition-colors font-medium flex items-center space-x-1 ${
      isActive
        ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
        : 'text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white'
    }`;

  return (
    <nav className="bg-white/90 dark:bg-[#090E17]/90 backdrop-blur-xl border-b border-gray-200/80 dark:border-zinc-800 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-7">
            
            {/* Explore Dropdown */}
            <div className="relative" ref={exploreRef}>
              <button
                type="button"
                onClick={() => {
                  setExploreDropdownOpen(!exploreDropdownOpen);
                  setToolsDropdownOpen(false);
                }}
                className={`text-sm font-medium flex items-center space-x-1 transition-colors ${
                  exploreDropdownOpen
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span>Explore</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${exploreDropdownOpen ? 'rotate-180 text-emerald-600' : 'text-gray-400'}`} />
              </button>

              {exploreDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-64 bg-white dark:bg-[#0B111E] rounded-2xl border border-gray-200/80 dark:border-zinc-800 shadow-xl p-2 z-50 animate-fadeIn">
                  <Link
                    to="/properties"
                    className="flex items-start p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-colors group"
                    onClick={() => setExploreDropdownOpen(false)}
                  >
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mr-3 group-hover:scale-105 transition-transform">
                      <Home className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-900 dark:text-zinc-100">All Properties</span>
                      <span className="block text-[11px] text-gray-500 dark:text-zinc-400">Browse residential & plots</span>
                    </div>
                  </Link>

                  <Link
                    to="/properties?listedBy=owner"
                    className="flex items-start p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-colors group"
                    onClick={() => setExploreDropdownOpen(false)}
                  >
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mr-3 group-hover:scale-105 transition-transform">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-1.5">
                        Direct Owner Deals
                        <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded">0% Fee</span>
                      </span>
                      <span className="block text-[11px] text-gray-500 dark:text-zinc-400">Zero middleman commission</span>
                    </div>
                  </Link>

                  <Link
                    to="/properties?listedBy=agent"
                    className="flex items-start p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-colors group"
                    onClick={() => setExploreDropdownOpen(false)}
                  >
                    <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 mr-3 group-hover:scale-105 transition-transform">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-900 dark:text-zinc-100">Verified Agency Feed</span>
                      <span className="block text-[11px] text-gray-500 dark:text-zinc-400">DHA & Society authorized listings</span>
                    </div>
                  </Link>

                  <Link
                    to="/properties?propertyType=Commercial"
                    className="flex items-start p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-colors group"
                    onClick={() => setExploreDropdownOpen(false)}
                  >
                    <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 mr-3 group-hover:scale-105 transition-transform">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-900 dark:text-zinc-100">Commercial Spaces</span>
                      <span className="block text-[11px] text-gray-500 dark:text-zinc-400">Plazas, shops & corporate offices</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Calculators & Tools Mega-Dropdown */}
            <div className="relative" ref={toolsRef}>
              <button
                type="button"
                onClick={() => {
                  setToolsDropdownOpen(!toolsDropdownOpen);
                  setExploreDropdownOpen(false);
                }}
                className={`text-sm font-medium flex items-center space-x-1 transition-colors ${
                  toolsDropdownOpen
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span>Calculators & Tools</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${toolsDropdownOpen ? 'rotate-180 text-emerald-600' : 'text-gray-400'}`} />
              </button>

              {toolsDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-80 bg-white dark:bg-[#0B111E] rounded-2xl border border-gray-200/80 dark:border-zinc-800 shadow-xl p-2.5 z-50 animate-fadeIn">
                  <div className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider px-3 py-1">
                    Pakistani Real Estate Intelligence
                  </div>

                  <Link
                    to="/loan-calculator"
                    className="flex items-start p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-colors group"
                    onClick={() => setToolsDropdownOpen(false)}
                  >
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mr-3 group-hover:scale-105 transition-transform">
                      <Calculator className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-900 dark:text-zinc-100">Home Loan & Bank EMI</span>
                      <span className="block text-[11px] text-gray-500 dark:text-zinc-400">Meezan, HBL & SBP Mera Ghar rates</span>
                    </div>
                  </Link>

                  <Link
                    to="/construction-cost-calculator"
                    className="flex items-start p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-colors group"
                    onClick={() => setToolsDropdownOpen(false)}
                  >
                    <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 mr-3 group-hover:scale-105 transition-transform">
                      <Hammer className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-900 dark:text-zinc-100">Construction Cost 2026</span>
                      <span className="block text-[11px] text-gray-500 dark:text-zinc-400">Grey structure & finishing estimates</span>
                    </div>
                  </Link>

                  <Link
                    to="/unit-converter"
                    className="flex items-start p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-colors group"
                    onClick={() => setToolsDropdownOpen(false)}
                  >
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mr-3 group-hover:scale-105 transition-transform">
                      <Ruler className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-900 dark:text-zinc-100">Land Unit Converter</span>
                      <span className="block text-[11px] text-gray-500 dark:text-zinc-400">Marla (225/272 SqFt), Kanal & Acres</span>
                    </div>
                  </Link>

                  <Link
                    to="/valuation"
                    className="flex items-start p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-colors group"
                    onClick={() => setToolsDropdownOpen(false)}
                  >
                    <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 mr-3 group-hover:scale-105 transition-transform">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-900 dark:text-zinc-100">AI Property Valuation</span>
                      <span className="block text-[11px] text-gray-500 dark:text-zinc-400">Instant fair market price estimator</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Verified Agents Directory */}
            <NavLink to="/agents" className={navLinkClass}>
              <Users className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
              <span>Verified Agents</span>
            </NavLink>

            {/* Insights / Blog */}
            <NavLink to="/blog" className={navLinkClass}>
              <BookOpen className="h-4 w-4 text-gray-400 dark:text-zinc-500" />
              <span>Insights</span>
            </NavLink>
          </div>

          {/* Action Buttons & Profile Controls */}
          <div className="hidden lg:flex items-center space-x-3.5">
            
            {/* Theme Toggle Ghost Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800/80 rounded-xl transition-colors"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="h-[18px] w-[18px]" />
              ) : (
                <Sun className="h-[18px] w-[18px]" />
              )}
            </button>

            {/* Permanent High-Contrast Post Property CTA */}
            <Link to="/add-property">
              <Button 
                variant="primary" 
                size="sm" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 px-4 rounded-xl shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 text-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Post Property Free</span>
              </Button>
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-zinc-700"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" className="h-8 w-8 rounded-full object-cover border border-gray-200 dark:border-zinc-700" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
                      <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  )}
                  <span className="font-semibold text-xs text-gray-900 dark:text-zinc-100">{user?.name?.split(' ')[0]}</span>
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </button>

                {profileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#0B111E] rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-xl p-2 z-50 animate-fadeIn">
                      <div className="px-3 py-2.5 border-b border-gray-100 dark:border-zinc-800 mb-1">
                        <p className="text-xs font-bold text-gray-900 dark:text-zinc-50 truncate">{user?.name}</p>
                        <p className="text-[11px] text-gray-500 dark:text-zinc-400 truncate mt-0.5">{user?.email}</p>
                        <div className="mt-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            user?.role === 'admin' 
                              ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300' 
                              : user?.role === 'agent' 
                              ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300' 
                              : 'bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200'
                          }`}>
                            {user?.role === 'agent' ? 'Verified Agent' : user?.role === 'admin' ? 'Super Admin' : 'Direct Member'}
                          </span>
                        </div>
                      </div>

                      <Link
                        to="/dashboard"
                        className="flex items-center px-3 py-2 text-xs font-semibold text-gray-700 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800/60 rounded-xl transition-colors"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <LayoutDashboard className="h-4 w-4 mr-2.5 text-gray-400" /> Dashboard & CRM
                      </Link>

                      {(user?.role === 'admin' || user?.role === 'agent') && (
                        <Link
                          to="/admin"
                          className="flex items-center px-3 py-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-xl transition-colors"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <ShieldCheck className="h-4 w-4 mr-2.5 text-amber-500" /> Admin Console
                        </Link>
                      )}

                      <Link
                        to="/add-property"
                        className="flex items-center px-3 py-2 text-xs font-semibold text-gray-700 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800/60 rounded-xl transition-colors"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <Plus className="h-4 w-4 mr-2.5 text-gray-400" /> Add New Property
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors mt-1"
                      >
                        <LogOut className="h-4 w-4 mr-2.5 text-red-500" /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <button
                  type="button"
                  onClick={() => openAuth('login')}
                  className="text-xs font-bold text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-2 rounded-xl"
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => openAuth('register')}
                >
                  <Button variant="secondary" size="sm" className="h-10 px-4 rounded-xl text-xs font-bold">
                    Join Us
                  </Button>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu & Post CTA for Small Screens */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white rounded-lg"
            >
              {theme === 'light' ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
            </button>

            <Link to="/add-property">
              <Button variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 px-3 rounded-lg text-xs">
                + Post
              </Button>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-900 dark:text-zinc-100 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-[500px] border-t border-gray-100 dark:border-zinc-800 py-4 overflow-y-auto' : 'max-h-0'
          }`}
        >
          <div className="space-y-1.5 px-1">
            <NavLink to="/properties" className="block px-3 py-2 rounded-xl text-sm font-semibold text-gray-800 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800" onClick={() => setMobileMenuOpen(false)}>
              🏠 All Properties
            </NavLink>
            <NavLink to="/properties?listedBy=owner" className="block px-3 py-2 rounded-xl text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30" onClick={() => setMobileMenuOpen(false)}>
              ⚡ Direct Owner Deals (0% Fee)
            </NavLink>
            <NavLink to="/agents" className="block px-3 py-2 rounded-xl text-sm font-semibold text-gray-800 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800" onClick={() => setMobileMenuOpen(false)}>
              🏢 Verified Agents Directory
            </NavLink>

            {/* Calculators Sub-Group */}
            <div className="pt-2 pb-1 border-t border-gray-100 dark:border-zinc-800 my-2">
              <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider px-3">
                Calculators & Tools
              </span>
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                <NavLink to="/loan-calculator" className="px-3 py-2 rounded-lg text-xs font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800" onClick={() => setMobileMenuOpen(false)}>
                  🏦 Loan Calc
                </NavLink>
                <NavLink to="/construction-cost-calculator" className="px-3 py-2 rounded-lg text-xs font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800" onClick={() => setMobileMenuOpen(false)}>
                  🏗️ Construction
                </NavLink>
                <NavLink to="/unit-converter" className="px-3 py-2 rounded-lg text-xs font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800" onClick={() => setMobileMenuOpen(false)}>
                  📐 Unit Converter
                </NavLink>
                <NavLink to="/valuation" className="px-3 py-2 rounded-lg text-xs font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800" onClick={() => setMobileMenuOpen(false)}>
                  📈 Valuation
                </NavLink>
              </div>
            </div>

            <NavLink to="/blog" className="block px-3 py-2 rounded-xl text-sm font-semibold text-gray-800 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800" onClick={() => setMobileMenuOpen(false)}>
              📰 Market Insights & Guides
            </NavLink>

            {isAuthenticated ? (
              <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 space-y-1.5">
                <NavLink to="/dashboard" className="block px-3 py-2 rounded-xl text-sm font-bold text-gray-900 dark:text-zinc-100 hover:bg-gray-50 dark:hover:bg-zinc-800" onClick={() => setMobileMenuOpen(false)}>
                  Dashboard & CRM
                </NavLink>
                {(user?.role === 'admin' || user?.role === 'agent') && (
                  <NavLink to="/admin" className="block px-3 py-2 rounded-xl text-sm font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30" onClick={() => setMobileMenuOpen(false)}>
                    🛡️ Admin Console
                  </NavLink>
                )}
                <button type="button" onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40">
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 space-y-2">
                <button
                  type="button"
                  onClick={() => openAuth('login')}
                  className="block w-full text-center px-4 py-2.5 text-xs font-bold text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-800 rounded-xl"
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => openAuth('register')}
                  className="block w-full"
                >
                  <Button variant="primary" className="w-full h-10 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
                    Join Us
                  </Button>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </nav>
  );
}

export default Navbar;
