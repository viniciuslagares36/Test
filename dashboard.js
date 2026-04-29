const { useState, useEffect, useMemo } = React;
const { motion, AnimatePresence, useScroll, useSpring, useTransform } = framerMotion;
const { Bus, Footprints, MapPin, Search, Train, Clock, ArrowRight } = lucideReact;

// Hook useTransportData
const useTransportData = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Simulação de API - Substitua pela URL real quando tiver
                // const response = await axios.get('https://api.transporte.df.gov.br/gtfs');
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                setData({
                    busLines: [
                        { id: '110.1', destination: 'Rodoviária do Plano Piloto', time: 3, line: '110.1' },
                        { id: '110.2', destination: 'W3 Sul - Via SIA', time: 8, line: '110.2' },
                        { id: '108.1', destination: 'L2 Norte - UnB', time: 12, line: '108.1' },
                        { id: '154.4', destination: 'Cruzeiro Novo', time: 5, line: '154.4' },
                        { id: '163.2', destination: 'Guará II - Via Estádio', time: 15, line: '163.2' },
                        { id: '0.100', destination: 'Setor Oeste - Via EPTG', time: 2, line: '0.100' },
                        { id: '0.111', destination: 'Taguatinga Centro', time: 7, line: '0.111' },
                    ],
                    metroLines: [
                        { id: 'Verde', destination: 'Terminal Ceilândia', time: 7, line: 'Verde' },
                        { id: 'Laranja', destination: 'Samambaia', time: 4, line: 'Laranja' },
                        { id: 'Verde', destination: 'Central', time: 2, line: 'Verde' },
                    ],
                    lastUpdate: new Date().toISOString()
                });
                setError(null);
            } catch (err) {
                setError('Erro ao carregar dados de transporte');
                console.error('API Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    return { data, loading, error };
};

const spring = { type: 'spring', stiffness: 100, damping: 20 };

const carouselImages = [
    {
        src: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1400&q=80',
        title: 'Eixo Monumental',
        subtitle: 'Mobilidade em sincronia com a arquitetura da cidade',
    },
    {
        src: 'https://images.unsplash.com/photo-1596229323364-0f5d8f6715f1?auto=format&fit=crop&w=1400&q=80',
        title: 'Congresso Nacional',
        subtitle: 'Linhas estratégicas conectando o coração cívico',
    },
    {
        src: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1400&q=80',
        title: 'Ponte JK',
        subtitle: 'Trajetos inteligentes entre lago e centro urbano',
    },
];

const transportModes = [
    { name: 'Ônibus', Icon: Bus, type: 'bus' },
    { name: 'Metrô', Icon: Train, type: 'metro' },
    { name: 'Pé', Icon: Footprints, type: 'walk' },
];

const VehicleList = ({ vehicles, type }) => {
    if (!vehicles || vehicles.length === 0) return null;
    
    return React.createElement(motion.div, {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: spring,
        className: "mt-4 space-y-2",
        children: [
            React.createElement("div", { key: "header", className: "flex items-center justify-between px-2 mb-3" },
                React.createElement("span", { className: "text-xs font-medium text-[#1d1d1f]/45 uppercase tracking-wide" },
                    `Próximos ${type === 'bus' ? 'Ônibus' : 'Trens'}`
                ),
                React.createElement("div", { className: "flex items-center gap-1.5" },
                    React.createElement("div", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" }),
                    React.createElement("span", { className: "text-[10px] font-medium text-emerald-600" }, "• Ao Vivo")
                )
            ),
            ...vehicles.map((vehicle, idx) => 
                React.createElement(motion.div, {
                    key: vehicle.id,
                    initial: { opacity: 0, x: -20 },
                    animate: { opacity: 1, x: 0 },
                    transition: { delay: idx * 0.05, ...spring },
                    className: "group flex items-center justify-between rounded-[1.5rem] border border-white/50 bg-white/40 px-4 py-3 hover:bg-white/60 transition-all",
                    children: [
                        React.createElement("div", { className: "flex items-center gap-3", key: "info" },
                            React.createElement("div", { className: "rounded-full bg-[#0066cc]/10 p-2" },
                                type === 'bus' ? React.createElement(Bus, { className: "h-4 w-4 text-[#0066cc]" }) : React.createElement(Train, { className: "h-4 w-4 text-[#0066cc]" })
                            ),
                            React.createElement("div", null,
                                React.createElement("p", { className: "text-sm font-semibold text-[#1d1d1f]" }, vehicle.line),
                                React.createElement("p", { className: "text-xs text-[#1d1d1f]/55" }, vehicle.destination)
                            )
                        ),
                        React.createElement("div", { className: "flex items-center gap-2", key: "time" },
                            React.createElement(Clock, { className: "h-3 w-3 text-[#1d1d1f]/40" }),
                            React.createElement("span", { className: "text-sm font-medium text-[#0066cc]" }, `${vehicle.time} min`),
                            React.createElement(ArrowRight, { className: "h-3 w-3 text-[#1d1d1f]/30 opacity-0 group-hover:opacity-100 transition-opacity" })
                        )
                    ]
                })
            )
        ]
    });
};

function Dashboard() {
    const [activeSlide, setActiveSlide] = useState(0);
    const [searchFocused, setSearchFocused] = useState(false);
    const [selectedMode, setSelectedMode] = useState(null);
    
    const { data, loading, error } = useTransportData();

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveSlide((prev) => (prev + 1) % carouselImages.length);
        }, 4500);
        return () => clearInterval(interval);
    }, []);

    const activeItem = useMemo(() => carouselImages[activeSlide], [activeSlide]);

    const handleModeSelect = (modeType) => {
        setSelectedMode(selectedMode === modeType ? null : modeType);
    };

    const getVehiclesByMode = () => {
        if (!data) return [];
        if (selectedMode === 'bus') return data.busLines || [];
        if (selectedMode === 'metro') return data.metroLines || [];
        return [];
    };

    return React.createElement("main", { 
        className: "min-h-screen bg-[#f5f5f7] text-[#1d1d1f] antialiased",
        style: { fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", letterSpacing: "-0.02em" }
    },
        React.createElement(motion.nav, {
            style: { 
                y: 0, 
                opacity: 1, 
                scale: 1 
            },
            className: "fixed inset-x-0 top-5 z-50 mx-auto flex w-[min(94%,72rem)] items-center justify-between rounded-[2.5rem] border border-white/60 bg-white/70 px-6 py-3 backdrop-blur-[20px]",
            children: [
                React.createElement("div", { className: "flex items-center gap-2 text-sm font-medium text-[#1d1d1f]/90", key: "logo" },
                    React.createElement(MapPin, { className: "h-4 w-4 text-[#0066cc]", strokeWidth: 1.5 }),
                    React.createElement("span", null, "LocalizaBus · Brasília")
                ),
                React.createElement("div", { className: "text-xs font-medium text-[#1d1d1f]/55", key: "title" }, "Dashboard")
            ]
        }),
        React.createElement("section", { className: "relative mx-auto flex w-[min(94%,72rem)] flex-col gap-12 px-2 pb-16 pt-36" },
            React.createElement(motion.div, {
                animate: { scale: searchFocused ? 1.03 : 1, filter: searchFocused ? 'saturate(1.05)' : 'saturate(1)' },
                transition: spring,
                className: "absolute inset-x-2 top-32 -z-10 h-[22rem] overflow-hidden rounded-[2.5rem] border border-white/50 bg-white/40 backdrop-blur-[20px]",
                children: [
                    React.createElement("img", { src: activeItem.src, alt: activeItem.title, className: "h-full w-full object-cover", key: "img" }),
                    React.createElement("div", { className: "absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-[#0066cc]/20", key: "gradient" })
                ]
            }),
            React.createElement(motion.div, {
                animate: { opacity: searchFocused ? 0.2 : 1, y: searchFocused ? -8 : 0 },
                transition: spring,
                className: "space-y-5 px-5 pt-8",
                children: [
                    React.createElement("p", { className: "text-xs uppercase tracking-[0.18em] text-[#1d1d1f]/45", key: "badge" }, "Mobilidade Inteligente"),
                    React.createElement("h1", { className: "max-w-2xl text-4xl font-semibold leading-tight md:text-6xl", key: "title" },
                        "Descubra o melhor trajeto em Brasília com fluidez iOS."
                    )
                ]
            }),
            React.createElement(motion.div, {
                animate: { y: searchFocused ? -10 : 0, scale: searchFocused ? 1.02 : 1 },
                transition: spring,
                className: "mx-auto w-full max-w-3xl rounded-[2.5rem] border border-white/60 bg-white/70 p-4 backdrop-blur-[20px]",
                children: React.createElement("div", { className: "flex items-center gap-3 rounded-[2rem] bg-[#f5f5f7] px-5 py-4" },
                    React.createElement(Search, { className: "h-5 w-5 text-[#0066cc]", strokeWidth: 1.5 }),
                    React.createElement("input", {
                        type: "text",
                        placeholder: "Pesquisar origem, destino ou parada",
                        onFocus: () => setSearchFocused(true),
                        onBlur: () => setSearchFocused(false),
                        className: "w-full bg-transparent text-base text-[#1d1d1f] placeholder:text-[#1d1d1f]/45 focus:outline-none"
                    })
                )
            }),
            React.createElement("section", { className: "grid gap-8 lg:grid-cols-[1.5fr_1fr]" },
                React.createElement("div", { className: "relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/70 p-4 backdrop-blur-[20px]" },
                    React.createElement("div", { className: "relative h-[18rem] overflow-hidden rounded-[2rem]" },
                        React.createElement(AnimatePresence, { mode: "wait" },
                            React.createElement(motion.img, {
                                key: activeItem.src,
                                src: activeItem.src,
                                alt: activeItem.title,
                                initial: { opacity: 0, scale: 1 },
                                animate: { opacity: 1, scale: 1.05 },
                                exit: { opacity: 0, scale: 1 },
                                transition: { duration: 0.9, ease: 'easeOut' },
                                className: "absolute inset-0 h-full w-full object-cover"
                            })
                        ),
                        React.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" })
                    ),
                    React.createElement("div", { className: "mt-5 space-y-2 px-2" },
                        React.createElement(AnimatePresence, { mode: "wait" },
                            React.createElement(motion.div, {
                                key: activeItem.title,
                                initial: { opacity: 0, y: 16 },
                                animate: { opacity: 1, y: 0 },
                                exit: { opacity: 0, y: -12 },
                                transition: spring,
                                children: [
                                    React.createElement("h2", { className: "text-2xl font-semibold", key: "title" }, activeItem.title),
                                    React.createElement("p", { className: "text-sm text-[#1d1d1f]/62", key: "subtitle" }, activeItem.subtitle)
                                ]
                            })
                        )
                    )
                ),
                React.createElement("aside", { className: "rounded-[2.5rem] border border-white/60 bg-white/70 p-6 backdrop-blur-[20px]" },
                    React.createElement("div", { className: "flex items-center justify-between mb-2" },
                        React.createElement("h3", { className: "text-lg font-semibold" }, "Modalidades"),
                        !loading && data && React.createElement("div", { className: "flex items-center gap-1.5" },
                            React.createElement("div", { className: "h-2 w-2 rounded-full bg-emerald-500 animate-pulse" }),
                            React.createElement("span", { className: "text-[11px] font-medium text-emerald-600 tracking-wide" }, "• Ao Vivo")
                        )
                    ),
                    React.createElement("p", { className: "text-sm text-[#1d1d1f]/58" }, "Escolha como deseja se deslocar agora."),
                    loading ? 
                        React.createElement("div", { className: "mt-6 space-y-3" },
                            [1,2,3].map(i => 
                                React.createElement("div", { key: i, className: "animate-pulse flex items-center justify-between rounded-[2rem] border border-white/70 bg-[#f5f5f7] px-5 py-4" },
                                    React.createElement("div", { className: "h-4 w-20 rounded-lg bg-gray-300/60" }),
                                    React.createElement("div", { className: "h-5 w-5 rounded-lg bg-gray-300/60" })
                                )
                            )
                        ) :
                        React.createElement("div", { className: "mt-6 space-y-3" },
                            transportModes.map(({ name, Icon, type }) => 
                                React.createElement("div", { key: name },
                                    React.createElement(motion.button, {
                                        onClick: () => handleModeSelect(type),
                                        whileHover: { scale: 1.02, y: -2 },
                                        whileTap: { scale: 0.98 },
                                        transition: spring,
                                        className: `w-full flex items-center justify-between rounded-[2rem] border px-5 py-4 text-left transition-all ${selectedMode === type ? 'border-[#0066cc]/30 bg-[#0066cc]/5' : 'border-white/70 bg-[#f5f5f7]'}`,
                                        children: [
                                            React.createElement("span", { className: "text-sm font-medium", key: "name" }, name),
                                            React.createElement(Icon, { className: "h-5 w-5 text-[#0066cc]", strokeWidth: 1.5, key: "icon" })
                                        ]
                                    }),
                                    selectedMode === type && React.createElement(AnimatePresence, { mode: "wait" },
                                        getVehiclesByMode().length > 0 && React.createElement(VehicleList, { vehicles: getVehiclesByMode(), type: type })
                                    )
                                )
                            )
                        ),
                    error && !loading && React.createElement(motion.div, {
                        initial: { opacity: 0 },
                        animate: { opacity: 1 },
                        className: "mt-4 rounded-xl bg-red-50/80 p-3 text-center text-xs text-red-600",
                        children: `⚠️ ${error}`
                    })
                )
            )
        )
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(Dashboard));