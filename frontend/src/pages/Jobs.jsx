import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setAllJobs, setSearchQuery } from '../redux/jobSlice.js'
import { useLang } from '../context/LanguageContext.jsx'
import { JOB_API } from '../utils/constant.js'
import { CITIES, JOB_CATEGORIES } from '../utils/constant.js'
import axios from 'axios'
import Navbar from '../components/Navbar.jsx'
import { Link } from 'react-router-dom'
import { MapPin, Clock, Banknote, Filter, X } from 'lucide-react'

const Jobs = () => {
    const { t } = useLang()
    const dispatch = useDispatch()
    const { allJobs, searchQuery } = useSelector(store => store.job)
    const [loading, setLoading] = useState(false)
    const [showFilter, setShowFilter] = useState(false)
    const [filters, setFilters] = useState({
        city: "",
        category: "",
        jobType: "",
        payType: ""
    })

    const fetchJobs = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (filters.city) params.append("city", filters.city)
            if (filters.category) params.append("category", filters.category)
            if (filters.jobType) params.append("jobType", filters.jobType)
            if (filters.payType) params.append("payType", filters.payType)
            if (searchQuery) params.append("keyword", searchQuery)

            const res = await axios.get(`${JOB_API}/all?${params.toString()}`, { withCredentials: true })
            if (res.data.success) {
                dispatch(setAllJobs(res.data.jobs))
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchJobs()
    }, [filters, searchQuery])

    const clearFilters = () => {
        setFilters({ city: "", category: "", jobType: "", payType: "" })
        dispatch(setSearchQuery(""))
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">{t.jobs}
                        <span className="ml-2 text-sm font-normal text-gray-400">({allJobs.length} jobs)</span>
                    </h1>
                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className="flex items-center gap-2 border border-orange-400 text-orange-500 px-4 py-2 rounded-full text-sm hover:bg-orange-50 transition"
                    >
                        <Filter size={16} />
                        {t.category}
                    </button>
                </div>

                {showFilter && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <select
                            value={filters.city}
                            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                            className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400 bg-white"
                        >
                            <option value="">{t.selectCity}</option>
                            {CITIES.map((c, i) => <option key={i} value={c}>{c}</option>)}
                        </select>
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400 bg-white"
                        >
                            <option value="">{t.selectCategory}</option>
                            {JOB_CATEGORIES.map((c, i) => <option key={i} value={c}>{c}</option>)}
                        </select>
                        <select
                            value={filters.jobType}
                            onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                            className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400 bg-white"
                        >
                            <option value="">{t.selectJobType}</option>
                            <option value="Full Time">{t.fullTime}</option>
                            <option value="Part Time">{t.partTime}</option>
                            <option value="Work From Home">{t.wfh}</option>
                        </select>
                        <select
                            value={filters.payType}
                            onChange={(e) => setFilters({ ...filters, payType: e.target.value })}
                            className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-400 bg-white"
                        >
                            <option value="">{t.selectPayType}</option>
                            <option value="daily">{t.daily}</option>
                            <option value="monthly">{t.monthly}</option>
                        </select>
                        <button
                            onClick={clearFilters}
                            className="col-span-2 md:col-span-4 flex items-center justify-center gap-2 text-sm text-red-400 hover:text-red-500"
                        >
                            <X size={14} /> Clear filters
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-20 text-gray-400">{t.loading}</div>
                ) : allJobs.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">{t.noJobs}</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {allJobs.map((job) => (
                            <Link to={`/jobs/${job._id}`} key={job._id}>
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-orange-200 transition">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-base">{job.title}</h3>
                                            <p className="text-xs text-orange-500 font-medium mt-1">{job.category}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${job.jobType === "Full Time" ? "bg-green-50 text-green-600" : job.jobType === "Part Time" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"}`}>
                                            {job.jobType}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-2 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <MapPin size={14} className="text-orange-400" />
                                            {job.city}, {job.district}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Banknote size={14} className="text-orange-400" />
                                            ₹{job.salary} {job.payType === "daily" ? t.perDay : t.perMonth}
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {job.postedBy?.profile?.photo ? (
                                                <img src={job.postedBy.profile.photo} className="w-7 h-7 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-xs font-bold">
                                                    {job.postedBy?.fullname?.[0]}
                                                </div>
                                            )}
                                            <span className="text-xs text-gray-400">{job.postedBy?.fullname}</span>
                                        </div>
                                        {job.postedBy?.trustScore?.average > 0 && (
                                            <span className="text-xs bg-orange-50 text-orange-500 px-2 py-1 rounded-full font-semibold">
                                                ⭐ {job.postedBy.trustScore.average}/100
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Jobs