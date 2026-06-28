import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setSearchQuery } from '../redux/jobSlice.js'
import { useLang } from '../context/LanguageContext.jsx'
import Navbar from '../components/Navbar.jsx'
import { Mic, Search, Briefcase, Shield, Zap } from 'lucide-react'
import { JOB_CATEGORIES } from '../utils/constant.js'

const Home = () => {
    const { t } = useLang()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [query, setQuery] = useState("")
    const [listening, setListening] = useState(false)

    const searchHandler = () => {
        dispatch(setSearchQuery(query))
        navigate("/jobs")
    }

    const voiceSearchHandler = () => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            alert("Aapka browser voice search support nahi karta")
            return
        }
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        const recognition = new SpeechRecognition()
        recognition.lang = 'hi-IN'
        recognition.interimResults = false
        recognition.maxAlternatives = 1
        setListening(true)
        recognition.start()
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript
            setQuery(transcript)
            setListening(false)
            dispatch(setSearchQuery(transcript))
            navigate("/jobs")
        }
        recognition.onerror = () => setListening(false)
        recognition.onend = () => setListening(false)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <section className="bg-white py-16 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <span className="inline-block bg-orange-50 text-orange-500 text-sm font-semibold px-4 py-1 rounded-full mb-4">
                        🇮🇳 Tier-3 & Tier-4 Cities Ka Job Portal
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
                        {t.heroTitle}
                    </h1>
                    <p className="text-gray-500 text-base md:text-lg mb-8">
                        {t.heroSubtitle}
                    </p>

                    <div className="flex items-center bg-white border-2 border-orange-400 rounded-full px-4 py-2 max-w-xl mx-auto shadow-sm gap-2">
                        <Search size={18} className="text-gray-400 shrink-0" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && searchHandler()}
                            placeholder={t.searchPlaceholder}
                            className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
                        />
                        <button
                            onClick={voiceSearchHandler}
                            className={`p-1 rounded-full ${listening ? "text-red-500 animate-pulse" : "text-gray-400 hover:text-orange-500"}`}
                            title={t.voiceSearch}
                        >
                            <Mic size={18} />
                        </button>
                        <button
                            onClick={searchHandler}
                            className="bg-orange-500 text-white text-sm px-4 py-2 rounded-full hover:bg-orange-600 transition shrink-0"
                        >
                            {t.browseJobs}
                        </button>
                    </div>
                </div>
            </section>

            <section className="py-10 px-4">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-xl font-bold text-gray-700 mb-5 text-center">{t.category}</h2>
                    <div className="flex flex-wrap justify-center gap-3">
                        {JOB_CATEGORIES.map((cat, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    dispatch(setSearchQuery(cat))
                                    navigate("/jobs")
                                }}
                                className="border border-orange-400 text-orange-500 text-sm px-4 py-2 rounded-full hover:bg-orange-500 hover:text-white transition"
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-10 px-4 bg-white">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <Zap size={32} className="text-orange-500 mx-auto mb-3" />
                        <h3 className="font-bold text-gray-700 mb-1">{t.applyWhatsApp}</h3>
                        <p className="text-gray-400 text-sm">Seedha WhatsApp pe apply karo, koi resume nahi chahiye</p>
                    </div>
                    <div className="text-center p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <Shield size={32} className="text-orange-500 mx-auto mb-3" />
                        <h3 className="font-bold text-gray-700 mb-1">{t.trustScore}</h3>
                        <p className="text-gray-400 text-sm">Dono taraf rating — bharosa banao, rishta banao</p>
                    </div>
                    <div className="text-center p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <Briefcase size={32} className="text-orange-500 mx-auto mb-3" />
                        <h3 className="font-bold text-gray-700 mb-1">{t.trustedBy}</h3>
                        <p className="text-gray-400 text-sm">Prayagraj, Kanpur, Varanasi aur hazaron shehar mein</p>
                    </div>
                </div>
            </section>

            <footer className="text-center py-6 text-gray-400 text-sm">
                © 2024 KaamConnect — Apni Naukri, Apna Shehar
            </footer>
        </div>
    )
}

export default Home