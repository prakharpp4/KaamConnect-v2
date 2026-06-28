import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/authSlice.js'
import { useLang } from '../context/LanguageContext.jsx'
import { AUTH_API } from '../utils/constant.js'
import axios from 'axios'
import { toast } from 'sonner'
import Navbar from '../components/Navbar.jsx'

const Login = () => {
    const { t } = useLang()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        phone: "",
        password: "",
        role: "kaamgar"
    })

    const changeHandler = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await axios.post(`${AUTH_API}/login`, form, { withCredentials: true })
            if (res.data.success) {
                dispatch(setUser(res.data.user))
                toast.success(res.data.message)
                navigate("/")
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login mein problem aayi")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex items-center justify-center px-4 py-16">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">{t.login}</h2>
                    <p className="text-gray-400 text-sm mb-6">Apne account mein login karein</p>

                    <div className="flex gap-3 mb-6">
                        <button
                            onClick={() => setForm({ ...form, role: "kaamgar" })}
                            className={`flex-1 py-2 rounded-full text-sm font-semibold border transition ${form.role === "kaamgar" ? "bg-orange-500 text-white border-orange-500" : "text-gray-500 border-gray-300"}`}
                        >
                            {t.kaamgar}
                        </button>
                        <button
                            onClick={() => setForm({ ...form, role: "maalik" })}
                            className={`flex-1 py-2 rounded-full text-sm font-semibold border transition ${form.role === "maalik" ? "bg-orange-500 text-white border-orange-500" : "text-gray-500 border-gray-300"}`}
                        >
                            {t.maalik}
                        </button>
                    </div>

                    <form onSubmit={submitHandler} className="flex flex-col gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">{t.phone}</label>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={changeHandler}
                                placeholder="10 digit phone number"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">{t.password}</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={changeHandler}
                                placeholder="••••••••"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-60"
                        >
                            {loading ? t.loading : t.login}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-400 mt-6">
                        Account nahi hai?{" "}
                        <Link to="/register" className="text-orange-500 font-semibold hover:underline">{t.register}</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login