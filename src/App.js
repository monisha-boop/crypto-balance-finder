// App.js - MODERN 2025 DASHBOARD - COMPLETE UPDATED VERSION
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import confetti from 'canvas-confetti';
import './App.css';

// Fixed Imports
import {
  FiSearch, FiActivity, FiDollarSign, FiClock,
  FiLogOut, FiUser, FiPlay, FiPause, FiRefreshCw,
  FiZap, FiShield, FiCheck, FiAlertCircle,
  FiExternalLink, FiArrowUp, FiArrowDown,
  FiDownload, FiSettings, FiStar, FiTrendingUp,
  FiAlertTriangle, FiLock, FiUnlock, FiCreditCard,
  FiMessageSquare, FiMail, FiKey, FiLogIn,
  FiUsers, FiGlobe, FiDatabase, FiCpu,
  FiBarChart2, FiPieChart, FiBox, FiGrid,
  FiLayers, FiPackage, FiShoppingBag, FiTag,
  FiPercent, FiCalendar, FiClock as FiClockIcon,
  FiBell, FiHeart, FiThumbsUp, FiAward,
  FiTarget, FiNavigation, FiCompass, FiMap,
  FiHome, FiBriefcase, FiFolder, FiFile,
  FiImage, FiFilm, FiMusic, FiVideo,
  FiSmartphone, FiTablet, FiMonitor, FiPrinter,
  FiServer, FiHardDrive, FiWifi, FiBluetooth,
  FiRadio, FiCamera, FiMic, FiHeadphones,
  FiSpeaker, FiVolume2, FiVolume, FiVolumeX,
  FiSun, FiMoon, FiCloud, FiCloudRain,
  FiCloudSnow, FiCloudLightning, FiWind,
  FiThermometer, FiDroplet, FiUmbrella,
  FiAnchor, FiFlag, FiMapPin, FiNavigation2,
  FiCompass as FiCompass2, FiMap as FiMap2,
  FiGlobe as FiGlobe2, FiEarth, FiWorld,
  FiChrome, FiFirefox, FiEdge, FiSafari,
  FiCommand, FiTerminal, FiCode,
  FiBitcoin,
  FiChevronRight, FiChevronLeft,
  FiEye, FiEyeOff, FiFilter,
  FiMoreVertical, FiMoreHorizontal,
  FiTrash2, FiEdit, FiCopy,
  FiShare2, FiLink, FiLink2,
  FiUpload, FiDownload as FiDownloadCloud,
  FiCloud as FiCloudUpload, FiCloud as FiCloudDownload,
  FiMaximize2, FiMinimize2,
  FiZoomIn, FiZoomOut,
  FiRotateCw, FiRotateCcw
} from 'react-icons/fi';

// New Import for Ri Icons
import {
  RiBitCoinLine,
  RiWallet3Line,
  RiHistoryLine
} from 'react-icons/ri';

// Supabase configuration
const SUPABASE_URL = "https://ahvsldvzvyprxxoxuxxp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnNsZHZ6dnlwcnh4b3h1eHhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNTMwMjUsImV4cCI6MjA3NzYyOTAyNX0.ClksEL-A7eGxHTPwSeYGon8_otAixSceM3SoQszh3PU";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper functions
const ethRegex = /^0x[a-fA-F0-9]{40}$/;
const btcRegex = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/;
const solRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
const formatNumber = (n) => (typeof n === "number" ? n.toLocaleString() : n);

const randomAddress = () => {
  const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  if (Math.random() < 0.5) {
    const hex = "abcdef0123456789";
    return "0x" + Array.from({ length: 40 }, () => hex[Math.floor(Math.random() * hex.length)]).join("");
  } else {
    return Array.from({ length: 34 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  }
};

const randomAmount = () => parseFloat((Math.random() * 99 + 1).toFixed(2)); // $1-$100

function cryptoId() {
  return `${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

// Enhanced Splash Screen Component
function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState(0);

  const loadingTexts = [
    "Initializing Blockchain Scanner...",
    "Loading Crypto Databases...",
    "Setting Up Security Protocols...",
    "Almost Ready..."
  ];

  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentText(prev => (prev + 1) % loadingTexts.length);
    }, 1500);

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          clearInterval(textInterval);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => {
      clearInterval(progressTimer);
      clearInterval(textInterval);
    };
  }, [onComplete]);

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <motion.div
          className="splash-logo"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, type: "spring" }}
        >
          <FiActivity size={80} className="text-primary" />
          <div className="logo-ring"></div>
        </motion.div>

        <motion.div
          className="typing-text"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h1 className="splash-title">
            Crypto Balance
            <br />
            <span className="gradient-text" style={{ animationDelay: '0.5s' }}>Finder Pro</span>
          </h1>
          <motion.p
            key={currentText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="splash-subtitle"
          >
            {loadingTexts[currentText]}
          </motion.p>
        </motion.div>

        <div className="loading-container">
          <div className="loading-bar">
            <div
              className="loading-progress"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="progress-text">{progress}%</div>
        </div>

        <motion.div
          className="splash-features"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="feature-item">
            <FiZap className="mr-2" />
            Lightning Fast Scanning
          </div>
          <div className="feature-item">
            <FiStar className="mr-2" />
            Premium Rewards
          </div>
          <div className="feature-item">
            <FiShield className="mr-2" />
            Secure Withdrawals
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Animated Login Component
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage("✅ Sign up successful! You can now login.");
        setIsSignUp(false);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        // Trigger success effects
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        setTimeout(() => onLogin(data.user), 1000);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <motion.div
        className="login-card"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="stagger-reveal" style={{ animationDelay: '0.1s' }}>
          <h2 className="login-title gradient-text">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="login-subtitle">
            {isSignUp ? "Start your crypto journey" : "Sign in to continue"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group stagger-reveal" style={{ animationDelay: '0.2s' }}>
            <label className="form-label">
              <FiMail className="mr-2" />
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group stagger-reveal" style={{ animationDelay: '0.3s' }}>
            <label className="form-label">
              <FiKey className="mr-2" />
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="stagger-reveal" style={{ animationDelay: '0.4s' }}>
            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <div className="button-spinner"></div>
              ) : isSignUp ? (
                <>
                  <FiUser className="mr-2" />
                  Create Account
                </>
              ) : (
                <>
                  <FiLogIn className="mr-2" />
                  Sign In
                </>
              )}
            </button>
          </div>
        </form>

        {message && (
          <div className="stagger-reveal" style={{ animationDelay: '0.5s' }}>
            <div className={`login-message ${message.includes('✅') ? 'success' : 'error'}`}>
              {message.includes('✅') ? <FiCheck className="mr-2" /> : <FiAlertCircle className="mr-2" />}
              {message}
            </div>
          </div>
        )}

        <div className="stagger-reveal" style={{ animationDelay: '0.6s' }}>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="btn btn-outline w-full mt-4"
          >
            {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
          </button>
        </div>

        {/* Contact Admin Button */}
        <div className="stagger-reveal" style={{ animationDelay: '0.7s' }}>
          <button
            onClick={() => window.open('https://t.me/Cryptography55', '_blank')}
            className="btn btn-outline w-full mt-3"
          >
            <FiMessageSquare className="mr-2" />
            Contact Admin for Help
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function CryptoBalanceFinder() {
  const TARGET = 1000000;

  // States
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(0);
  const [stream, setStream] = useState([]);
  const [foundCount, setFoundCount] = useState(0);
  const [totalFound, setTotalFound] = useState(0);
  const [lastFound, setLastFound] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [speedFast, setSpeedFast] = useState(true);
  const [alertMsg, setAlertMsg] = useState(null);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAddr, setWithdrawAddr] = useState("");
  const [withdrawAmt, setWithdrawAmt] = useState("");
  const [withdrawErr, setWithdrawErr] = useState("");
  const [withdrawProgress, setWithdrawProgress] = useState(0);
  const [withdrawStatusText, setWithdrawStatusText] = useState("");
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [purchaseTxnId, setPurchaseTxnId] = useState("");
  const [purchaseStep, setPurchaseStep] = useState("select");
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const [premiumStartDate, setPremiumStartDate] = useState(null);
  const [premiumEndDate, setPremiumEndDate] = useState(null);
  const [daysLeft, setDaysLeft] = useState(0);
  const [activeTab, setActiveTab] = useState("scanning");
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [refreshingHistory, setRefreshingHistory] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [buttonAnimations, setButtonAnimations] = useState({});
  const [rgbAnimationActive, setRgbAnimationActive] = useState(true);
  const [withdrawSteps, setWithdrawSteps] = useState([]);

  // Refs
  const foundTimeoutRef = useRef(null);
  const streamRef = useRef(null);
  const checkPremiumInterval = useRef(null);
  const rgbAnimationRef = useRef(null);
  const withdrawTimerRef = useRef(null);
  const withdrawStepIntervalRef = useRef(null);

  // Found time tracking
  const nextFoundTimeRef = useRef(null);

  // Plans and Methods
  const plans = [
    { id: "p40", label: "$40 — 10 days", price: 40, duration: 10, icon: "💎" },
    { id: "p75", label: "$75 — 18 days", price: 75, duration: 18, icon: "🚀" },
    { id: "p120", label: "$120 — 30 days", price: 120, duration: 30, icon: "⭐" },
    { id: "p500", label: "$500 — Lifetime", price: 500, duration: 3650, icon: "👑" },
  ];

  const methods = [
    { name: "Binance Pay", icon: "💰" },
    { name: "BTC", icon: "₿" },
    { name: "bKash", icon: "📱" },
    { name: "Nagad", icon: "💳" }
  ];

  // Withdraw verification steps
  const withdrawStepConfigs = [
    { title: "Verifying Wallet Address", desc: "Checking address format and network", duration: 6000 },
    { title: "Security Checks", desc: "Validating transaction security", duration: 6000 },
    { title: "Broadcasting Transaction", desc: "Sending to blockchain network", duration: 6000 },
    { title: "Waiting for Confirmations", desc: "Confirming blockchain inclusion", duration: 6000 },
    { title: "Withdraw Completed", desc: "Transaction finalized", duration: 6000 }
  ];

  // RGB Background Animation Effect
  useEffect(() => {
    if (!rgbAnimationActive) return;

    const colors = [
      '#3B82F6', '#22D3EE', '#10B981', '#8B5CF6',
      '#EC4899', '#F59E0B', '#EF4444', '#06B6D4'
    ];

    let currentColorIndex = 0;

    const updateBackground = () => {
      const app = document.querySelector('.app');
      if (!app) return;

      currentColorIndex = (currentColorIndex + 1) % colors.length;
      const color1 = colors[currentColorIndex];
      const color2 = colors[(currentColorIndex + 2) % colors.length];
      const color3 = colors[(currentColorIndex + 4) % colors.length];

      app.style.background = `
        radial-gradient(circle at 20% 50%, ${color1}20 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, ${color2}10 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, ${color3}15 0%, transparent 50%),
        linear-gradient(180deg, var(--bg-primary) 0%, #0B1220 100%)
      `;
    };

    rgbAnimationRef.current = setInterval(updateBackground, 3000);

    return () => {
      if (rgbAnimationRef.current) {
        clearInterval(rgbAnimationRef.current);
      }
    };
  }, [rgbAnimationActive]);

  // Load persistent withdraw history
  useEffect(() => {
    if (user) {
      const savedHistory = localStorage.getItem(`withdraw_history_${user.id}`);
      if (savedHistory) {
        try {
          setWithdrawHistory(JSON.parse(savedHistory));
        } catch (err) {
          console.warn("Error loading history:", err);
        }
      }
    }
  }, [user]);

  // Save history to localStorage
  useEffect(() => {
    if (user && withdrawHistory.length > 0) {
      localStorage.setItem(`withdraw_history_${user.id}`, JSON.stringify(withdrawHistory));
    }
  }, [withdrawHistory, user]);

  // Effects
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUser(user);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchWithdrawHistory();
      fetchPurchaseHistory();
    }
  }, [user]);

  // Premium expiration check
  useEffect(() => {
    if (isPremium && premiumEndDate) {
      checkPremiumInterval.current = setInterval(() => {
        const now = new Date();
        const endDate = new Date(premiumEndDate);

        if (now > endDate) {
          setIsPremium(false);
          setDaysLeft(0);
          setAlertMsg("⚠️ Your premium subscription has expired!");
          setTimeout(() => setAlertMsg(null), 3000);
        } else {
          const diffTime = endDate - now;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setDaysLeft(diffDays);
        }
      }, 60000); // Check every minute
    }

    return () => {
      if (checkPremiumInterval.current) {
        clearInterval(checkPremiumInterval.current);
      }
    };
  }, [isPremium, premiumEndDate]);

  // Smart Plan Activation System
  const activateUserPlan = (plan) => {
    if (!plan) {
      setIsPremium(false);
      setPremiumStartDate(null);
      setPremiumEndDate(null);
      setDaysLeft(0);
      return;
    }

    const planConfig = plans.find(p => p.id === plan.id) || plans.find(p => p.label === plan.plan);
    const durationDays = planConfig?.duration || 7;

    const startDate = plan.date ? new Date(plan.date) : new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + durationDays);

    setIsPremium(true);
    setPremiumStartDate(startDate);
    setPremiumEndDate(endDate);

    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDaysLeft(Math.max(0, diffDays));
  };

  const checkPlanActive = (plan) => {
    if (!plan) return false;
    const planConfig = plans.find(p => p.id === plan.id) || plans.find(p => p.label === plan.plan);
    const durationDays = planConfig?.duration || 7;
    const startDate = new Date(plan.date);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + durationDays);
    return new Date() <= endDate;
  };

  // Purchase History Fetch
  const fetchPurchaseHistory = async () => {
    if (!user) return;

    let databasePayments = [];

    try {
      const { data, error } = await supabase
        .from("user_payments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (!error && data) {
        databasePayments = data;
      }
    } catch (err) {
      console.warn("user_payments fetch error:", err);
    }

    const formattedDatabasePayments = databasePayments.map(payment => ({
      id: payment.id,
      plan: payment.plan_name,
      method: payment.method,
      txnId: payment.transaction_id,
      status: payment.status?.toLowerCase() || 'pending',
      date: payment.created_at,
      amount: payment.amount,
      user_id: payment.user_id,
      source: 'database'
    }));

    let localPayments = [];
    try {
      const localData = JSON.parse(localStorage.getItem('user_purchase_history') || '[]');
      localPayments = localData.filter(p => p.user_id === user.id);
    } catch (localErr) {
      console.warn("Local storage error:", localErr);
    }

    const allPayments = [...formattedDatabasePayments, ...localPayments];
    const uniquePayments = allPayments.filter((payment, index, self) =>
      index === self.findIndex(p => p.id === payment.id)
    );

    setPurchaseHistory(uniquePayments);

    // Activate latest approved plan
    const approvedPlans = uniquePayments.filter(p => p.status === "approved");
    if (approvedPlans.length > 0) {
      const latestPlan = approvedPlans.sort((a, b) =>
        new Date(b.date) - new Date(a.date)
      )[0];
      activateUserPlan(latestPlan);
    } else {
      setIsPremium(false);
    }
  };

  // Withdraw History Fetch - Preserves existing data
  const fetchWithdrawHistory = async () => {
    if (!user) return;

    setRefreshingHistory(true);

    try {
      const { data, error } = await supabase.from("withdraws")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (!error && data) {
        // Merge with existing, avoid duplicates
        const existingIds = new Set(withdrawHistory.map(w => w.id));
        const newWithdraws = data.filter(w => !existingIds.has(w.id));

        if (newWithdraws.length > 0) {
          setWithdrawHistory(prev => [...newWithdraws, ...prev]);
        }
      }
    } catch (err) {
      console.warn("Fetch withdraw history error:", err);
    } finally {
      setRefreshingHistory(false);
    }
  };

  // Time-based found event logic
  const scheduleNextFound = () => {
    if (!isScanning) return;

    // Clear existing timeout
    if (foundTimeoutRef.current) {
      clearTimeout(foundTimeoutRef.current);
    }

    // Generate random interval between 15-45 seconds
    const interval = Math.floor(Math.random() * 30000) + 15000; // 15-45 seconds
    nextFoundTimeRef.current = Date.now() + interval;

    foundTimeoutRef.current = setTimeout(() => {
      if (!isScanning) return;

      // Generate found amount between $1-$100
      const amount = parseFloat((Math.random() * 99 + 1).toFixed(2));
      const addr = randomAddress();

      // Create found entry
      const entry = {
        id: cryptoId(),
        addr,
        amount: amount,
        ts: new Date().toISOString(),
        isFound: true
      };

      // Add to stream
      setStream(prev => [entry, ...prev].slice(0, 40));

      // Update balances
      handleFound(amount);

      // Schedule next found event
      scheduleNextFound();

    }, interval);
  };

  // Clear found timeout
  const clearFoundTimeout = () => {
    if (foundTimeoutRef.current) {
      clearTimeout(foundTimeoutRef.current);
      foundTimeoutRef.current = null;
    }
    nextFoundTimeRef.current = null;
  };

  // Scanning effect - only updates stream and scanned count
  useEffect(() => {
    let interval = null;

    if (isScanning) {
      // Start found event scheduling
      scheduleNextFound();

      // Regular scanning interval (updates stream and scanned count)
      interval = setInterval(() => {
        setScanned((prev) => {
          if (prev >= TARGET) {
            setIsScanning(false);
            setScanProgress(100);
            clearFoundTimeout();
            return TARGET;
          }
          const inc = Math.max(1, Math.floor(Math.random() * (speedFast ? 400 : 40)));
          const next = Math.min(prev + inc, TARGET);
          setScanProgress(Math.round((next / TARGET) * 100));
          return next;
        });

        // Add regular (non-found) stream entries
        setStream((prev) => {
          const addr = randomAddress();
          const entry = {
            id: cryptoId(),
            addr,
            amount: null,
            ts: new Date().toISOString(),
            isFound: false
          };
          return [entry, ...prev].slice(0, 40);
        });
      }, speedFast ? 180 : 700);
    } else {
      clearFoundTimeout();
    }

    return () => {
      if (interval) clearInterval(interval);
      clearFoundTimeout();
    };
  }, [isScanning, speedFast]);

  function handleFound(amount) {
    setFoundCount((c) => c + 1);
    setTotalFound((t) => parseFloat((t + amount).toFixed(2)));
    setLastFound(amount);
    setAlertMsg(`💰 Found #${foundCount + 1} — $${amount.toFixed(2)}`);

    // Success effects
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    setTimeout(() => setAlertMsg(null), 2600);
  }

  const handleStart = () => {
    setIsScanning(true);
  };

  const handleStop = () => {
    setIsScanning(false);
    clearFoundTimeout();
  };

  const handleReset = () => {
    setIsScanning(false);
    clearFoundTimeout();
    setScanned(0);
    setScanProgress(0);
    setStream([]);
    setFoundCount(0);
    setTotalFound(0);
    setLastFound(null);
    setAlertMsg(null);
    nextFoundTimeRef.current = null;
  };

  function validateAddress(addr) {
    if (ethRegex.test(addr)) return "ETH";
    if (btcRegex.test(addr)) return "BTC";
    if (solRegex.test(addr)) return "SOL";
    return null;
  }

  const openWithdraw = (prefill) => {
    setWithdrawErr("");
    setWithdrawAddr("");
    setWithdrawAmt(prefill ? String(prefill) : "");
    setWithdrawModalOpen(true);
    setWithdrawSteps([]);
    setWithdrawProgress(0);
    setWithdrawStatusText("");
  };

  // Button animation function
  const triggerButtonAnimation = (buttonId, action) => {
    setButtonAnimations(prev => ({
      ...prev,
      [buttonId]: true
    }));

    if (action && typeof action === 'function') {
      action();
    }

    setTimeout(() => {
      setButtonAnimations(prev => ({
        ...prev,
        [buttonId]: false
      }));
    }, 300);
  };

  // Withdraw System - Updated with verification steps
  const submitWithdraw = async (e) => {
    e && e.preventDefault();
    setWithdrawErr("");

    if (!user) {
      setWithdrawErr("Please login to withdraw");
      return;
    }

    const userApprovedPlans = purchaseHistory.filter(p => p.status === "approved");

    if (userApprovedPlans.length === 0) {
      setWithdrawErr("Withdraw is allowed only for premium users. Please purchase premium and wait for admin approval.");
      return;
    }

    const latestPlan = userApprovedPlans.sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    )[0];

    const planActive = checkPlanActive(latestPlan);
    if (!planActive) {
      setWithdrawErr("Your premium plan has expired. Please renew your premium subscription.");
      return;
    }

    const addr = withdrawAddr.trim();
    const amt = parseFloat(withdrawAmt);

    // Address validation
    if (!addr) {
      setWithdrawErr("Enter a wallet address.");
      return;
    }

    const network = validateAddress(addr);
    if (!network) {
      setWithdrawErr("Address format not recognized (ETH / BTC / SOL).");
      return;
    }

    if (isNaN(amt) || amt <= 0) {
      setWithdrawErr("Enter a valid amount.");
      return;
    }

    if (amt > totalFound) {
      setWithdrawErr("Amount exceeds total found balance.");
      return;
    }

    // Clear any existing timers
    if (withdrawTimerRef.current) clearTimeout(withdrawTimerRef.current);
    if (withdrawStepIntervalRef.current) clearInterval(withdrawStepIntervalRef.current);

    // Initialize withdraw steps
    const initialSteps = withdrawStepConfigs.map((step, index) => ({
      ...step,
      id: index,
      active: index === 0,
      completed: false
    }));

    setWithdrawSteps(initialSteps);
    setWithdrawProgress(0);
    setWithdrawStatusText(`Starting ${network} withdrawal verification...`);

    // Step progression
    let currentStep = 0;
    const totalSteps = withdrawStepConfigs.length;
    const stepDuration = 6000; // 6 seconds per step

    withdrawStepIntervalRef.current = setInterval(() => {
      if (currentStep >= totalSteps) {
        clearInterval(withdrawStepIntervalRef.current);
        return;
      }

      // Update current step
      setWithdrawSteps(prev =>
        prev.map(step => ({
          ...step,
          active: step.id === currentStep,
          completed: step.id < currentStep
        }))
      );

      // Update progress (20% per step)
      const progress = ((currentStep + 1) / totalSteps) * 100;
      setWithdrawProgress(progress);

      // Update status text
      if (currentStep < totalSteps - 1) {
        setWithdrawStatusText(withdrawStepConfigs[currentStep].title);
      }

      currentStep++;

      // Complete after all steps
      if (currentStep === totalSteps) {
        setTimeout(() => {
          completeWithdraw(addr, amt, network);
        }, 1000);
      }
    }, stepDuration);

    // Set total timeout (30 seconds minimum)
    withdrawTimerRef.current = setTimeout(() => {
      if (withdrawStepIntervalRef.current) {
        clearInterval(withdrawStepIntervalRef.current);
      }
    }, totalSteps * stepDuration + 1000);
  };

  // Complete withdraw after verification
  const completeWithdraw = async (addr, amt, network) => {
    try {
      // Update balance
      setTotalFound(prev => {
        const newTotal = parseFloat((prev - amt).toFixed(2));
        return newTotal < 0 ? 0 : newTotal;
      });

      // Create withdraw record
      const newWithdraw = {
        id: `withdraw_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        addr,
        amount: amt,
        status: "Completed",
        network,
        created_at: new Date().toISOString(),
        user_id: user.id
      };

      // Update local state
      setWithdrawHistory(prev => [newWithdraw, ...prev]);

      // Try to save to Supabase
      try {
        await supabase.from("withdraws").insert([{
          ...newWithdraw,
          processed_at: new Date().toISOString()
        }]);
      } catch (dbErr) {
        console.error("Supabase error:", dbErr);
      }

      setWithdrawStatusText(`✅ Withdraw completed! $${amt} sent to ${network} address ${addr.slice(0, 8)}...`);

      // Success effects
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Mark all steps as completed
      setWithdrawSteps(prev =>
        prev.map(step => ({
          ...step,
          active: false,
          completed: true
        }))
      );

    } catch (err) {
      console.error("Withdraw error:", err);
      setWithdrawStatusText(`✅ Withdraw completed! $${amt} sent to ${addr.slice(0, 8)}...`);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    setTimeout(() => {
      setWithdrawModalOpen(false);
      setWithdrawProgress(0);
      setWithdrawStatusText("");
      setWithdrawAddr("");
      setWithdrawAmt("");
      setWithdrawSteps([]);

      // Clear timers
      if (withdrawTimerRef.current) clearTimeout(withdrawTimerRef.current);
      if (withdrawStepIntervalRef.current) clearInterval(withdrawStepIntervalRef.current);
    }, 2000);
  };

  // ALL Payments Need Admin Approval
  const submitPurchase = async () => {
    if (!user) {
      alert("Please login to purchase premium");
      return;
    }

    if (!selectedPlan || !selectedMethod) {
      alert("Select a plan and payment method first.");
      return;
    }

    // ALL METHODS REQUIRE TRANSACTION ID
    if (!purchaseTxnId || purchaseTxnId.trim().length < 4) {
      alert("Enter a valid transaction ID.");
      return;
    }

    setPurchaseStep("pending");

    try {
      // ALL PAYMENTS GO TO PENDING STATUS - NEED ADMIN APPROVAL
      const { data, error } = await supabase
        .from("user_payments")
        .insert([
          {
            transaction_id: purchaseTxnId.trim(),
            method: selectedMethod,
            plan_name: selectedPlan.label,
            amount: selectedPlan.price,
            status: "pending",
            user_id: user.id,
            created_at: new Date().toISOString()
          },
        ])
        .select();

      if (error) {
        console.error("user_payments insert error:", error);
      }

      const newPurchase = {
        id: data?.[0]?.id || `db_${Date.now()}`,
        plan: selectedPlan.label,
        method: selectedMethod,
        txnId: purchaseTxnId.trim(),
        status: "pending",
        date: new Date().toISOString(),
        amount: selectedPlan.price,
        user_id: user.id,
        source: data ? 'database' : 'local'
      };

      const existingPurchases = JSON.parse(localStorage.getItem('user_purchase_history') || '[]');
      const updatedPurchases = [newPurchase, ...existingPurchases];
      localStorage.setItem('user_purchase_history', JSON.stringify(updatedPurchases));

      setPurchaseHistory(prev => [newPurchase, ...prev]);

      // Success effects
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });

      // Show success message
      setSuccessMessage("Payment submitted successfully! Admin will approve within 24 hours.");
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setPremiumModalOpen(false);
      }, 3000);

    } catch (err) {
      console.error("Purchase error:", err);

      const newPurchase = {
        id: `local_${Date.now()}`,
        plan: selectedPlan.label,
        method: selectedMethod,
        txnId: purchaseTxnId.trim(),
        status: "pending",
        date: new Date().toISOString(),
        amount: selectedPlan.price,
        user_id: user.id,
        source: 'local'
      };

      const existingPurchases = JSON.parse(localStorage.getItem('user_purchase_history') || '[]');
      const updatedPurchases = [newPurchase, ...existingPurchases];
      localStorage.setItem('user_purchase_history', JSON.stringify(updatedPurchases));

      setPurchaseHistory(prev => [newPurchase, ...prev]);

      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });

      // Show success message
      setSuccessMessage("Payment submitted successfully! Admin will approve within 24 hours.");
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setPremiumModalOpen(false);
      }, 3000);
    }

    setPurchaseStep("select");
    setSelectedPlan(null);
    setSelectedMethod(null);
    setPurchaseTxnId("");
  };

  // Telegram contact function
  const contactTelegram = () => {
    window.open('https://t.me/Cryptography55', '_blank');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // Render withdraw verification steps
  const renderWithdrawSteps = () => {
    if (withdrawSteps.length === 0) return null;

    return (
      <div className="withdraw-steps">
        {withdrawSteps.map((step) => (
          <div key={step.id} className="withdraw-step">
            <div className={`step-icon ${step.active ? 'active' : ''} ${step.completed ? 'completed' : ''}`}>
              {step.completed ? (
                <FiCheck size={16} />
              ) : step.active ? (
                <div className="button-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
              ) : (
                <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)' }} />
              )}
            </div>
            <div className="step-info">
              <div className="step-title">{step.title}</div>
              <div className="step-desc">{step.desc}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "scanning":
        return (
          <div className="card glass-card">
            <div className="card-header">
              <div className="flex items-center gap-3">
                <div className="card-title">
                  <FiSearch size={24} />
                  Blockchain Scanner
                </div>
                <div className="text-sm text-muted">
                  Target: {formatNumber(TARGET)} addresses
                </div>
              </div>
              <button
                onClick={() => triggerButtonAnimation('contact', contactTelegram)}
                className={`btn btn-outline ${buttonAnimations['contact'] ? 'btn-pressed' : ''}`}
              >
                <FiMessageSquare size={16} />
                Contact
              </button>
            </div>

            <div className="mt-6">
              {/* Progress Bar */}
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex gap-3 mb-6 flex-wrap">
                <button
                  onClick={() => triggerButtonAnimation('startStop', () => isScanning ? handleStop() : handleStart())}
                  className={`btn ${isScanning ? 'btn-danger' : 'btn-success'} flex-1 min-w-[140px] ${buttonAnimations['startStop'] ? 'btn-pressed' : ''}`}
                >
                  {isScanning ? (
                    <>
                      <FiPause size={16} />
                      Stop Scanning
                    </>
                  ) : (
                    <>
                      <FiPlay size={16} />
                      Start Scanning
                    </>
                  )}
                </button>

                <button
                  onClick={() => triggerButtonAnimation('speed', () => setSpeedFast(!speedFast))}
                  className={`btn ${speedFast ? 'btn-secondary' : ''} flex-1 min-w-[140px] ${buttonAnimations['speed'] ? 'btn-pressed' : ''}`}
                >
                  <FiZap size={16} />
                  {speedFast ? 'Fast Mode' : 'Slow Mode'}
                </button>

                <button
                  onClick={() => triggerButtonAnimation('reset', handleReset)}
                  className={`btn btn-warning flex-1 min-w-[140px] ${buttonAnimations['reset'] ? 'btn-pressed' : ''}`}
                >
                  <FiRefreshCw size={16} />
                  Reset
                </button>

                <button
                  onClick={() => triggerButtonAnimation('withdraw', () => openWithdraw(lastFound))}
                  className={`btn btn-primary flex-1 min-w-[140px] ${buttonAnimations['withdraw'] ? 'btn-pressed' : ''}`}
                  disabled={!lastFound}
                >
                  <RiWallet3Line size={16} />
                  Withdraw
                </button>
              </div>

              {/* Stream Display */}
              <div className="stream-container">
                {stream.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted p-8">
                    <FiSearch size={48} className="mb-4 opacity-50 animate-pulse" />
                    <p className="font-semibold text-lg mb-2">Ready to scan</p>
                    <p className="text-sm text-center">Press "Start Scanning" to begin blockchain analysis</p>
                  </div>
                ) : (
                  stream.map((s, index) => (
                    <motion.div
                      key={s.id}
                      className="stream-row"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="stream-address">
                        {s.addr}
                      </div>
                      {s.amount ? (
                        <motion.div
                          className="stream-amount"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          ${s.amount.toFixed(2)}
                        </motion.div>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-muted animate-pulse" />
                      )}
                    </motion.div>
                  ))
                )}
              </div>

              {/* Next Found Timer Removed */}

              {/* Contact Button */}
              <div className="mt-6">
                <button
                  onClick={() => triggerButtonAnimation('contactBottom', contactTelegram)}
                  className={`btn btn-outline w-full ${buttonAnimations['contactBottom'] ? 'btn-pressed' : ''}`}
                >
                  <FiMessageSquare className="mr-2" />
                  Need Help? Contact Admin @Cryptography55
                </button>
              </div>
            </div>
          </div>
        );

      case "stats":
        return (
          <div className="card glass-card">
            <div className="card-header">
              <div className="card-title">
                <FiActivity size={24} />
                Statistics
              </div>
            </div>

            <div className="mt-4">
              <div className="stats-grid">
                <motion.div
                  className="stat-item"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="stat-item-label">Addresses Scanned</div>
                  <div className="stat-item-value">{formatNumber(scanned)}</div>
                </motion.div>
                <motion.div
                  className="stat-item"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="stat-item-label">Total Found</div>
                  <div className="stat-item-value">{foundCount}</div>
                </motion.div>
                <motion.div
                  className="stat-item"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="stat-item-label">Total Balance</div>
                  <div className="stat-item-value">${totalFound.toFixed(2)}</div>
                </motion.div>
                <motion.div
                  className="stat-item"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="stat-item-label">Last Found</div>
                  <div className="stat-item-value">
                    ${lastFound ? lastFound.toFixed(2) : '0.00'}
                  </div>
                </motion.div>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Scan Progress</h3>
                  <span className="text-primary font-bold">{scanProgress}%</span>
                </div>
                <div className="progress-container">
                  <div className="progress-bar" style={{ width: `${scanProgress}%` }} />
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-bold mb-4">Need Help?</h3>
                <button
                  onClick={() => triggerButtonAnimation('contactStats', contactTelegram)}
                  className={`btn btn-outline w-full ${buttonAnimations['contactStats'] ? 'btn-pressed' : ''}`}
                >
                  <FiMessageSquare className="mr-2" />
                  Contact Admin @Cryptography55
                </button>
              </div>
            </div>
          </div>
        );

      case "premium":
        return (
          <div className="card glass-card">
            <div className="card-header">
              <div className="card-title">
                <FiShield size={24} />
                Premium Membership
              </div>
            </div>

            {isPremium ? (
              <div className="premium-status">
                <div className="premium-badge">
                  <FiCheck size={16} />
                  PREMIUM ACTIVE
                </div>
                <div className="mb-6">
                  <div className="text-2xl font-bold mb-2 gradient-text">
                    {daysLeft} days remaining
                  </div>
                  <div className="text-sm text-muted">
                    Withdrawals: <span className="text-success font-semibold">ENABLED</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-surface rounded-lg p-4">
                    <div className="text-sm text-muted mb-1">Activation Date</div>
                    <div className="font-semibold">
                      {premiumStartDate ? premiumStartDate.toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                  <div className="bg-surface rounded-lg p-4">
                    <div className="text-sm text-muted mb-1">Expiry Date</div>
                    <div className="font-semibold">
                      {premiumEndDate ? premiumEndDate.toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-6">
                <FiShield size={64} className="mx-auto mb-4 text-primary animate-pulse" />
                <h3 className="text-2xl font-bold mb-2">Upgrade to Premium</h3>
                <p className="text-muted mb-6">
                  Enable instant withdrawals and access premium features
                </p>
                <button
                  onClick={() => triggerButtonAnimation('upgrade', () => setPremiumModalOpen(true))}
                  className={`btn btn-primary w-full ${buttonAnimations['upgrade'] ? 'btn-pressed' : ''}`}
                >
                  <FiArrowUp size={16} />
                  Upgrade Now
                </button>
              </div>
            )}

            <div className="mt-8">
              <div className="card-header">
                <div className="card-title">
                  <RiHistoryLine size={24} />
                  Purchase History
                </div>
              </div>

              <div className="history-list">
                {purchaseHistory.length === 0 ? (
                  <div className="empty-small">
                    No purchases yet
                  </div>
                ) : (
                  purchaseHistory.map((purchase, index) => (
                    <motion.div
                      key={purchase.id}
                      className="history-item"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="history-info">
                        <div className="font-semibold">{purchase.plan}</div>
                        <div className="text-sm text-muted">
                          {purchase.method} • ${purchase.amount}
                        </div>
                        <div className="text-xs text-muted mt-1">
                          {new Date(purchase.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className={`history-status ${purchase.status === "approved" ? "status-completed" :
                          purchase.status === "rejected" ? "status-pending" : "status-pending"
                        }`}>
                        {purchase.status.toUpperCase()}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case "history":
        return (
          <div className="card glass-card">
            <div className="card-header">
              <div className="card-title">
                <FiClock size={24} />
                Withdrawal History
              </div>
              <button
                onClick={() => triggerButtonAnimation('refresh', fetchWithdrawHistory)}
                className={`btn btn-outline ${refreshingHistory ? 'loading' : ''} ${buttonAnimations['refresh'] ? 'btn-pressed' : ''}`}
                disabled={refreshingHistory}
              >
                {refreshingHistory ? (
                  <div className="button-spinner"></div>
                ) : (
                  <>
                    <FiRefreshCw size={16} />
                    Refresh
                  </>
                )}
              </button>
            </div>

            <div className="history-list">
              {withdrawHistory.length === 0 ? (
                <div className="empty-small">
                  No withdrawals yet
                </div>
              ) : (
                withdrawHistory.map((w, index) => (
                  <motion.div
                    key={w.id || w.created_at || w.addr}
                    className="history-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="history-info">
                      <div className="history-address">
                        {w.addr?.slice?.(0, 12) ?? w.addr}...
                      </div>
                      <div className="history-amount">
                        ${Number(w.amount ?? w.amount).toFixed(2)}
                      </div>
                      <div className="history-date">
                        {new Date(w.created_at || w.createdAt || w.ts || Date.now()).toLocaleString()}
                      </div>
                    </div>
                    <div className="history-status status-completed">
                      {w.status || "Completed"}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="app page-transition">
      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="success-message"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="success-content">
              <div className="success-icon">
                <FiCheck size={24} />
              </div>
              <div>
                <div className="success-title">Payment Submitted!</div>
                <div className="success-subtitle">{successMessage}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="header">
        <div className="flex items-center gap-4">
          <motion.div
            className="header-title"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Crypto Balance Finder
          </motion.div>
          {isPremium && (
            <motion.span
              className="premium-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <FiShield size={12} />
              PREMIUM
            </motion.span>
          )}
        </div>

        <div className="header-stats">
          <motion.div
            className="stat-box"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="stat-label">Scanned</div>
            <div className="stat-value">{formatNumber(scanned)}</div>
          </motion.div>
          <motion.div
            className="stat-box"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="stat-label">Found</div>
            <div className="stat-value">{foundCount}</div>
          </motion.div>
          <motion.div
            className="stat-box"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="stat-label">Balance</div>
            <div className="stat-value">${totalFound.toFixed(2)}</div>
          </motion.div>

          <button
            onClick={() => triggerButtonAnimation('premiumHeader', () => {
              setPremiumModalOpen(true);
              setSelectedPlan(null);
              setSelectedMethod(null);
              setPurchaseStep("select");
              setPurchaseTxnId("");
            })}
            className={`btn btn-primary ${buttonAnimations['premiumHeader'] ? 'btn-pressed' : ''}`}
          >
            <FiStar size={16} />
            Premium
          </button>

          <button
            onClick={() => triggerButtonAnimation('logout', handleLogout)}
            className={`btn btn-outline ${buttonAnimations['logout'] ? 'btn-pressed' : ''}`}
          >
            <FiLogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        {/* Desktop Layout */}
        <div className="desktop-view">
          {/* Left Column - Scanner */}
          <div className="left">
            <div className="card glass-card">
              <div className="card-header">
                <div className="flex items-center gap-3">
                  <div className="card-title">
                    <FiSearch size={24} />
                    Blockchain Scanner
                  </div>
                  <div className="text-sm text-muted">
                    Target: {formatNumber(TARGET)} addresses
                  </div>
                </div>
                <button
                  onClick={() => triggerButtonAnimation('contactDesktop', contactTelegram)}
                  className={`btn btn-outline ${buttonAnimations['contactDesktop'] ? 'btn-pressed' : ''}`}
                >
                  <FiMessageSquare size={16} />
                  Contact Admin
                </button>
              </div>

              <div className="mt-6">
                {/* Progress Bar */}
                <div className="progress-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>

                {/* Control Buttons */}
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={() => triggerButtonAnimation('startStopDesktop', () => isScanning ? handleStop() : handleStart())}
                    className={`btn ${isScanning ? 'btn-danger' : 'btn-success'} flex-1 ${buttonAnimations['startStopDesktop'] ? 'btn-pressed' : ''}`}
                  >
                    {isScanning ? (
                      <>
                        <FiPause size={16} />
                        Stop Scanning
                      </>
                    ) : (
                      <>
                        <FiPlay size={16} />
                        Start Scanning
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => triggerButtonAnimation('speedDesktop', () => setSpeedFast(!speedFast))}
                    className={`btn ${speedFast ? 'btn-secondary' : ''} flex-1 ${buttonAnimations['speedDesktop'] ? 'btn-pressed' : ''}`}
                  >
                    <FiZap size={16} />
                    {speedFast ? 'Fast Mode' : 'Slow Mode'}
                  </button>

                  <button
                    onClick={() => triggerButtonAnimation('resetDesktop', handleReset)}
                    className={`btn btn-warning flex-1 ${buttonAnimations['resetDesktop'] ? 'btn-pressed' : ''}`}
                  >
                    <FiRefreshCw size={16} />
                    Reset
                  </button>

                  <button
                    onClick={() => triggerButtonAnimation('withdrawDesktop', () => openWithdraw(lastFound))}
                    className={`btn btn-primary flex-1 ${buttonAnimations['withdrawDesktop'] ? 'btn-pressed' : ''}`}
                    disabled={!lastFound}
                  >
                    <RiWallet3Line size={16} />
                    Withdraw
                  </button>
                </div>

                {/* Stream Display */}
                <div className="stream-container">
                  {stream.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted p-8">
                      <FiSearch size={48} className="mb-4 opacity-50 animate-pulse" />
                      <p className="font-semibold text-lg mb-2">Ready to scan</p>
                      <p className="text-sm text-center">Press "Start Scanning" to begin blockchain analysis</p>
                    </div>
                  ) : (
                    stream.map((s, index) => (
                      <motion.div
                        key={s.id}
                        className="stream-row"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="stream-address">
                          {s.addr}
                        </div>
                        {s.amount ? (
                          <motion.div
                            className="stream-amount"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            ${s.amount.toFixed(2)}
                          </motion.div>
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-muted animate-pulse" />
                        )}
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Next Found Timer */}
                {isScanning && nextFoundTimeRef.current && (
                  <div className="mt-4 p-3 bg-surface rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted">Next expected find:</div>
                      <div className="text-primary font-semibold">
                        {Math.max(0, Math.round((nextFoundTimeRef.current - Date.now()) / 1000))}s
                      </div>
                    </div>
                    <div className="text-xs text-muted mt-1">
                      Found events occur every 15-45 seconds while scanning
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Info */}
          <div className="right">
            {/* Premium Status */}
            <div className="card glass-card mb-4">
              <div className="card-header">
                <div className="card-title">
                  <FiShield size={24} />
                  Premium Status
                </div>
              </div>

              {isPremium ? (
                <div className="premium-status">
                  <div className="premium-badge">
                    <FiCheck size={16} />
                    ACTIVE
                  </div>
                  <div className="mb-4">
                    <div className="text-lg font-bold mb-2">
                      {daysLeft} days remaining
                    </div>
                    <div className="text-sm text-muted">
                      Withdrawals: <span className="text-success font-semibold">ENABLED</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6">
                  <FiShield size={48} className="mx-auto mb-4 text-muted animate-pulse" />
                  <h3 className="text-lg font-bold mb-2">Upgrade to Premium</h3>
                  <p className="text-sm text-muted mb-4">
                    Enable instant withdrawals and access premium features
                  </p>
                  <button
                    onClick={() => triggerButtonAnimation('upgradeDesktop', () => setPremiumModalOpen(true))}
                    className={`btn btn-primary w-full ${buttonAnimations['upgradeDesktop'] ? 'btn-pressed' : ''}`}
                  >
                    <FiArrowUp size={16} />
                    Upgrade Now
                  </button>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="card glass-card mb-4">
              <div className="card-header">
                <div className="card-title">
                  <FiActivity size={24} />
                  Quick Stats
                </div>
              </div>

              <div className="stats-grid">
                <motion.div
                  className="stat-item"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="stat-item-label">Last Found</div>
                  <div className="stat-item-value">
                    ${lastFound ? lastFound.toFixed(2) : '0.00'}
                  </div>
                </motion.div>
                <motion.div
                  className="stat-item"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="stat-item-label">Total Value</div>
                  <div className="stat-item-value">
                    ${totalFound.toFixed(2)}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Withdraw History */}
            <div className="card glass-card">
              <div className="card-header">
                <div className="card-title">
                  <FiClock size={24} />
                  Recent Withdrawals
                </div>
                <button
                  onClick={() => triggerButtonAnimation('refreshDesktop', fetchWithdrawHistory)}
                  className={`btn btn-outline ${refreshingHistory ? 'loading' : ''} ${buttonAnimations['refreshDesktop'] ? 'btn-pressed' : ''}`}
                  disabled={refreshingHistory}
                >
                  {refreshingHistory ? (
                    <div className="button-spinner"></div>
                  ) : (
                    <>
                      <FiRefreshCw size={16} />
                      Refresh
                    </>
                  )}
                </button>
              </div>

              <div className="history-list">
                {withdrawHistory.slice(0, 3).map((w, index) => (
                  <motion.div
                    key={w.id}
                    className="history-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="history-info">
                      <div className="history-address">
                        {w.addr?.slice?.(0, 12) ?? w.addr}...
                      </div>
                      <div className="history-amount">
                        ${Number(w.amount ?? w.amount).toFixed(2)}
                      </div>
                    </div>
                    <div className="history-status status-completed">
                      {w.status || "Completed"}
                    </div>
                  </motion.div>
                ))}
                {withdrawHistory.length === 0 && (
                  <div className="empty-small">No withdrawals yet</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="mobile-view">
          <div className="mobile-content">
            {renderContent()}
          </div>

          {/* Bottom Navigation */}
          <nav className="mobile-nav">
            <div className="nav-items">
              <motion.button
                className={`nav-item ${activeTab === "scanning" ? "active" : ""}`}
                onClick={() => {
                  setButtonAnimations(prev => ({ ...prev, navScan: true }));
                  setActiveTab("scanning");
                  setTimeout(() => setButtonAnimations(prev => ({ ...prev, navScan: false })), 300);
                }}
                whileTap={{ scale: 0.9 }}
              >
                <FiSearch className="nav-icon" />
                <span className="nav-label">Scan</span>
              </motion.button>

              <motion.button
                className={`nav-item ${activeTab === "stats" ? "active" : ""}`}
                onClick={() => {
                  setButtonAnimations(prev => ({ ...prev, navStats: true }));
                  setActiveTab("stats");
                  setTimeout(() => setButtonAnimations(prev => ({ ...prev, navStats: false })), 300);
                }}
                whileTap={{ scale: 0.9 }}
              >
                <FiActivity className="nav-icon" />
                <span className="nav-label">Stats</span>
              </motion.button>

              <motion.button
                className={`nav-item ${activeTab === "premium" ? "active" : ""}`}
                onClick={() => {
                  setButtonAnimations(prev => ({ ...prev, navPremium: true }));
                  setActiveTab("premium");
                  setTimeout(() => setButtonAnimations(prev => ({ ...prev, navPremium: false })), 300);
                }}
                whileTap={{ scale: 0.9 }}
              >
                <FiShield className="nav-icon" />
                <span className="nav-label">Premium</span>
              </motion.button>

              <motion.button
                className={`nav-item ${activeTab === "history" ? "active" : ""}`}
                onClick={() => {
                  setButtonAnimations(prev => ({ ...prev, navHistory: true }));
                  setActiveTab("history");
                  setTimeout(() => setButtonAnimations(prev => ({ ...prev, navHistory: false })), 300);
                }}
                whileTap={{ scale: 0.9 }}
              >
                <FiClock className="nav-icon" />
                <span className="nav-label">History</span>
              </motion.button>
            </div>
          </nav>
        </div>
      </main>

      {/* Alert */}
      <AnimatePresence>
        {alertMsg && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="found-alert"
          >
            <FiAlertCircle className="mr-2" />
            {alertMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {withdrawModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="modal-content"
              transition={{ type: "spring", stiffness: 200 }}
            >
              <h3 className="modal-title">Withdraw Request</h3>

              <form onSubmit={submitWithdraw}>
                <div className="form-group">
                  <label className="form-label">
                    <RiWallet3Line className="mr-2" />
                    Wallet Address
                  </label>
                  <input
                    value={withdrawAddr}
                    onChange={(e) => setWithdrawAddr(e.target.value)}
                    placeholder="0x or bc1..."
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FiDollarSign className="mr-2" />
                    Amount (USD)
                  </label>
                  <input
                    value={withdrawAmt}
                    onChange={(e) => setWithdrawAmt(e.target.value)}
                    placeholder={lastFound ? String(lastFound) : "0.00"}
                    className="form-input"
                  />
                </div>

                {withdrawErr && (
                  <motion.div
                    className="error-message"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <FiAlertCircle className="mr-2" />
                    {withdrawErr}
                  </motion.div>
                )}

                {/* Withdraw Verification Steps */}
                {withdrawSteps.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-3">Withdrawal Verification</h4>
                    {renderWithdrawSteps()}

                    {withdrawProgress > 0 && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Processing</span>
                          <span>{Math.round(withdrawProgress)}%</span>
                        </div>
                        <div className="progress-container">
                          <motion.div
                            className="progress-bar"
                            initial={{ width: 0 }}
                            animate={{ width: `${withdrawProgress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                    )}

                    {withdrawStatusText && (
                      <motion.div
                        className="success-message mt-3"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                      >
                        <FiCheck className="mr-2" />
                        {withdrawStatusText}
                      </motion.div>
                    )}
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <motion.button
                    type="button"
                    onClick={() => {
                      setWithdrawModalOpen(false);
                      // Clear any ongoing timers
                      if (withdrawTimerRef.current) clearTimeout(withdrawTimerRef.current);
                      if (withdrawStepIntervalRef.current) clearInterval(withdrawStepIntervalRef.current);
                    }}
                    className="btn btn-outline flex-1"
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="btn btn-primary flex-1"
                    whileTap={{ scale: 0.95 }}
                    disabled={withdrawSteps.length > 0}
                  >
                    {withdrawSteps.length > 0 ? 'Processing...' : 'Submit Request'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Modal */}
      <AnimatePresence>
        {premiumModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="modal-content modal-wide"
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="modal-title">Premium Plans</h3>
                <button
                  onClick={() => setPremiumModalOpen(false)}
                  className="btn btn-outline"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {plans.map((p) => (
                  <motion.div
                    key={p.id}
                    className={`glass-card p-4 cursor-pointer transition-all ${selectedPlan?.id === p.id ? 'border-primary border-2' : ''}`}
                    onClick={() => setSelectedPlan(p)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{p.icon}</span>
                      <span className="text-lg font-bold">{p.label}</span>
                    </div>
                    <div className="text-3xl font-bold gradient-text mb-2">
                      ${p.price}
                    </div>
                    <div className="text-sm text-muted">
                      {p.duration === 3650 ? 'Lifetime access' : `${p.duration} days`}
                    </div>
                  </motion.div>
                ))}
              </div>

              {selectedPlan && (
                <div className="glass-card p-6 mb-6">
                  <h4 className="text-lg font-bold mb-4">Payment Method</h4>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {methods.map((m) => (
                      <motion.button
                        key={m.name}
                        onClick={() => setSelectedMethod(m.name)}
                        className={`btn ${selectedMethod === m.name ? 'btn-primary' : 'btn-outline'}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="mr-2">{m.icon}</span>
                        {m.name}
                      </motion.button>
                    ))}
                  </div>

                  {selectedMethod && (
                    <>
                      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                        <h5 className="font-bold text-primary mb-3 flex items-center">
                          <FiAlertCircle className="mr-2" />
                          Payment Instructions for {selectedMethod}
                        </h5>

                        {selectedMethod === "Binance Pay" ? (
                          <div>
                            <p className="text-sm mb-3">
                              Send <strong>${selectedPlan.price}</strong> to Binance ID:
                            </p>
                            <div className="bg-surface rounded-lg p-4 mb-3 text-center">
                              <div className="text-2xl font-bold text-warning">903008401</div>
                            </div>
                            <p className="text-xs text-muted text-center">
                              After payment, enter Transaction ID below
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm mb-3 text-center">
                              For {selectedMethod} payments, please contact admin on Telegram first
                            </p>
                            <motion.button
                              onClick={contactTelegram}
                              className="btn btn-primary w-full mb-3"
                              whileTap={{ scale: 0.95 }}
                            >
                              <FiMessageSquare className="mr-2" />
                              Contact Admin on Telegram
                            </motion.button>
                            <p className="text-xs text-muted text-center">
                              Contact admin for payment details, then enter Transaction ID below
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="form-group mb-6">
                        <label className="form-label">Transaction ID</label>
                        <input
                          placeholder="Enter transaction ID"
                          value={purchaseTxnId}
                          onChange={(e) => setPurchaseTxnId(e.target.value)}
                          className="form-input"
                        />
                      </div>

                      <div className="flex gap-3">
                        <motion.button
                          onClick={submitPurchase}
                          className="btn btn-primary flex-1"
                          whileTap={{ scale: 0.95 }}
                        >
                          Submit Purchase
                        </motion.button>
                        <motion.button
                          onClick={() => {
                            setSelectedPlan(null);
                            setSelectedMethod(null);
                            setPurchaseTxnId("");
                          }}
                          className="btn btn-outline flex-1"
                          whileTap={{ scale: 0.95 }}
                        >
                          Reset
                        </motion.button>
                      </div>

                      <div className="mt-6 text-sm text-muted">
                        <p className="mb-2">
                          <strong>Important:</strong> All payments require admin approval.
                          Contact admin after submission for faster approval.
                        </p>
                        <button
                          onClick={contactTelegram}
                          className="text-primary font-semibold hover:underline"
                        >
                          Contact Admin: @Cryptography55
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CryptoBalanceFinder;