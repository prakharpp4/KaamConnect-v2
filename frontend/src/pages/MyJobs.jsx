import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setMyJobs } from '../redux/jobSlice.js'
import { useLang } from '../context/LanguageContext.jsx'
import { JOB_API } from '../utils/constant.js'
import axios from 'axios'
import Navbar from '../components/Navbar.jsx'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, Banknote, Users, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

const MyJobs = () => {
    const { t } = useLang()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { myJobs } = useSelector(store => store.job)
    const { user } = useSelector(store => store.auth)

    useEffect(() => {
        if (!user) { navigate("/login"); return }
        const fetchMyJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API}/myjobs`, { withCredentials: true })
                if (res.data.success) dispatch(setMyJobs(res.data.jobs))
            } catch (error) { console.log(error) }
        }
        fetchMyJobs()
    }, [])

    const deleteHandler = async (jobId) => {
        if (!window.confirm("Kya aap sach mein yeh job delete karna chahte hain?")) return
        try {
            const res = await axios.delete(`${JOB_API}/${jobId}`, { withCredentials: true })
            if (res.data.success) {
                dispatch(setMyJobs(myJobs.filter(j => j._id !== jobId)))
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error("Delete karne mein problem aayi")
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">{t.myJobs}</h1>
                    <Link to="/post-job" className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm hover:bg-orange-600 transition">
                        + {t.postJob}
                    </Link>
                </div>
                {myJobs.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <p className="mb-4">{t.noJobs}</p>
                        <Link to="/post-job" className="bg-orange-500 text-white px-6 py-3 rounded-full text-sm">
                            Pehli job post karein
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {myJobs.map((job) => (
                            <div key={job._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-800">{job.title}</h3>
                                        <p className="text-xs text-orange-500 mt-1">{job.category}</p>
                                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                                            <span className="flex items-center gap-1"><MapPin size={14} className="text-orange-400" />{job.city}</span>
                                            <span className="flex items-center gap-1"><Banknote size={14} className="text-orange-400" />₹{job.salary} {job.payType === "daily" ? t.perDay : t.perMonth}</span>
                                            <span className="flex items-center gap-1"><Users size={14} className="text-orange-400" />{job.applications?.length || 0} {t.applicants}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => deleteHandler(job._id)} className="text-red-400 hover:text-red-500 ml-4">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div className="mt-4 flex gap-3">
                                    <Link to={`/job/${job._id}/applicants`} className="flex-1 text-center bg-orange-50 text-orange-500 py-2 rounded-xl text-sm font-semibold hover:bg-orange-100 transition">
                                        {t.applicants} dekhein
                                    </Link>
                                    <Link to={`/jobs/${job._id}`} className="flex-1 text-center border border-gray-200 text-gray-500 py-2 rounded-xl text-sm hover:bg-gray-50 transition">
                                        Preview
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyJobs