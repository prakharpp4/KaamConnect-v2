import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setSingleJob } from '../redux/jobSlice.js'
import { useLang } from '../context/LanguageContext.jsx'
import { JOB_API, APPLICATION_API } from '../utils/constant.js'
import axios from 'axios'
import Navbar from '../components/Navbar.jsx'
import { toast } from 'sonner'
import { MapPin, Banknote, Clock, MessageCircle, Users, ArrowLeft, Shield } from 'lucide-react'

const JobDetail = () => {
    const { t } = useLang()
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector(store => store.auth)
    const { singleJob } = useSelector(store => store.job)
    const [loading, setLoading] = useState(false)
    const [applied, setApplied] = useState(false)

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(`${JOB_API}/${id}`, { withCredentials: true })
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchJob()
    }, [id])

    const applyHandler = async () => {
        if (!user) {
            toast.error("Pehle login karein")
            navigate("/login")
            return
        }
        setLoading(true)
        try {
            const res = await axios.post(`${APPLICATION_API}/apply/${id}`, {}, { withCredentials: true })
            if (res.data.success) {
                setApplied(true)
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Apply karne mein problem aayi")
        } finally {
            setLoading(false)
        }
    }

    const whatsappHandler = () => {
        if (!singleJob) return
        const phone = singleJob.whatsapp.replace(/\D/g, '')
        const message = encodeURIComponent(
            `Namaskar! Main ${user?.fullname || "ek job seeker"} hoon.\n\nMujhe aapki yeh job mein interest hai:\n*${singleJob.title}*\n${singleJob.city}, ${singleJob.district}\n\nKya yeh job abhi available hai? Main kab aa sakta/sakti hoon?`
        )
        window.open(`https://wa.me/91${phone}?text=${message}`, '_blank')
    }

    if (!singleJob) return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="text-center py-20 text-gray-400">{t.loading}</div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-orange-500 mb-6 text-sm"
                >
                    <ArrowLeft size={16} /> {t.back}
                </button>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{singleJob.title}</h1>
                            <p className="text-orange-500 font-medium mt-1">{singleJob.category}</p>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${singleJob.jobType === "Full Time" ? "bg-green-50 text-green-600" : singleJob.jobType === "Part Time" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"}`}>
                            {singleJob.jobType}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-5">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <MapPin size={16} className="text-orange-400" />
                            {singleJob.city}, {singleJob.district}
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Banknote size={16} className="text-orange-400" />
                            ₹{singleJob.salary} {singleJob.payType === "daily" ? t.perDay : t.perMonth}
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Users size={16} className="text-orange-400" />
                            {singleJob.applications?.length || 0} {t.applicants}
                        </div>
                    </div>

                    <div className="border-t pt-4 mb-5">
                        <h3 className="font-semibold text-gray-700 mb-2">Kaam ki jankari</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{singleJob.description}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        {user?.role === "kaamgar" && (
                            <>
                                <button
                                    onClick={whatsappHandler}
                                    className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition"
                                >
                                    <MessageCircle size={18} />
                                    {t.applyWhatsApp}
                                </button>
                                <button
                                    onClick={applyHandler}
                                    disabled={loading || applied}
                                    className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-60"
                                >
                                    {applied ? "Applied ✓" : loading ? t.loading : "Portal pe Apply karein"}
                                </button>
                            </>
                        )}
                        {user?.role === "maalik" && singleJob.postedBy?._id === user._id && (
                            <button
                                onClick={() => navigate(`/job/${id}/applicants`)}
                                className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
                            >
                                {t.applicants} dekhein
                            </button>
                        )}
                        {!user && (
                            <button
                                onClick={() => navigate("/login")}
                                className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
                            >
                                Apply karne ke liye login karein
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="font-semibold text-gray-700 mb-4">{t.postedBy}</h3>
                    <div className="flex items-center gap-4">
                        {singleJob.postedBy?.profile?.photo ? (
                            <img src={singleJob.postedBy.profile.photo} className="w-14 h-14 rounded-full object-cover" />
                        ) : (
                            <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-xl font-bold">
                                {singleJob.postedBy?.fullname?.[0]}
                            </div>
                        )}
                        <div>
                            <p className="font-bold text-gray-800">{singleJob.postedBy?.fullname}</p>
                            <p className="text-sm text-gray-400">{singleJob.postedBy?.city}, {singleJob.postedBy?.district}</p>
                            {singleJob.postedBy?.trustScore?.average > 0 && (
                                <div className="flex items-center gap-1 mt-1">
                                    <Shield size={14} className="text-orange-400" />
                                    <span className="text-sm font-semibold text-orange-500">
                                        Trust Score: {singleJob.postedBy.trustScore.average}/100
                                    </span>
                                    <span className="text-xs text-gray-400">({singleJob.postedBy.trustScore.totalRatings} ratings)</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobDetail