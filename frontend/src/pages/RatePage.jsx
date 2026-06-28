import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLang } from '../context/LanguageContext.jsx'
import { RATING_API } from '../utils/constant.js'
import axios from 'axios'
import { toast } from 'sonner'
import Navbar from '../components/Navbar.jsx'
import { ArrowLeft, Star } from 'lucide-react'

const RatePage = () => {
    const { t } = useLang()
    const { applicationId } = useParams()
    const navigate = useNavigate()
    const [score, setScore] = useState(50)
    const [review, setReview] = useState("")
    const [loading, setLoading] = useState(false)

    const submitHandler = async () => {
        setLoading(true)
        try {
            const res = await axios.post(`${RATING_API}/give/${applicationId}`, { score, review }, { withCredentials: true })
            if (res.data.success) {
                toast.success(res.data.message)
                navigate(-1)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Rating dene mein problem aayi")
        } finally {
            setLoading(false)
        }
    }

    const getScoreColor = () => {
        if (score >= 75) return "text-green-500"
        if (score >= 50) return "text-orange-500"
        return "text-red-500"
    }

    const getScoreLabel = () => {
        if (score >= 80) return "Bahut Achha! 🌟"
        if (score >= 60) return "Theek Thak 👍"
        if (score >= 40) return "Average 😐"
        return "Thoda Kam 😕"
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-md mx-auto px-4 py-10">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-orange-500 mb-6 text-sm">
                    <ArrowLeft size={16} /> {t.back}
                </button>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Star size={22} className="text-orange-400" />
                        <h1 className="text-xl font-bold text-gray-800">{t.rateNow}</h1>
                    </div>

                    <div className="text-center mb-8">
                        <div className={`text-6xl font-bold mb-2 ${getScoreColor()}`}>{score}</div>
                        <div className="text-gray-400 text-sm">out of 100</div>
                        <div className="text-lg mt-2">{getScoreLabel()}</div>
                    </div>

                    <div className="mb-6">
                        <input
                            type="range"
                            min="1"
                            max="100"
                            value={score}
                            onChange={(e) => setScore(Number(e.target.value))}
                            className="w-full accent-orange-500"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>1</span>
                            <span>50</span>
                            <span>100</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="text-sm font-medium text-gray-600 mb-2 block">{t.giveReview}</label>
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            rows={3}
                            placeholder="Apna anubhav likhein... (optional)"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition resize-none"
                            maxLength={300}
                        />
                        <p className="text-xs text-gray-400 mt-1 text-right">{review.length}/300</p>
                    </div>

                    <button
                        onClick={submitHandler}
                        disabled={loading}
                        className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-60"
                    >
                        {loading ? t.loading : t.rateNow}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default RatePage