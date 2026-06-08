import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import * as THREE from "three"
import "./App.css"

gsap.registerPlugin(ScrollTrigger)

// ─── THREE.JS DEMO ────────────────────────────────────────────────────────────
function ThreeScene() {
  const mountRef = useRef(null)

  useEffect(() => {
    const w = mountRef.current.clientWidth
    const h = mountRef.current.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(window.devicePixelRatio)
    mountRef.current.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100)
    camera.position.z = 3

    // Torus knot animé
    const geo = new THREE.TorusKnotGeometry(0.8, 0.25, 120, 16)
    const mat = new THREE.MeshStandardMaterial({
      color: 0x7c3aed,
      roughness: 0.3,
      metalness: 0.7,
    })
    const mesh = new THREE.Mesh(geo, mat)
    scene.add(mesh)

    // Lumières
    const ambient = new THREE.AmbientLight(0xffffff, 0.4)
    const point = new THREE.PointLight(0xa855f7, 2, 10)
    point.position.set(3, 3, 3)
    const point2 = new THREE.PointLight(0xf97316, 1.5, 10)
    point2.position.set(-3, -2, 2)
    scene.add(ambient, point, point2)

    let frame
    const animate = () => {
      frame = requestAnimationFrame(animate)
      mesh.rotation.x += 0.008
      mesh.rotation.y += 0.012
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frame)
      renderer.dispose()
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="three-canvas" />
}

// ─── GSAP DEMO ────────────────────────────────────────────────────────────────
function GsapSection() {
  const containerRef = useRef(null)

  useGSAP(() => {
    gsap.from(".gsap-card", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      },
      y: 60,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: "power3.out",
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="gsap-section">
      <h2 className="section-title">GSAP <span>ScrollTrigger</span></h2>
      <p className="section-sub">Les cartes s'animent au scroll</p>
      <div className="gsap-grid">
        {["Stagger", "ScrollTrigger", "Timeline", "Easing"].map((t) => (
          <div key={t} className="gsap-card">
            <div className="card-dot" />
            <p>{t}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── FRAMER MOTION DEMO ───────────────────────────────────────────────────────
const tabs = ["Entrée", "Hover", "Drag", "Spring"]

function FramerSection() {
  const [active, setActive] = useState(0)
  const [dragging, setDragging] = useState(false)

  return (
    <div className="framer-section">
      <h2 className="section-title">Framer <span>Motion</span></h2>
      <p className="section-sub">Interactions fluides en React</p>

      <div className="tabs">
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setActive(i)} className={active === i ? "tab active" : "tab"}>
            {active === i && <motion.div className="tab-bg" layoutId="tab-bg" />}
            <span>{t}</span>
          </button>
        ))}
      </div>

      <div className="demo-box">
        <AnimatePresence mode="wait">
          {active === 0 && (
            <motion.div key="fade" className="demo-item" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.4 }}>
              <div className="pill">fade + scale</div>
            </motion.div>
          )}
          {active === 1 && (
            <motion.div key="hover" className="demo-item">
              <motion.div className="hover-btn" whileHover={{ scale: 1.1, rotate: 3 }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400 }}>
                Hover moi
              </motion.div>
            </motion.div>
          )}
          {active === 2 && (
            <motion.div key="drag" className="demo-item drag-area">
              <motion.div
                className={`drag-dot ${dragging ? "dragging" : ""}`}
                drag dragConstraints={{ left: -80, right: 80, top: -40, bottom: 40 }}
                onDragStart={() => setDragging(true)}
                onDragEnd={() => setDragging(false)}
                whileDrag={{ scale: 1.2 }}
              />
              <p className="drag-hint">Drag</p>
            </motion.div>
          )}
          {active === 3 && (
            <motion.div key="spring" className="demo-item">
              <motion.div className="spring-box" animate={{ x: [0, 80, 0] }} transition={{ repeat: Infinity, duration: 1.8, type: "spring", stiffness: 120, damping: 8 }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── CSS ANIMATIONS DEMO ──────────────────────────────────────────────────────
function CssSection() {
  return (
    <div className="css-section">
      <h2 className="section-title">CSS <span>Animations</span></h2>
      <p className="section-sub">Natif, léger, performant</p>
      <div className="css-grid">
        <div className="css-item glow-ring"><div className="ring" /></div>
        <div className="css-item pulse-blob"><div className="blob" /></div>
        <div className="css-item float-orb"><div className="orb" /></div>
        <div className="css-item wave-bar">
          {[1,2,3,4,5].map(i => <div key={i} className="bar" style={{ animationDelay: `${i * 0.1}s` }} />)}
        </div>
      </div>
    </div>
  )
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="app">
      <header className="hero">
        <motion.h1 initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
          Animation <span>Stack</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
          Three.js · Framer Motion · GSAP · CSS
        </motion.p>
        <div className="hero-scene">
          <ThreeScene />
        </div>
      </header>

      <main>
        <FramerSection />
        <GsapSection />
        <CssSection />
      </main>

      <footer>
        <p>React + Vite · Toutes les libs installées ✓</p>
      </footer>
    </div>
  )
}
