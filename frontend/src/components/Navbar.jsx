import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../redux/authSlice.js'
import { useLang } from '../context/LanguageContext.jsx'
import axios from 'axios'
import { AUTH_API } from '../utils/constant.js'
import { toast } from 'sonner'
import { LogOut, User, Menu, X, Briefcase } from 'lucide-react'
import { useState } from 'react'

const Navbar = () => {
    const { t, lang, toggleLang } = useLang()
    const { user } = useSelector(store => store.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${AUTH_API}/logout`, { withCredentials: true })
            if (res.data.success) {
                dispatch(setUser(null))
                navigate("/")
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error("Logout mein problem aayi")
        }
    }

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="flex flex-col leading-tight">
                    <span className="text-xl font-bold text-gray-800">
                        Kaam<span className="text-orange-500">Connect</span>
                    </span>
                    <span className="text-xs text-gray-400">{t.tagline}</span>
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    <Link to="/jobs" className="text-gray-600 hover:text-orange-500 text-sm font-medium">{t.jobs}</Link>
                    {user && user.role === "maalik" && (
                        <>
                            <Link to="/post-job" className="text-gray-600 hover:text-orange-500 text-sm font-medium">{t.postJob}</Link>
                            <Link to="/my-jobs" className="text-gray-600 hover:text-orange-500 text-sm font-medium">{t.myJobs}</Link>
                        </>
                    )}
                    {user && user.role === "kaamgar" && (
                        <Link to="/my-applications" className="text-gray-600 hover:text-orange-500 text-sm font-medium">{t.myApplications}</Link>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleLang}
                        className="text-xs font-bold border border-orange-400 text-orange-500 rounded-full px-3 py-1 hover:bg-orange-50 transition"
                    >
                        {lang === "hi" ? "EN" : "हि"}
                    </button>

                    {!user ? (
                        <div className="hidden md:flex items-center gap-2">
                            <Link to="/login" className="text-sm text-gray-600 hover:text-orange-500 font-medium">{t.login}</Link>
                            <Link to="/register" className="bg-orange-500 text-white text-sm px-4 py-2 rounded-full hover:bg-orange-600 transition">{t.register}</Link>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-3">
                            <Link to="/profile" className="flex items-center gap-1 text-sm text-gray-600 hover:text-orange-500">
                                {user.profile?.photo ? (
                                    <img src={user.profile.photo} className="w-8 h-8 rounded-full object-cover" alt="profile" />
                                ) : (
                                    <User size={20} />
                                )}
                                <span className="font-medium">{user.fullname?.split(" ")[0]}</span>
                            </Link>
                            <button onClick={logoutHandler} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600">
                                <LogOut size={16} />
                                {t.logout}
                            </button>
                        </div>
                    )}

                    <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-4">
                    <Link to="/jobs" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium">{t.jobs}</Link>
                    {user && user.role === "maalik" && (
                        <>
                            <Link to="/post-job" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium">{t.postJob}</Link>
                            <Link to="/my-jobs" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium">{t.myJobs}</Link>
                        </>
                    )}
                    {user && user.role === "kaamgar" && (
                        <Link to="/my-applications" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium">{t.myApplications}</Link>
                    )}
                    {!user ? (
                        <>
                            <Link to="/login" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium">{t.login}</Link>
                            <Link to="/register" onClick={() => setMenuOpen(false)} className="bg-orange-500 text-white text-center px-4 py-2 rounded-full">{t.register}</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/profile" onClick={() => setMenuOpen(false)} className="text-gray-700 font-medium">{t.profile}</Link>
                            <button onClick={() => { logoutHandler(); setMenuOpen(false) }} className="text-red-500 text-left font-medium">{t.logout}</button>
                        </>
                    )}
                </div>
            )}
        </nav>
    )
}

export default Navbar