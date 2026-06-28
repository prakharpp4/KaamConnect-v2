import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '../redux/authSlice.js'
import { useLang } from '../context/LanguageContext.jsx'
import { AUTH_API, CITIES, DISTRICTS, RATING_API } from '../utils/constant.js'
import axios from 'axios'
import { toast } from 'sonner'
import Navbar from '../components/Navbar.jsx'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Shield, Edit2, Save, Star } from 'lucide-react'

const Profile = () => {
    const { t } = useLang()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector(store => store.auth)
    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [photo, setPhoto] = useState(null)
    const [ratings, setRatings] = useState([])
    const [form, setForm] = useState({
        fullname: user?.fullname || "",
        city: user?.city || "",
        district: user?.district || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(", ") || ""
    })

    useEffect(() => {
        if (!user) { navigate("/login"); return }
        const fetchRatings = async () => {
            try {
                const res = await axios.get(`${RATING_API}/user/${user._id}`)
                if (res.data.success) setRatings(res.data.ratings)
            } catch (error) { console.log(error) }
        }
        fetchRatings()
    }, [])

    const changeHandler = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const submitHandler = async () => {
        setLoading(true)
        try {
            const formData = new FormData()
            Object.keys(form).forEach(key => formData.append(key, form[key]))
            if (photo) formData.append("photo", photo)
            const res = await axios.put(`${AUTH_API}/profile/update`, formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" }
            })
            if (res.data.success) {
                dispatch(setUser(res.data.user))
                toast.success(res.data.message)
                setEditing(false)
            }
        } catch (error) {
            toast.error("Profile update karne mein problem aayi")
        } finally {
            setLoading(false)
        }
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                {user.profile?.photo ? (
                                    <img src={user.profile.photo} className="w-16 h-16 rounded-full object-cover" />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-2xl font-bold">
                                        {user.fullname?.[0]}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">{user.fullname}</h2>
                                <p className="text-sm text-gray-400">{user.city}, {user.district}</p>
                                <span className="text-xs bg-orange-50 text-orange-500 px-2 py-0.5 rounded-full font-medium">
                                    {user.role === "kaamgar" ? t.kaamgar : t.maalik}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setEditing(!editing)}
                            className="flex items-center gap-1 text-sm text-orange-500 border border-orange-300 px-3 py-1.5 rounded-full hover:bg-orange-50 transition"
                        >
                            <Edit2 size={14} /> {t.edit}
                        </button>
                    </div>

                    {user.trustScore?.average > 0 && (
                        <div className="flex items-center gap-3 bg-orange-50 rounded-xl px-4 py-3 mb-5">
                            <Shield size={20} className="text-orange-400" />
                            <div>
                                <p className="font-bold text-orange-500 text-lg">{user.trustScore.average}/100</p>
                                <p className="text-xs text-gray-400">{user.trustScore.totalRatings} {t.reviews}</p>
                            </div>
                            <p className="text-sm text-gray-500 ml-2">{t.trustScore}</p>
                        </div>
                    )}

                    {editing ? (
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">{t.name}</label>
                                <input type="text" name="fullname" value={form.fullname} onChange={changeHandler}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">{t.city}</label>
                                <select name="city" value={form.city} onChange={changeHandler}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition bg-white">
                                    {CITIES.map((c, i) => <option key={i} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">{t.district}</label>
                                <select name="district" value={form.district} onChange={changeHandler}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition bg-white">
                                    {DISTRICTS.map((d, i) => <option key={i} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">{t.bio}</label>
                                <textarea name="bio" value={form.bio} onChange={changeHandler} rows={3}
                                    placeholder="Apne baare mein likhein..."
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition resize-none" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">{t.skills} (comma se alag karein)</label>
                                <input type="text" name="skills" value={form.skills} onChange={changeHandler}
                                    placeholder="e.g. Driving, Cooking, Cleaning"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Photo badlein</label>
                                <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                            </div>
                            <button onClick={submitHandler} disabled={loading}
                                className="flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-60">
                                <Save size={16} /> {loading ? t.loading : t.save}
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {user.profile?.bio && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">{t.bio}</p>
                                    <p className="text-sm text-gray-700">{user.profile.bio}</p>
                                </div>
                            )}
                            {user.profile?.skills?.length > 0 && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-2">{t.skills}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {user.profile.skills.map((skill, i) => (
                                            <span key={i} className="text-xs bg-orange-50 text-orange-500 px-3 py-1 rounded-full">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-medium text-gray-500">{t.phone}</p>
                                <p className="text-sm text-gray-700">{user.phone}</p>
                            </div>
                        </div>
                    )}
                </div>

                {ratings.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Star size={18} className="text-orange-400" /> {t.reviews}
                        </h3>
                        <div className="flex flex-col gap-4">
                            {ratings.map((rating) => (
                                <div key={rating._id} className="border-b border-gray-50 pb-4 last:border-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-sm font-bold">
                                                {rating.ratedBy?.fullname?.[0]}
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">{rating.ratedBy?.fullname}</span>
                                        </div>
                                        <span className="font-bold text-orange-500">{rating.score}/100</span>
                                    </div>
                                    {rating.review && <p className="text-sm text-gray-500 ml-10">{rating.review}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Profile