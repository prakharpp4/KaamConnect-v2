import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useLang } from '../context/LanguageContext.jsx'
import { APPLICATION_API } from '../utils/constant.js'
import axios from 'axios'
import Navbar from '../components/Navbar.jsx'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Shield, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

const JobApplicants = () => {
    const { t } = useLang()
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useSelector(store => store.auth)
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!user) { navigate("/login"); return }
        const fetchApplicants = async () => {
            setLoading(true)
            try {
                const res = await axios.get(`${APPLICATION_API}/job/${id}`, { withCredentials: true })
                if (res.data.success) setApplications(res.data.applications)
            } catch (error) { console.log(error) }
            finally { setLoading(false) }
        }
        fetchApplicants()
    }, [])

    const updateStatus = async (appId, status) => {
        try {
            const res = await axios.put(`${APPLICATION_API}/status/${appId}`, { status }, { withCredentials: true })
            if (res.data.success) {
                setApplications(applications.map(a => a._id === appId ? { ...a, status } : a))
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error("Status update karne mein problem aayi")
        }
    }

    const statusColor = (status) => {
        if (status === "accepted") return "bg-green-50 text-green-600"
        if (status === "rejected") return "bg-red-50 text-red-500"
        return "bg-yellow-50 text-yellow-600"
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-orange-500 mb-6 text-sm">
                    <ArrowLeft size={16} /> {t.back}
                </button>
                <h1 className="text-2xl font-bold text-gray-800 mb-6">{t.applicants}</h1>
                {loading ? (
                    <div className="text-center py-20 text-gray-400">{t.loading}</div>
                ) : applications.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">Abhi tak koi applicant nahi</div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {applications.map((app) => (
                            <div key={app._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        {app.applicant?.profile?.photo ? (
                                            <img src={app.applicant.profile.photo} className="w-12 h-12 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-lg">
                                                {app.applicant?.fullname?.[0]}
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-bold text-gray-800">{app.applicant?.fullname}</h3>
                                            <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                                                <span className="flex items-center gap-1"><MapPin size={12} />{app.applicant?.city}</span>
                                                <span className="flex items-center gap-1"><Phone size={12} />{app.applicant?.phone}</span>
                                            </div>
                                            {app.applicant?.trustScore?.average > 0 && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Shield size={12} className="text-orange-400" />
                                                    <span className="text-xs text-orange-500 font-semibold">Trust Score: {app.applicant.trustScore.average}/100</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${statusColor(app.status)}`}>
                                        {app.status}
                                    </span>
                                </div>
                                {app.applicant?.profile?.bio && (
                                    <p className="text-sm text-gray-500 mb-4 bg-gray-50 rounded-xl px-4 py-3">{app.applicant.profile.bio}</p>
                                )}
                                {app.applicant?.profile?.skills?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {app.applicant.profile.skills.map((skill, i) => (
                                            <span key={i} className="text-xs bg-orange-50 text-orange-500 px-3 py-1 rounded-full">{skill}</span>
                                        ))}
                                    </div>
                                )}
                                <div className="flex gap-3">
                                    {app.status === "pending" && (
                                        <>
                                            <button
                                                onClick={() => updateStatus(app._id, "accepted")}
                                                className="flex-1 bg-green-500 text-white py-2 rounded-xl text-sm font-semibold hover:bg-green-600 transition"
                                            >
                                                {t.accepted}
                                            </button>
                                            <button
                                                onClick={() => updateStatus(app._id, "rejected")}
                                                className="flex-1 bg-red-50 text-red-500 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 transition"
                                            >
                                                {t.rejected}
                                            </button>
                                        </>
                                    )}
                                    {app.status === "accepted" && !app.isRatedByMaalik && (
                                        <Link to={`/rate/${app._id}`} className="flex-1 text-center bg-orange-500 text-white py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition">
                                            {t.rateNow}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default JobApplicants