import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLang } from '../context/LanguageContext.jsx'
import { APPLICATION_API } from '../utils/constant.js'
import axios from 'axios'
import Navbar from '../components/Navbar.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Banknote, Shield } from 'lucide-react'

const MyApplications = () => {
    const { t } = useLang()
    const navigate = useNavigate()
    const { user } = useSelector(store => store.auth)
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!user) { navigate("/login"); return }
        const fetchApplications = async () => {
            setLoading(true)
            try {
                const res = await axios.get(`${APPLICATION_API}/my`, { withCredentials: true })
                if (res.data.success) setApplications(res.data.applications)
            } catch (error) { console.log(error) }
            finally { setLoading(false) }
        }
        fetchApplications()
    }, [])

    const statusColor = (status) => {
        if (status === "accepted") return "bg-green-50 text-green-600"
        if (status === "rejected") return "bg-red-50 text-red-500"
        return "bg-yellow-50 text-yellow-600"
    }

    const statusText = (status) => {
        if (status === "accepted") return t.accepted
        if (status === "rejected") return t.rejected
        return t.pending
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">{t.myApplications}</h1>
                {loading ? (
                    <div className="text-center py-20 text-gray-400">{t.loading}</div>
                ) : applications.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="mb-4">Abhi tak koi application nahi</p>
                        <Link to="/jobs" className="bg-orange-500 text-white px-6 py-3 rounded-full text-sm">Jobs dekhein</Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {applications.map((app) => (
                            <div key={app._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-gray-800">{app.job?.title}</h3>
                                        <p className="text-xs text-orange-500 mt-1">{app.job?.category}</p>
                                    </div>
                                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${statusColor(app.status)}`}>
                                        {statusText(app.status)}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                                    <span className="flex items-center gap-1"><MapPin size={14} className="text-orange-400" />{app.job?.city}</span>
                                    <span className="flex items-center gap-1"><Banknote size={14} className="text-orange-400" />₹{app.job?.salary} {app.job?.payType === "daily" ? t.perDay : t.perMonth}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <span>{t.postedBy}: {app.job?.postedBy?.fullname}</span>
                                        {app.job?.postedBy?.trustScore?.average > 0 && (
                                            <span className="flex items-center gap-1 text-orange-500">
                                                <Shield size={12} />
                                                {app.job.postedBy.trustScore.average}/100
                                            </span>
                                        )}
                                    </div>
                                    {app.status === "accepted" && !app.isRatedByKaamgar && (
                                        <Link to={`/rate/${app._id}`} className="bg-orange-500 text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-orange-600 transition">
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

export default MyApplications