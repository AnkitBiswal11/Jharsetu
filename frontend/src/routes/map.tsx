import { useEffect, useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { 
  Layers, 
  ExternalLink, 
  Crosshair, 
  Flame, 
  Compass, 
  TrendingUp, 
  Radio, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  MapPin, 
  Building2, 
  Coins,
  Video,
  Sparkles,
  ShieldCheck,
  Calendar,
  Eye,
  Tag,
  Play,
  Users,
  GraduationCap,
  UploadCloud,
  X,
  CheckCircle2,
  FileVideo,
  Lock,
  Activity,
  ArrowRight
} from "lucide-react";

export const Route = createFileRoute("/map")({
  component: GeospatialMapPage,
});

export interface DistrictCluster {
  district: string;
  lat: number;
  lng: number;
  problems: number;
  active_projects: number;
  csr_funding_cr: number;
  primary_domain: string;
  intensity: "CRITICAL" | "HIGH" | "MODERATE";
}

export interface ShowcaseVideo {
  id: string;
  title: string;
  category: "CITIZEN_GRIEVANCE" | "UNIVERSITY_PROTOTYPE" | "CSR_IMPACT";
  district: string;
  submittedBy: string;
  date: string;
  duration: string;
  views: number;
  verified: boolean;
  thumbnailUrl: string;
  type: "embed" | "file";
  embedUrl?: string | undefined;
  fileUrl?: string | undefined;
  summary: string;
}

const DISTRICT_METRICS: DistrictCluster[] = [
  { district: "Ranchi", lat: 23.3441, lng: 85.3096, problems: 19, active_projects: 8, csr_funding_cr: 1.45, primary_domain: "Clean Energy", intensity: "HIGH" },
  { district: "Palamu", lat: 24.0373, lng: 84.0722, problems: 24, active_projects: 6, csr_funding_cr: 0.85, primary_domain: "Water Resources", intensity: "CRITICAL" },
  { district: "Khunti", lat: 23.0725, lng: 85.2798, problems: 16, active_projects: 5, csr_funding_cr: 0.65, primary_domain: "Tribal Livelihood", intensity: "HIGH" },
  { district: "Dhanbad", lat: 23.7957, lng: 86.4304, problems: 21, active_projects: 9, csr_funding_cr: 1.90, primary_domain: "Infrastructure", intensity: "CRITICAL" },
  { district: "East Singhbhum", lat: 22.8046, lng: 86.2029, problems: 18, active_projects: 7, csr_funding_cr: 2.10, primary_domain: "Water Resources", intensity: "HIGH" },
  { district: "West Singhbhum", lat: 22.5600, lng: 85.8100, problems: 15, active_projects: 5, csr_funding_cr: 0.90, primary_domain: "Tribal Livelihood", intensity: "HIGH" },
  { district: "Gumla", lat: 23.0435, lng: 84.5414, problems: 14, active_projects: 4, csr_funding_cr: 0.45, primary_domain: "Rural Healthcare", intensity: "MODERATE" },
  { district: "Simdega", lat: 22.6162, lng: 84.5085, problems: 11, active_projects: 3, csr_funding_cr: 0.35, primary_domain: "Agriculture & Soil", intensity: "MODERATE" },
  { district: "Sahibganj", lat: 25.2425, lng: 87.6444, problems: 13, active_projects: 4, csr_funding_cr: 0.55, primary_domain: "Clean Energy", intensity: "MODERATE" },
  { district: "Bokaro", lat: 23.6693, lng: 86.1511, problems: 15, active_projects: 5, csr_funding_cr: 1.20, primary_domain: "Infrastructure", intensity: "HIGH" },
  { district: "Hazaribagh", lat: 23.9925, lng: 85.3637, problems: 17, active_projects: 6, csr_funding_cr: 0.95, primary_domain: "Agriculture & Soil", intensity: "HIGH" },
  { district: "Deoghar", lat: 24.4826, lng: 86.6997, problems: 12, active_projects: 4, csr_funding_cr: 0.70, primary_domain: "Rural Healthcare", intensity: "MODERATE" },
  { district: "Giridih", lat: 24.1895, lng: 86.3045, problems: 22, active_projects: 7, csr_funding_cr: 1.15, primary_domain: "Tribal Livelihood", intensity: "CRITICAL" },
  { district: "Dumka", lat: 24.2685, lng: 87.2483, problems: 14, active_projects: 5, csr_funding_cr: 0.60, primary_domain: "Clean Energy", intensity: "MODERATE" },
  { district: "Garhwa", lat: 24.1610, lng: 83.8070, problems: 18, active_projects: 5, csr_funding_cr: 0.75, primary_domain: "Water Resources", intensity: "HIGH" },
  { district: "Chatra", lat: 24.2120, lng: 84.8710, problems: 14, active_projects: 4, csr_funding_cr: 0.45, primary_domain: "Rural Healthcare", intensity: "MODERATE" },
  { district: "Koderma", lat: 24.4674, lng: 85.5939, problems: 12, active_projects: 3, csr_funding_cr: 0.50, primary_domain: "Infrastructure", intensity: "MODERATE" },
  { district: "Godda", lat: 24.8267, lng: 87.2144, problems: 11, active_projects: 3, csr_funding_cr: 0.40, primary_domain: "Agriculture & Soil", intensity: "MODERATE" },
  { district: "Pakur", lat: 24.6340, lng: 87.8490, problems: 10, active_projects: 3, csr_funding_cr: 0.35, primary_domain: "Tribal Livelihood", intensity: "MODERATE" },
  { district: "Jamtara", lat: 23.9631, lng: 86.8029, problems: 16, active_projects: 4, csr_funding_cr: 0.50, primary_domain: "Infrastructure", intensity: "HIGH" },
  { district: "Ramgarh", lat: 23.6332, lng: 85.5149, problems: 14, active_projects: 4, csr_funding_cr: 0.80, primary_domain: "Clean Energy", intensity: "MODERATE" },
  { district: "Lohardaga", lat: 23.4419, lng: 84.6835, problems: 9, active_projects: 3, csr_funding_cr: 0.30, primary_domain: "Agriculture & Soil", intensity: "MODERATE" },
  { district: "Latehar", lat: 23.7441, lng: 84.5022, problems: 13, active_projects: 4, csr_funding_cr: 0.40, primary_domain: "Tribal Livelihood", intensity: "MODERATE" },
  { district: "Seraikela Kharsawan", lat: 22.7006, lng: 85.9298, problems: 13, active_projects: 4, csr_funding_cr: 0.85, primary_domain: "Infrastructure", intensity: "MODERATE" }
];

// Fallback baseline for live citizen telemetry
const FALLBACK_LIVE_SUBMISSIONS = [
  {
    id: 1,
    tracking_id: "JS-26043-0117",
    title: "Groundwater Fluoride Saturation in Borewells",
    district: "Palamu",
    domain: "Water Resources",
    status: "VERIFIED"
  },
  {
    id: 2,
    tracking_id: "JS-26043-0142",
    title: "Lac Tree Parasitic Infestation & Thermal Scorch",
    district: "Khunti",
    domain: "Tribal Livelihood",
    status: "UNDER_CAPSTONE_R&D"
  },
  {
    id: 3,
    tracking_id: "JS-26043-0188",
    title: "Abandoned Open-Cast Seam Subsidence Warning",
    district: "Dhanbad",
    domain: "Infrastructure",
    status: "VERIFIED"
  }
];

// Curated Project Demonstrations masked as direct state telemetry feeds
const PROJECT_VIDEOS: ShowcaseVideo[] = [
  {
    id: "vid-1",
    title: "Rural Solar Micro Grid — 10kW / 20kWh On-Off Grid System Layout",
    category: "UNIVERSITY_PROTOTYPE",
    district: "Latehar",
    submittedBy: "BIT Mesra (Dept of Electrical & Electronics)",
    date: "14 Sep 2026",
    duration: "Live Feed",
    views: 1206,
    verified: true,
    thumbnailUrl: "https://img.youtube.com/vi/BbL7CflNo7s/hqdefault.jpg",
    type: "embed",
    embedUrl: "https://www.youtube-nocookie.com/embed/BbL7CflNo7s?autoplay=0&controls=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0",
    summary: "Hardware and battery wiring demonstration of a 10kW solar system and 20kWh battery storage deployment for rural electrification."
  },
  {
    id: "vid-2",
    title: "Groundwater Filtration & Tube Well Fluoride Containment Audit",
    category: "CITIZEN_GRIEVANCE",
    district: "Palamu",
    submittedBy: "Satbarwa Gram Panchayat",
    date: "08 Sep 2026",
    duration: "Live Feed",
    views: 389800,
    verified: true,
    thumbnailUrl: "https://img.youtube.com/vi/YCEbiUVNa7Y/hqdefault.jpg",
    type: "embed",
    embedUrl: "https://www.youtube-nocookie.com/embed/YCEbiUVNa7Y?autoplay=0&controls=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0",
    summary: "Field verification detailing natural multi-tier sand, gravel, and activated charcoal filtration layers to eliminate precipitates from drinking water."
  },
  {
    id: "vid-3",
    title: "AgriBot: Automated Smart Agro-Processing & Farming Robot Trial",
    category: "CSR_IMPACT",
    district: "East Singhbhum",
    submittedBy: "Tata Steel Foundation (Schedule VII)",
    date: "01 Sep 2026",
    duration: "Live Feed",
    views: 910,
    verified: true,
    thumbnailUrl: "https://img.youtube.com/vi/8X9xEp92OI0/hqdefault.jpg",
    type: "embed",
    embedUrl: "https://www.youtube-nocookie.com/embed/8X9xEp92OI0?autoplay=0&controls=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0",
    summary: "Live trial of automated multi-function AgriBot performing precision seed drilling and automated water spraying across farming tracts."
  }
];

const JHARKHAND_BOUNDS: [[number, number], [number, number]] = [
  [21.98, 83.32],
  [25.35, 87.92],
];

const JHARKHAND_OUTLINE_COORDS: [number, number][] = [
  [24.32, 83.33], [24.42, 83.78], [24.58, 84.35], [24.78, 84.95],
  [24.60, 85.65], [24.82, 86.35], [24.55, 87.05], [25.20, 87.50],
  [25.35, 87.88], [24.80, 87.95], [24.25, 87.60], [23.95, 86.95],
  [23.75, 86.85], [23.38, 86.50], [22.88, 86.72], [22.50, 86.60],
  [22.25, 85.85], [21.98, 85.35], [22.28, 84.65], [22.60, 84.18],
  [23.15, 84.10], [23.75, 83.55], [24.32, 83.33]
];

const SURROUNDING_MASK: [number, number][][] = [
  [
    [-90, -180],
    [-90, 180],
    [90, 180],
    [90, -180],
    [-90, -180]
  ],
  JHARKHAND_OUTLINE_COORDS
];

export function GeospatialMapPage() {
  const [clusters] = useState<DistrictCluster[]>(DISTRICT_METRICS);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictCluster>(DISTRICT_METRICS[1]!);
  const [liveSubmissions, setLiveSubmissions] = useState<any[]>(FALLBACK_LIVE_SUBMISSIONS);
  
  // Video Section State
  const [videos, setVideos] = useState<ShowcaseVideo[]>(PROJECT_VIDEOS);
  const [activeTab, setActiveTab] = useState<"ALL" | "CITIZEN_GRIEVANCE" | "UNIVERSITY_PROTOTYPE" | "CSR_IMPACT">("ALL");
  const [activeVideo, setActiveVideo] = useState<ShowcaseVideo>(PROJECT_VIDEOS[0]!);

  // Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<"CITIZEN_GRIEVANCE" | "UNIVERSITY_PROTOTYPE" | "CSR_IMPACT">("CITIZEN_GRIEVANCE");
  const [newDistrict, setNewDistrict] = useState("Ranchi");
  const [newSubmittedBy, setNewSubmittedBy] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [uploadedFilePreview, setUploadedFilePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredVideos = activeTab === "ALL" 
    ? videos 
    : videos.filter((v) => v.category === activeTab);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any | null>(null);
  const leafletLibRef = useRef<any | null>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const circlesRef = useRef<{ [key: string]: any }>({});
  const liveMarkersRef = useRef<any[]>([]);

  // Asynchronously fetch live telemetry from FastAPI backend
  useEffect(() => {
    const fetchLiveSubmissions = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/problems");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setLiveSubmissions(data);
          }
        }
      } catch (err) {
        console.warn("FastAPI offline, retaining baseline telemetry dataset", err);
      }
    };

    fetchLiveSubmissions();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current || mapInstanceRef.current) return;

    let isMounted = true;

    Promise.all([
      import("leaflet"),
      import("leaflet/dist/leaflet.css"),
    ]).then(([L]) => {
      if (!isMounted || !mapContainerRef.current || mapInstanceRef.current) return;

      leafletLibRef.current = L;

      const map = L.map(mapContainerRef.current, {
        maxBounds: [
          [21.60, 82.80],
          [25.80, 88.50],
        ],
        maxBoundsViscosity: 1.0,
        minZoom: 7,
        maxZoom: 11,
        zoomControl: false,
        attributionControl: false,
      });

      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 16 }
      ).addTo(map);

      L.polygon(SURROUNDING_MASK, {
        color: "#0b1220",
        weight: 2,
        fillColor: "#080e1b",
        fillOpacity: 0.96,
        interactive: false,
      }).addTo(map);

      L.polygon(JHARKHAND_OUTLINE_COORDS, {
        color: "#14b8a6",
        weight: 3,
        opacity: 0.95,
        fillColor: "#0d9488",
        fillOpacity: 0.12,
        dashArray: "6, 8",
      }).addTo(map);

      fetch("https://raw.githubusercontent.com/geohacker/india/master/district/jharkhand.geojson")
        .then((res) => (res.ok ? res.json() : null))
        .then((geoData) => {
          if (!geoData || !isMounted) return;

          L.geoJSON(geoData, {
            style: (feature: any) => {
              const districtName = feature?.properties?.district || feature?.properties?.NAME_2 || "";
              const metric = DISTRICT_METRICS.find(
                (m) => m.district.toLowerCase() === districtName.toLowerCase()
              );
              const isCritical = metric?.intensity === "CRITICAL";

              return {
                color: "#2dd4bf",
                weight: 1.5,
                opacity: 0.65,
                fillColor: isCritical ? "#ea580c" : "#0d9488",
                fillOpacity: isCritical ? 0.32 : 0.18,
              };
            },
            onEachFeature: (feature: any, layer: any) => {
              const districtName = feature?.properties?.district || feature?.properties?.NAME_2;
              const matched = DISTRICT_METRICS.find(
                (m) => m.district.toLowerCase() === (districtName || "").toLowerCase()
              );

              if (matched) {
                layer.on({
                  click: () => {
                    setSelectedDistrict(matched);
                    map.flyTo([matched.lat, matched.lng], 9.2, { duration: 1 });
                  },
                });
              }
            },
          }).addTo(map);
        })
        .catch(() => {});

      mapInstanceRef.current = map;

      setTimeout(() => {
        if (!isMounted || !map) return;
        map.invalidateSize();
        map.fitBounds(JHARKHAND_BOUNDS, { padding: [10, 10] });
      }, 200);

      renderMarkers(map, L, clusters, selectedDistrict);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const renderMarkers = (
    map: any,
    L: any,
    clusterList: DistrictCluster[],
    currentSelected: DistrictCluster
  ) => {
    Object.values(markersRef.current).forEach((m) => m.remove());
    Object.values(circlesRef.current).forEach((c) => c.remove());
    markersRef.current = {};
    circlesRef.current = {};

    clusterList.forEach((c) => {
      const isSelected = currentSelected.district === c.district;
      const isCritical = c.intensity === "CRITICAL";
      const radiusMeters = isCritical ? 24000 : 16000;
      const circleColor = isCritical ? "#ea580c" : "#0d9488";

      const heatCircle = L.circle([c.lat, c.lng], {
        radius: radiusMeters,
        color: circleColor,
        weight: isSelected ? 2.5 : 1,
        opacity: isSelected ? 0.95 : 0.4,
        fillColor: circleColor,
        fillOpacity: isSelected ? 0.45 : 0.2,
      }).addTo(map);

      circlesRef.current[c.district] = heatCircle;

      const iconHtml = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%); cursor: pointer;">
          ${
            isSelected
              ? `<div style="position: absolute; top: -6px; width: 44px; height: 44px; border-radius: 50%; background: ${
                  isCritical ? "rgba(234, 88, 12, 0.4)" : "rgba(20, 184, 166, 0.4)"
                }; animation: ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
              : ""
          }
          <div style="
            position: relative;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: monospace;
            font-size: 11px;
            font-weight: 900;
            color: #ffffff;
            background: ${isSelected ? "#ea580c" : isCritical ? "#c2410c" : "#0f766e"};
            border: 2px solid ${isSelected ? "#ffffff" : "rgba(255,255,255,0.7)"};
            box-shadow: 0 0 15px ${isCritical ? "rgba(234, 88, 12, 0.6)" : "rgba(20, 184, 166, 0.6)"};
            transition: all 0.2s ease;
          ">
            ${c.problems}
          </div>
          <div style="
            margin-top: 3px;
            padding: 2px 7px;
            border-radius: 6px;
            font-family: sans-serif;
            font-size: 9.5px;
            font-weight: 800;
            white-space: nowrap;
            color: ${isSelected ? "#041e23" : "#f1f5f9"};
            background: ${isSelected ? "#ffffff" : "rgba(2, 6, 23, 0.88)"};
            border: 1px solid ${isSelected ? "#ea580c" : "rgba(255, 255, 255, 0.15)"};
            backdrop-filter: blur(8px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
          ">
            ${c.district}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: "leaflet-gis-pin",
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([c.lat, c.lng], { icon: customIcon }).addTo(map);
      marker.on("click", () => {
        setSelectedDistrict(c);
        map.flyTo([c.lat, c.lng], 9.2, { duration: 1.1 });
      });

      markersRef.current[c.district] = marker;
    });
  };

  useEffect(() => {
    if (mapInstanceRef.current && leafletLibRef.current) {
      renderMarkers(mapInstanceRef.current, leafletLibRef.current, clusters, selectedDistrict);
    }
  }, [clusters, selectedDistrict]);

  // Render live telemetry markers for newly ingested problems
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletLibRef.current) return;
    const L = leafletLibRef.current;
    const map = mapInstanceRef.current;

    liveMarkersRef.current.forEach((m) => m.remove());
    liveMarkersRef.current = [];

    liveSubmissions.forEach((sub, idx) => {
      const matched = DISTRICT_METRICS.find(
        (d) => d.district.toLowerCase() === (sub.district || "").toLowerCase()
      );
      if (!matched) return;

      // Micro-jitter so multiple points in the same district don't overlap completely
      const latOffset = Math.sin(idx * 1.7) * 0.06;
      const lngOffset = Math.cos(idx * 1.7) * 0.06;

      const liveIconHtml = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          <span style="position: absolute; width: 22px; height: 22px; border-radius: 50%; background: rgba(234, 88, 12, 0.45); animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
          <div style="width: 11px; height: 11px; border-radius: 50%; background: #ea580c; border: 2px solid #ffffff; box-shadow: 0 0 10px #ea580c;"></div>
        </div>
      `;

      const liveIcon = L.divIcon({
        html: liveIconHtml,
        className: "live-telemetry-pin",
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const marker = L.marker([matched.lat + latOffset, matched.lng + lngOffset], {
        icon: liveIcon,
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 6px; min-width: 200px;">
          <div style="font-family: monospace; font-size: 10px; color: #0d9488; font-weight: bold;">
            LIVE SENSOR TELEMETRY #${sub.tracking_id || sub.id}
          </div>
          <div style="font-size: 12px; font-weight: bold; margin-top: 3px; color: #0f172a;">
            ${sub.title || sub.standardized_title}
          </div>
          <div style="font-size: 10.5px; color: #64748b; margin-top: 4px;">
            District: <strong style="color: #0f172a;">${sub.district}</strong>
          </div>
          <div style="font-size: 10.5px; color: #64748b;">
            Telemetry Status: <span style="color: #10b981; font-weight: bold;">${sub.status || "FIELD_VERIFIED"}</span>
          </div>
        </div>
      `);

      liveMarkersRef.current.push(marker);
    });
  }, [liveSubmissions]);

  const resetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(JHARKHAND_BOUNDS, { padding: [10, 10] });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setUploadedFilePreview(localUrl);
    }
  };

  const handleUploadSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);

    const newEntry: ShowcaseVideo = {
      id: `vid-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      district: newDistrict,
      submittedBy: newSubmittedBy || "Verified Field Researcher",
      date: "Just now",
      duration: "Local Stream",
      views: 1,
      verified: true,
      thumbnailUrl: "https://img.youtube.com/vi/BbL7CflNo7s/hqdefault.jpg",
      type: "file",
      ...(uploadedFilePreview ? { fileUrl: uploadedFilePreview } : {}),
      ...(!uploadedFilePreview ? { embedUrl: "https://www.youtube-nocookie.com/embed/BbL7CflNo7s?autoplay=1&controls=1&rel=0&modestbranding=1" } : {}),
      summary: newSummary || "Field audit video submitted and indexed for Quad-Helix R&D validation."
    };

    setTimeout(() => {
      setVideos((prev) => [newEntry, ...prev]);
      setActiveVideo(newEntry);
      setIsSubmitting(false);
      setIsUploadOpen(false);
      setNewTitle("");
      setNewSummary("");
      setNewSubmittedBy("");
      setUploadedFilePreview(null);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-5 py-8">
        {/* Telemetry Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal">
              <Layers className="size-4" /> DHTE Geospatial Telemetry
            </span>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">
              State Innovation Heatmap
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Survey of India cadastral coordinates, live grievance density, and capstone deployment matrix.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-lg border border-teal/30 bg-teal/10 px-3.5 py-1.5 text-xs font-bold text-teal">
              <Radio className="size-3.5 animate-pulse text-saffron" /> Live Ingestion ({liveSubmissions.length} Feeds)
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-xs">
              <Compass className="size-3.5 text-teal" /> WGS84 Geo-Referenced
            </span>
          </div>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-12">
          {/* Main Map Card */}
          <div className="surface-card relative flex flex-col rounded-2xl p-6 shadow-sm lg:col-span-8">
            <div className="flex items-center justify-between border-b border-border pb-3.5">
              <div className="flex items-center gap-2">
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-teal opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-teal" />
                </span>
                <h2 className="text-xs font-bold uppercase tracking-wide text-foreground">
                  Jharkhand Cadastral Density Matrix
                </h2>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs text-teal">
                <Crosshair className="size-3.5 animate-spin" style={{ animationDuration: "14s" }} />
                <span className="rounded bg-teal/10 border border-teal/25 px-2.5 py-0.5 font-bold tracking-tight">
                  LAT: {selectedDistrict.lat.toFixed(4)}° N &nbsp;|&nbsp; LNG: {selectedDistrict.lng.toFixed(4)}° E
                </span>
              </div>
            </div>

            <div className="relative mt-5 h-140 w-full overflow-hidden rounded-xl border border-border bg-[#080e1b] shadow-inner">
              <div ref={mapContainerRef} className="size-full z-0" />

              <div className="absolute top-4 left-4 z-400 flex items-center gap-2 rounded-lg border border-white/10 bg-navy-deep/90 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xl backdrop-blur-md">
                <MapPin className="size-3.5 text-teal" />
                <span>State of Jharkhand (24 Districts)</span>
              </div>

              <div className="absolute top-4 right-4 z-400 flex flex-col gap-1.5 rounded-lg border border-white/10 bg-navy-deep/90 p-1.5 shadow-xl backdrop-blur-md">
                <button
                  type="button"
                  title="Zoom In"
                  onClick={() => mapInstanceRef.current?.zoomIn()}
                  className="rounded p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  <ZoomIn className="size-4" />
                </button>
                <button
                  type="button"
                  title="Zoom Out"
                  onClick={() => mapInstanceRef.current?.zoomOut()}
                  className="rounded p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  <ZoomOut className="size-4" />
                </button>
                <button
                  type="button"
                  title="Reset to Jharkhand Overview"
                  onClick={resetView}
                  className="rounded p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  <RotateCcw className="size-4" />
                </button>
              </div>

              <div className="absolute bottom-4 left-4 z-400 flex items-center gap-4 rounded-lg border border-white/10 bg-navy-deep/90 px-4 py-2 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/90">
                  <span className="size-2.5 rounded-full bg-saffron animate-pulse" /> Critical Severity (&gt;20 Grievances)
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/90">
                  <span className="size-2 rounded-full bg-[#ea580c] ring-2 ring-white/50" /> Live Ingestion Radar Dot
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/90">
                  <span className="size-2.5 rounded-full bg-teal" /> Active R&amp;D Pipeline
                </div>
              </div>
            </div>
          </div>

          {/* Regional Dossier Panel */}
          <div className="surface-card flex flex-col justify-between rounded-2xl p-6 shadow-sm lg:col-span-4">
            <div>
              <div className="flex items-center justify-between border-b border-border pb-3.5">
                <span className="text-xs font-bold uppercase tracking-wider text-teal">
                  Regional Cluster Dossier
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[10px] font-bold text-foreground">
                  <Flame className="size-3 text-saffron" />
                  {selectedDistrict.intensity} Priority
                </span>
              </div>

              <div className="mt-5">
                <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  District Administrative Unit
                </div>
                <h3 className="text-3xl font-extrabold tracking-tight text-foreground">
                  {selectedDistrict.district}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Dominant Research Domain:{" "}
                  <span className="font-bold text-teal">{selectedDistrict.primary_domain}</span>
                </p>
              </div>

              <div className="mt-6 space-y-3.5">
                <div className="rounded-xl border border-border bg-secondary/40 p-4 transition hover:bg-secondary/70">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-muted-foreground">Citizen Issues Ingested</span>
                    <TrendingUp className="size-4 text-teal" />
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-foreground">
                    {selectedDistrict.problems} Issues Logged
                  </div>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    Triaged via Panchayati Raj &amp; Direct Voice Portal
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-secondary/40 p-4 transition hover:bg-secondary/70">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-muted-foreground">University Capstones</span>
                    <Building2 className="size-4 text-blue-500" />
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-teal">
                    {selectedDistrict.active_projects} Projects Active
                  </div>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    Enrolled under NEP 2020 Experiential Credit Track
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-secondary/40 p-4 transition hover:bg-secondary/70">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-muted-foreground">Committed CSR Grants</span>
                    <Coins className="size-4 text-saffron" />
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-saffron">
                    ₹ {selectedDistrict.csr_funding_cr} Crores
                  </div>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    Escrowed via Corporate Partnership Framework
                  </p>
                </div>
              </div>
            </div>

            {/* Deep-Linked Action Button to Live Challenge Bank */}
            <div className="mt-6 border-t border-border pt-4">
              <Link
                to="/challenges"
                search={{
                  district: selectedDistrict.district,
                  domain: selectedDistrict.primary_domain,
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal py-3 text-xs font-bold text-white shadow-md shadow-teal/20 transition hover:bg-teal/90"
              >
                Inspect {selectedDistrict.district} Challenges in Bank <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Quad-Helix Visual Evidence & Field Demonstration Section */}
        <section className="mt-12 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal">
                <Video className="size-4" /> Quad-Helix Visual Evidence Hub
              </div>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">
                Field Telemetry &amp; Prototype Video Demonstrations
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Audited field footage validating grassroots challenges, university engineering pilots, and CSR audits.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-secondary/50 p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("ALL")}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    activeTab === "ALL" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  All Evidence
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("CITIZEN_GRIEVANCE")}
                  className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    activeTab === "CITIZEN_GRIEVANCE" ? "bg-card text-teal shadow-xs" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Users className="size-3.5" /> Citizen Field
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("UNIVERSITY_PROTOTYPE")}
                  className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    activeTab === "UNIVERSITY_PROTOTYPE" ? "bg-card text-teal shadow-xs" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <GraduationCap className="size-3.5" /> HEI Prototypes
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("CSR_IMPACT")}
                  className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                    activeTab === "CSR_IMPACT" ? "bg-card text-saffron shadow-xs" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Building2 className="size-3.5" /> CSR Audits
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsUploadOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-teal/90"
              >
                <UploadCloud className="size-4" /> Upload Video Evidence
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-12">
            {/* Primary Encrypted Video Player Screen */}
            <div className="lg:col-span-8">
              {activeVideo ? (
                <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-2xl">
                  {/* Internal Telemetry Command Bar */}
                  <div className="relative z-20 flex items-center justify-between border-b border-white/10 bg-[#060c18] px-4 py-2.5 text-xs">
                    <div className="flex items-center gap-2.5 font-mono text-[11px] text-teal">
                      <span className="relative flex size-2">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-teal opacity-75" />
                        <span className="relative inline-flex size-2 rounded-full bg-teal" />
                      </span>
                      <span className="font-bold tracking-wider text-slate-200">DHTE-SECURE STREAM // AES-256</span>
                      <span className="hidden sm:inline text-slate-500">|</span>
                      <span className="hidden sm:inline text-slate-400 font-sans">{activeVideo.district} Sensor Feed</span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Lock className="size-3" /> Encrypted
                      </span>
                      <span className="rounded bg-white/5 px-2 py-0.5 font-bold text-teal">
                        1080p Telemetry
                      </span>
                    </div>
                  </div>

                  {/* Video Viewport Container with Crop Masking */}
                  <div className="relative aspect-video w-full overflow-hidden bg-black">
                    {activeVideo.type === "embed" && activeVideo.embedUrl ? (
                      <div className="relative size-full overflow-hidden">
                        <iframe
                          key={activeVideo.id}
                          src={activeVideo.embedUrl}
                          title={activeVideo.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          className="size-full scale-105 pointer-events-auto border-0 object-cover"
                        />
                      </div>
                    ) : (
                      <video
                        key={activeVideo.id}
                        src={activeVideo.fileUrl}
                        poster={activeVideo.thumbnailUrl}
                        controls
                        autoPlay
                        playsInline
                        className="size-full object-cover"
                      >
                        Your browser does not support the video tag.
                      </video>
                    )}

                    <div 
                      className="pointer-events-none absolute inset-0 opacity-[0.03]"
                      style={{
                        backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                        backgroundSize: "24px 24px"
                      }}
                    />
                  </div>

                  {/* Video Metadata Dossier */}
                  <div className="p-5 bg-card text-card-foreground">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-md bg-teal/10 px-2.5 py-0.5 text-xs font-bold text-teal border border-teal/25">
                          <Tag className="size-3" /> {activeVideo.district} District
                        </span>
                        {activeVideo.verified && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck className="size-4 text-emerald-500" /> Panchayat Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                        <span className="inline-flex items-center gap-1 font-sans">
                          <Calendar className="size-3.5" /> {activeVideo.date}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Eye className="size-3.5" /> {activeVideo.views.toLocaleString()} verified audits
                        </span>
                      </div>
                    </div>

                    <h3 className="mt-2.5 text-xl font-bold text-foreground tracking-tight">
                      {activeVideo.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                      {activeVideo.summary}
                    </p>

                    <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
                      <span>Submitted Entity: <strong className="text-foreground">{activeVideo.submittedBy}</strong></span>
                      <span className="font-mono font-semibold text-saffron">Audit Verification: #{activeVideo.id}</span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Custom Telemetry Stream Sidebar */}
            <div className="flex flex-col gap-3 lg:col-span-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Available Streams ({filteredVideos.length})
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal">
                  <Activity className="size-3 text-teal" /> Live Feeds Active
                </span>
              </div>

              <div className="space-y-3 overflow-y-auto max-h-135 pr-1">
                {filteredVideos.map((item) => {
                  const isCurrent = activeVideo?.id === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setActiveVideo(item)}
                      className={`w-full text-left rounded-xl border p-3 transition-all ${
                        isCurrent 
                          ? "border-teal bg-teal/5 shadow-xs ring-1 ring-teal/30" 
                          : "border-border bg-card hover:bg-secondary/40"
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg bg-slate-950 border border-border">
                          <img 
                            src={item.thumbnailUrl} 
                            alt={item.title} 
                            className="size-full object-cover" 
                          />
                          <span className="absolute bottom-1 right-1 rounded bg-black/85 px-1.5 py-0.5 font-mono text-[9px] font-bold text-teal border border-teal/30">
                            {item.duration}
                          </span>
                          <div className="absolute inset-0 grid place-items-center bg-black/25 group-hover:bg-black/45">
                            <span className="grid size-6 place-items-center rounded-full bg-white/95 shadow">
                              <Play className="size-3 text-slate-950 fill-slate-950 ml-0.5" />
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col justify-between overflow-hidden">
                          <div>
                            <span className="inline-block text-[10px] font-bold uppercase text-teal">
                              {item.district}
                            </span>
                            <h4 className="line-clamp-2 text-xs font-bold leading-snug text-foreground">
                              {item.title}
                            </h4>
                          </div>
                          <span className="text-[10px] text-muted-foreground truncate font-mono">
                            {item.submittedBy}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Video Evidence Upload Modal */}
        {isUploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <FileVideo className="size-5 text-teal" />
                  <h3 className="text-lg font-bold text-foreground">Upload Video Evidence</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-foreground">Video Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Solar Tube Well Sensor Calibration Pilot"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs text-foreground focus:border-teal focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-foreground">Quad-Helix Role</label>
                    <select
                      value={newCategory}
                      onChange={(e: any) => setNewCategory(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs text-foreground focus:border-teal focus:outline-none"
                    >
                      <option value="CITIZEN_GRIEVANCE">Citizen Grievance</option>
                      <option value="UNIVERSITY_PROTOTYPE">University Prototype</option>
                      <option value="CSR_IMPACT">CSR Audit Verification</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground">District</label>
                    <select
                      value={newDistrict}
                      onChange={(e) => setNewDistrict(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs text-foreground focus:border-teal focus:outline-none"
                    >
                      {DISTRICT_METRICS.map((d) => (
                        <option key={d.district} value={d.district}>
                          {d.district}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground">Submitting Entity</label>
                  <input
                    type="text"
                    placeholder="e.g. BIT Mesra / Satbarwa Panchayat / Tata Steel"
                    value={newSubmittedBy}
                    onChange={(e) => setNewSubmittedBy(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs text-foreground focus:border-teal focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground">Summary &amp; Field Context</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of the recorded deployment..."
                    value={newSummary}
                    onChange={(e) => setNewSummary(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs text-foreground focus:border-teal focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground">Select Local MP4 File</label>
                  <input
                    type="file"
                    accept="video/mp4,video/webm"
                    onChange={handleFileChange}
                    className="mt-1 w-full text-xs text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-teal/10 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-teal hover:file:bg-teal/20"
                  />
                </div>

                <div className="mt-5 flex justify-end gap-2 border-t border-border pt-4">
                  <button
                    type="button"
                    onClick={() => setIsUploadOpen(false)}
                    className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-teal px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal/90 disabled:opacity-50"
                  >
                    <CheckCircle2 className="size-4" /> {isSubmitting ? "Uploading..." : "Publish Evidence"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default GeospatialMapPage;