import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useLang } from '../context/LanguageContext.jsx'
import { JOB_API, JOB_CATEGORIES, CITIES, DISTRICTS } from '../utils/constant.js'
import axios from 'axios'
import { toast } from 'sonner'
import Navbar from '../components/Navbar.jsx'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'

const STEPS = ["Kaam ki jankari", "Location & Pay", "Contact"]

const PostJob = () => {
    const { t } = useLang()
    const navigate = useNavigate()
    const { user } = useSelector(store => store.auth)
    const [step, setStep] = useState(0)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        title: "",
        category: "",
        description: "",
        city: "",
        district: "",
        payType: "daily",
        salary: "",
        jobType: "Full Time",
        whatsapp: ""
    })

    const changeHandler = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const nextStep = () => {
        if (step === 0 && (!form.title || !form.category || !form.description)) {
            toast.error("Sabhi fields bharna zaroori hai")
            return
        }
        if (step === 1 && (!form.city || !form.district || !form.salary)) {
            toast.error("Sabhi fields bharna zaroori hai")
            return
        }
        setStep(step + 1)
    }

    const submitHandler = async () => {
        if (!form.whatsapp) {
            toast.error("WhatsApp number daalna zaroori hai")
            return
        }
        if (!user) {
            toast.error("Pehle login karein")
            navigate("/login")
            return
        }
        setLoading(true)
        try {
            const res = await axios.post(`${JOB_API}/post`, form, { withCredentials: true })
            if (res.data.success) {
                toast.success(res.data.message)
                navigate("/my-jobs")
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Job post karne mein problem aayi")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-xl mx-auto px-4 py-10">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">{t.postJob}</h1>

                <div className="flex items-center mb-8">
                    {STEPS.map((s, i) => (
                        <div key={i} className="flex items-center flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${i < step ? "bg-green-500 text-white" : i === step ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-400"}`}>
                                {i < step ? <Check size={14} /> : i + 1}
                            </div>
                            <div className="ml-2 text-xs text-gray-500 hidden sm:block">{s}</div>
                            {i < STEPS.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-2 ${i < step ? "bg-green-400" : "bg-gray-200"}`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    {step === 0 && (
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Job ka title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={changeHandler}
                                    placeholder="e.g. Driver chahiye, Cook chahiye"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">{t.category}</label>
                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={changeHandler}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition bg-white"
                                >
                                    <option value="">{t.selectCategory}</option>
                                    {JOB_CATEGORIES.map((c, i) => <option key={i} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Kaam ki jankari</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={changeHandler}
                                    rows={4}
                                    placeholder="Kya kaam karna hoga, timing kya hogi, koi experience chahiye?"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition resize-none"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">{t.jobType}</label>
                                <div className="flex gap-3">
                                    {["Full Time", "Part Time", "Work From Home"].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setForm({ ...form, jobType: type })}
                                            className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition ${form.jobType === type ? "bg-orange-500 text-white border-orange-500" : "text-gray-500 border-gray-200"}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="flex flex-col gap-4">
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
                                    <option value="">{t.district}</option>
                                    {DISTRICTS.map((d, i) => <option key={i} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Pay type</label>
                                <div className="flex gap-3">
                                    {["daily", "monthly"].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setForm({ ...form, payType: type })}
                                            className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition ${form.payType === type ? "bg-orange-500 text-white border-orange-500" : "text-gray-500 border-gray-200"}`}
                                        >
                                            {type === "daily" ? t.daily : t.monthly}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">
                                    {t.salary} (₹ {form.payType === "daily" ? t.perDay : t.perMonth})
                                </label>
                                <input
                                    type="number"
                                    name="salary"
                                    value={form.salary}
                                    onChange={changeHandler}
                                    placeholder={form.payType === "daily" ? "e.g. 500" : "e.g. 8000"}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition"
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col gap-4">
                            <div className="bg-orange-50 rounded-xl p-4 text-sm text-orange-700">
                                Job seekers aapko seedha WhatsApp pe contact karenge. Apna WhatsApp number daalna zaroori hai.
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">{t.whatsapp}</label>
                                <input
                                    type="tel"
                                    name="whatsapp"
                                    value={form.whatsapp}
                                    onChange={changeHandler}
                                    placeholder="10 digit WhatsApp number"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition"
                                />
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500">
                                <p className="font-semibold text-gray-700 mb-2">Job summary:</p>
                                <p>📌 {form.title}</p>
                                <p>🏷️ {form.category}</p>
                                <p>📍 {form.city}, {form.district}</p>
                                <p>💰 ₹{form.salary} {form.payType === "daily" ? t.perDay : t.perMonth}</p>
                                <p>⏰ {form.jobType}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 mt-6">
                        {step > 0 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="flex items-center gap-2 border border-gray-200 text-gray-500 px-5 py-3 rounded-xl text-sm hover:bg-gray-50 transition"
                            >
                                <ArrowLeft size={16} /> {t.back}
                            </button>
                        )}
                        {step < 2 ? (
                            <button
                                onClick={nextStep}
                                className="flex-1 flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
                            >
                                {t.next} <ArrowRight size={16} />
                            </button>
                        ) : (
                            <button
                                onClick={submitHandler}
                                disabled={loading}
                                className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-60"
                            >
                                {loading ? t.loading : "Job Post Karein ✓"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostJob