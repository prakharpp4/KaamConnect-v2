import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LanguageContext.jsx'
import { AUTH_API, CITIES, DISTRICTS } from '../utils/constant.js'
import axios from 'axios'
import { toast } from 'sonner'
import Navbar from '../components/Navbar.jsx'

const Register = () => {
    const { t } = useLang()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [photo, setPhoto] = useState(null)
    const [form, setForm] = useState({
        fullname: "",
        phone: "",
        password: "",
        role: "kaamgar",
        city: "",
        district: ""
    })

    const changeHandler = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const formData = new FormData()
            Object.keys(form).forEach(key => formData.append(key, form[key]))
            if (photo) formData.append("photo", photo)

            const res = await axios.post(`${AUTH_API}/register`, formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" }
            })
            if (res.data.success) {
                toast.success(res.data.message)
                navigate("/login")
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration mein problem aayi")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex items-center justify-center px-4 py-12">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">{t.register}</h2>
                    <p className="text-gray-400 text-sm mb-6">Naya account banayein</p>

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
                            <label className="text-sm font-medium text-gray-600 mb-1 block">{t.name}</label>
                            <input
                                type="text"
                                name="fullname"
                                value={form.fullname}
                                onChange={changeHandler}
                                placeholder="Apna poora naam likhein"
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition"
                            />
                        </div>
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
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">{t.city}</label>
                            <select
                                name="city"
                                value={form.city}
                                onChange={changeHandler}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition bg-white"
                            >
                                <option value="">{t.selectCity}</option>
                                {CITIES.map((c, i) => <option key={i} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">{t.district}</label>
                            <select
                                name="district"
                                value={form.district}
                                onChange={changeHandler}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition bg-white"
                            >
                                <option value="">{t.selectDistrict || "जिला चुनें"}</option>
                                {DISTRICTS.map((d, i) => <option key={i} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600 mb-1 block">Photo (optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setPhoto(e.target.files[0])}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-60"
                        >
                            {loading ? t.loading : t.register}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-400 mt-6">
                        Pehle se account hai?{" "}
                        <Link to="/login" className="text-orange-500 font-semibold hover:underline">{t.login}</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register