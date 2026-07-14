import React, { useState, useEffect } from 'react';
import { Coins, Flame, Hammer, TrendingUp, Sparkles, Zap, ShieldCheck, User, Save, LogOut, ShieldAlert } from 'lucide-react';
import { MiningLedger, Withdrawal } from './MiningLedger';
import { useLanguage } from '../LanguageContext';

type TabType = 'staking' | 'mining' | 'deflation';

export default function MiningStakingForge() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('staking');
  
  // Account settings & SLX persistence states
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [savedSlx, setSavedSlx] = useState<number>(0);
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [isRegistering, setIsRegistering] = useState<boolean>(true);
  const [accountError, setAccountError] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [logMessages, setLogMessages] = useState<string[]>([]);

  // Server-side Miner and History states
  interface ServerMiner {
    username: string;
    hashRate: number;
    balance: number;
    isOnline: boolean;
    totalMined: number;
  }

  interface ServerHistory {
    id: string;
    username: string;
    action: string;
    amount: number;
    timestamp: string;
  }

  const [serverMiners, setServerMiners] = useState<ServerMiner[]>([]);
  const [serverHistory, setServerHistory] = useState<ServerHistory[]>([]);
  const [serverWithdrawals, setServerWithdrawals] = useState<Withdrawal[]>([]);

  // User withdrawal states
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
  const [withdrawWalletInput, setWithdrawWalletInput] = useState<string>('');
  const [withdrawAmountInput, setWithdrawAmountInput] = useState<string>('');
  const [withdrawError, setWithdrawError] = useState<string>('');
  const [withdrawSuccess, setWithdrawSuccess] = useState<boolean>(false);

  // Mining state declarations
  const [isMining, setIsMining] = useState<boolean>(false);
  const [miningSpeed, setMiningSpeed] = useState<number>(0); // GH/s
  const [minedRewards, setMinedRewards] = useState<number>(0.0);
  const [minedMultiplier, setMinedMultiplier] = useState<number>(1.0);

  // Interactive High Performance Staking & Burning & Upgrades States
  const [stakedSlx, setStakedSlx] = useState<number>(0);
  const [stakedApy, setStakedApy] = useState<number>(142.4);
  const [stakingRewards, setStakingRewards] = useState<number>(0);
  const [stakeInputVal, setStakeInputVal] = useState<string>('');
  const [totalBurnedSlx, setTotalBurnedSlx] = useState<number>(0);
  const [burnInputVal, setBurnInputVal] = useState<string>('');
  const [hardwareTier, setHardwareTier] = useState<string>('vps');
  const [coolingTier, setCoolingTier] = useState<string>('passive');

  // Math-based helper functions for Hashrate and Rewards
  const getHardwareBase = () => {
    if (hardwareTier === 'quantum') return 5000.0;
    if (hardwareTier === 'asic') return 1800.0;
    if (hardwareTier === 'pro') return 600.0;
    return 245.8;
  };

  const getCoolingMultiplier = () => {
    if (coolingTier === 'nitrogen') return 1.65;
    if (coolingTier === 'water') return 1.25;
    return 1.0;
  };

  const getOptimizerMultiplier = () => {
    return isOptimized ? 1.40 : 1.0;
  };

  const getStakingBoost = () => {
    return stakedSlx * 1.5; // +1.5 GH/s per 1 $SLX staked
  };

  const getCalculatedHashrate = () => {
    if (!isMining) return 0;
    const base = getHardwareBase();
    const coolMult = getCoolingMultiplier();
    const optMult = getOptimizerMultiplier();
    const stakeBoost = getStakingBoost();
    return Number(((base * coolMult * optMult) + stakeBoost).toFixed(2));
  };

  const getBurnMultiplier = () => {
    return 1.0 + (totalBurnedSlx * 0.01); // +1% per 1 $SLX burned
  };

  const getCalculatedRewardRate = () => {
    let baseRate = 0.0042; // standard reward rate (SLX/sec)
    if (hardwareTier === 'pro') baseRate = 0.0105;
    if (hardwareTier === 'asic') baseRate = 0.0315;
    if (hardwareTier === 'quantum') baseRate = 0.0875;

    const coolMult = getCoolingMultiplier();
    const optMult = isOptimized ? 1.40 : 1.0;
    const burnMult = getBurnMultiplier();

    return baseRate * coolMult * optMult * burnMult;
  };

  // Upgrades shop purchase logic
  const handleUpgradeHardware = (tier: 'pro' | 'asic' | 'quantum', cost: number) => {
    if (!currentUser) {
      addLog(t('BŁĄD: Zaloguj się, aby kupić ulepszenia!', 'ERROR: Log in to purchase upgrades!'));
      return;
    }
    if (savedSlx < cost) {
      addLog(t(`BŁĄD: Za mało $SLX (wymagane: ${cost} $SLX)`, `ERROR: Not enough $SLX (required: ${cost} $SLX)`));
      return;
    }

    const newSlx = Number((savedSlx - cost).toFixed(6));
    setSavedSlx(newSlx);
    setHardwareTier(tier);

    const usersData = localStorage.getItem('solax_users');
    const usersList = usersData ? JSON.parse(usersData) : {};
    if (usersList[currentUser]) {
      usersList[currentUser].savedSlx = newSlx;
      usersList[currentUser].hardwareTier = tier;
      localStorage.setItem('solax_users', JSON.stringify(usersList));
    }
    
    addLog(t(`ZAKUPIONO: Ulepszono węzeł do poziomu ${tier.toUpperCase()} (-${cost} $SLX)`, `PURCHASED: Upgraded node to ${tier.toUpperCase()} (-${cost} $SLX)`));
    triggerServerSync(currentUser, newSlx);
  };

  const handleUpgradeCooling = (tier: 'water' | 'nitrogen', cost: number) => {
    if (!currentUser) {
      addLog(t('BŁĄD: Zaloguj się, aby kupić ulepszenia!', 'ERROR: Log in to purchase upgrades!'));
      return;
    }
    if (savedSlx < cost) {
      addLog(t(`BŁĄD: Za mało $SLX (wymagane: ${cost} $SLX)`, `ERROR: Not enough $SLX (required: ${cost} $SLX)`));
      return;
    }

    const newSlx = Number((savedSlx - cost).toFixed(6));
    setSavedSlx(newSlx);
    setCoolingTier(tier);

    const usersData = localStorage.getItem('solax_users');
    const usersList = usersData ? JSON.parse(usersData) : {};
    if (usersList[currentUser]) {
      usersList[currentUser].savedSlx = newSlx;
      usersList[currentUser].coolingTier = tier;
      localStorage.setItem('solax_users', JSON.stringify(usersList));
    }

    addLog(t(`ZAKUPIONO: Ulepszono chłodzenie do poziomu ${tier.toUpperCase()} (-${cost} $SLX)`, `PURCHASED: Upgraded cooling to ${tier.toUpperCase()} (-${cost} $SLX)`));
    triggerServerSync(currentUser, newSlx);
  };

  const triggerServerSync = async (user: string, balance: number) => {
    try {
      await fetch('/api/mining/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user,
          hashRate: isMining ? getCalculatedHashrate() : 0,
          balance: balance
        })
      });
      fetchNetworkStatus();
    } catch (e) {
      console.warn("Sync omitted:", e);
    }
  };

  // High performance node optimization states
  const [isOptimized, setIsOptimized] = useState<boolean>(() => {
    return localStorage.getItem('solax_miner_optimized') === 'true';
  });
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optStatus, setOptStatus] = useState<string>('');

  const triggerOptimization = async () => {
    setIsOptimizing(true);
    setOptStatus(t('Analiza opóźnień RPC...', 'Analyzing RPC latency...'));
    
    await new Promise(r => setTimeout(r, 800));
    setOptStatus(t('Strojenie wątków CPU (Pinning)...', 'Tuning CPU threads (Pinning)...'));
    
    await new Promise(r => setTimeout(r, 800));
    setOptStatus(t('Integracja z Jito MEV Boost...', 'Integrating with Jito MEV Boost...'));
    
    await new Promise(r => setTimeout(r, 800));
    setOptStatus(t('Uruchomienie priorytetowych opłat...', 'Optimizing priority fees routing...'));
    
    await new Promise(r => setTimeout(r, 600));
    
    setIsOptimizing(false);
    setIsOptimized(true);
    localStorage.setItem('solax_miner_optimized', 'true');
    addLog(t('OPTYMALIZACJA OK: Węzeł działa z optymalizacją Jito MEV', 'OPTIMIZATION OK: Node running with Jito MEV optimization'));
  };

  const resetOptimization = () => {
    setIsOptimized(false);
    localStorage.removeItem('solax_miner_optimized');
    addLog(t('OPTYMALIZACJA OFF: Przywrócono standardową konfigurację', 'OPTIMIZATION OFF: Restored standard configuration'));
  };

  const addLog = (msg: string) => {
    setLogMessages(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 3)]);
  };

  const fetchNetworkStatus = async () => {
    try {
      const res = await fetch('/api/mining/status');
      if (res.ok) {
        const data = await res.json();
        setServerMiners(data.miners || []);
        setServerHistory(data.history || []);
        setServerWithdrawals(data.withdrawals || []);
      }
    } catch (err) {
      console.warn("Unable to fetch mining status (retrying...):", err);
    }
  };

  useEffect(() => {
    fetchNetworkStatus();
    const interval = setInterval(fetchNetworkStatus, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const active = localStorage.getItem('solax_active_user');
    if (active) {
      setCurrentUser(active);
      const usersData = localStorage.getItem('solax_users');
      const usersList = usersData ? JSON.parse(usersData) : {};
      const profile = usersList[active] || {};
      setSavedSlx(profile.savedSlx || 0);
      setStakedSlx(profile.stakedSlx || 0);
      setTotalBurnedSlx(profile.totalBurnedSlx || 0);
      setHardwareTier(profile.hardwareTier || 'vps');
      setCoolingTier(profile.coolingTier || 'passive');
    }
  }, []);

  // Heartbeat endpoint periodic sync
  useEffect(() => {
    if (!currentUser) return;
    
    const sendHeartbeat = async () => {
      try {
        await fetch('/api/mining/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: currentUser,
            hashRate: isMining ? getCalculatedHashrate() : 0,
            balance: savedSlx
          })
        });
      } catch (err) {
        console.warn("Heartbeat update omitted/deferred:", err);
      }
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 8000);
    return () => clearInterval(interval);
  }, [currentUser, isMining, savedSlx, isOptimized, hardwareTier, coolingTier, stakedSlx]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError('');
    const user = usernameInput.trim();
    const pass = passwordInput.trim();

    if (!user || !pass) {
      setAccountError(t('Wpisz login i hasło!', 'Enter username and password!'));
      return;
    }

    const usersData = localStorage.getItem('solax_users');
    const usersList = usersData ? JSON.parse(usersData) : {};

    if (isRegistering) {
      if (usersList[user]) {
        setAccountError(t('Błąd: Ten login jest zajęty!', 'Error: This username is taken!'));
        return;
      }
      usersList[user] = {
        password: pass,
        savedSlx: 0,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('solax_users', JSON.stringify(usersList));
      localStorage.setItem('solax_active_user', user);
      setCurrentUser(user);
      setSavedSlx(0);
      setUsernameInput('');
      setPasswordInput('');
      addLog(t(`REJESTRACJA OK: Węzeł dla '${user}' aktywny`, `REGISTRATION OK: Node for '${user}' active`));
      
      try {
        await fetch('/api/mining/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: user, hashRate: 0, balance: 0 })
        });
        fetchNetworkStatus();
      } catch (e) {}
    } else {
      const existing = usersList[user];
      if (!existing || existing.password !== pass) {
        setAccountError(t('Błąd: Niepoprawne hasło lub login!', 'Error: Invalid password or username!'));
        return;
      }
      localStorage.setItem('solax_active_user', user);
      setCurrentUser(user);
      setSavedSlx(existing.savedSlx || 0);
      setStakedSlx(existing.stakedSlx || 0);
      setTotalBurnedSlx(existing.totalBurnedSlx || 0);
      setHardwareTier(existing.hardwareTier || 'vps');
      setCoolingTier(existing.coolingTier || 'passive');
      setUsernameInput('');
      setPasswordInput('');
      addLog(t(`AUTORYZACJA OK: Węzeł '${user}' połączony`, `AUTHORIZATION OK: Node '${user}' connected`));

      try {
        await fetch('/api/mining/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: user, hashRate: 0, balance: existing.savedSlx || 0 })
        });
        fetchNetworkStatus();
      } catch (e) {}
    }
  };

  const handleLogout = () => {
    if (currentUser) {
      addLog(t(`ROZŁĄCZONO: Sesja '${currentUser}' zamknięta`, `DISCONNECTED: Session '${currentUser}' closed`));
    }
    localStorage.removeItem('solax_active_user');
    setCurrentUser(null);
    setSavedSlx(0);
    setStakedSlx(0);
    setTotalBurnedSlx(0);
    setHardwareTier('vps');
    setCoolingTier('passive');
    setStakingRewards(0);
  };

  const handleSaveMinedRewards = async () => {
    if (!currentUser) {
      setAccountError(t('Zaloguj się lub zarejestruj, aby zapisać plon!', 'Log in or register to save yield!'));
      return;
    }
    if (minedRewards <= 0) {
      addLog(t('BŁĄD: Brak nowego plonu do synchronizacji!', 'ERROR: No new yield to synchronize!'));
      return;
    }

    const addedAmount = minedRewards;
    const newTotal = Number((savedSlx + addedAmount).toFixed(6));

    try {
      const res = await fetch('/api/mining/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser,
          amount: addedAmount
        })
      });
      if (!res.ok) {
        throw new Error("Server save error");
      }
      
      const usersData = localStorage.getItem('solax_users');
      const usersList = usersData ? JSON.parse(usersData) : {};
      if (usersList[currentUser]) {
        usersList[currentUser].savedSlx = newTotal;
        localStorage.setItem('solax_users', JSON.stringify(usersList));
      }

      setSavedSlx(newTotal);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);

      setMinedRewards(0);
      addLog(t(`ZAPISANO PLON: +${addedAmount.toFixed(4)} $SLX na koncie`, `SAVED YIELD: +${addedAmount.toFixed(4)} $SLX in account`));
      fetchNetworkStatus();
    } catch (err) {
      console.error(err);
      addLog(t('BŁĄD: Brak połączenia z główną bazą danych', 'ERROR: No connection to the main database'));
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError('');
    setWithdrawSuccess(false);

    if (!currentUser) {
      setWithdrawError(t('Zaloguj się najpierw!', 'Log in first!'));
      return;
    }

    const amt = parseFloat(withdrawAmountInput);
    if (isNaN(amt) || amt <= 0) {
      setWithdrawError(t('Wpisz poprawną ilość $SLX!', 'Enter a valid amount of $SLX!'));
      return;
    }

    if (amt > savedSlx) {
      setWithdrawError(t('Za mało środków na koncie kopacza!', 'Insufficient funds in miner account!'));
      return;
    }

    const wallet = withdrawWalletInput.trim();
    if (!wallet) {
      setWithdrawError(t('Wpisz adres portfela Solana!', 'Enter a Solana wallet address!'));
      return;
    }

    try {
      const res = await fetch('/api/mining/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser,
          amount: amt,
          wallet: wallet
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || t('Błąd serwera przy wypłacie', 'Server error during withdrawal'));
      }

      const data = await res.json();
      
      // Update local storage
      const usersData = localStorage.getItem('solax_users');
      const usersList = usersData ? JSON.parse(usersData) : {};
      if (usersList[currentUser]) {
        usersList[currentUser].savedSlx = data.newBalance;
        localStorage.setItem('solax_users', JSON.stringify(usersList));
      }

      setSavedSlx(data.newBalance);
      setWithdrawSuccess(true);
      setWithdrawAmountInput('');
      addLog(t(`WYPŁATA OK: -${amt.toFixed(4)} $SLX wysłane na ${wallet.substring(0, 6)}...`, `WITHDRAWAL OK: -${amt.toFixed(4)} $SLX sent to ${wallet.substring(0, 6)}...`));
      setTimeout(() => {
        setWithdrawSuccess(false);
        setIsWithdrawing(false);
      }, 3000);

      fetchNetworkStatus();
    } catch (err: any) {
      setWithdrawError(err.message || t('Błąd połączenia', 'Connection error'));
    }
  };

  // Staking state
  const [stakeAmount, setStakeAmount] = useState<number>(1000);
  const [lockPeriod, setLockPeriod] = useState<number>(365); // days
  const [simulatedApy, setSimulatedApy] = useState<number>(142.4);

  // Deflation state
  const [burnRate, setBurnRate] = useState<number>(2.5); // % transaction burn
  const [tokensBurned, setTokensBurned] = useState<number>(42189032);
  const [volumeInput, setVolumeInput] = useState<number>(10000000); // 10M default volume

  // Staking APY update based on lock period
  useEffect(() => {
    let apyVal = 142.4;
    if (lockPeriod === 30) apyVal = 18.5;
    else if (lockPeriod === 90) apyVal = 45.2;
    else if (lockPeriod === 180) apyVal = 88.9;
    
    setSimulatedApy(apyVal);
    if (currentUser) {
      setStakedApy(apyVal);
    }
  }, [lockPeriod, currentUser]);

  // Real-time counter for auto-burned tokens
  useEffect(() => {
    const burnTimer = setInterval(() => {
      setTokensBurned((prev) => prev + Number((Math.random() * 2.8 + 0.4).toFixed(4)));
    }, 1800);
    return () => clearInterval(burnTimer);
  }, []);

  // Live Staking Rewards ticking loop (updates every second)
  useEffect(() => {
    if (!currentUser || stakedSlx <= 0) {
      setStakingRewards(0);
      return;
    }

    const stakingTimer = setInterval(() => {
      // Annual Yield split into seconds: APY % / (365 days * 24 hours * 3600 seconds)
      const rewardPerSec = (stakedSlx * (stakedApy / 100)) / (365 * 24 * 3600);
      setStakingRewards((prev) => Number((prev + rewardPerSec).toFixed(8)));
    }, 1000);

    return () => clearInterval(stakingTimer);
  }, [currentUser, stakedSlx, stakedApy]);

  // Keep hash rate in sync with calculated factors
  useEffect(() => {
    if (isMining) {
      setMiningSpeed(getCalculatedHashrate());
    } else {
      setMiningSpeed(0);
    }
  }, [isMining, hardwareTier, coolingTier, stakedSlx, isOptimized]);

  // Mining cycle simulation with influences from upgrades and multipliers
  useEffect(() => {
    if (!isMining) {
      return;
    }

    const mineInterval = setInterval(() => {
      setMinedRewards((prev) => {
        const baseRewardRate = getCalculatedRewardRate();
        const randomFactor = 1 + (Math.random() - 0.4) * 0.1; // small variance
        const actualGain = baseRewardRate * randomFactor;
        return Number((prev + actualGain).toFixed(6));
      });

      // Sim multiplier level changes
      setMinedMultiplier((prev) => {
        if (Math.random() < 0.15) {
          const randMult = Math.random() * (isOptimized ? 8.0 : 5.0) + 1.2;
          return Number(randMult.toFixed(2));
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(mineInterval);
  }, [isMining, isOptimized, hardwareTier, coolingTier, stakedSlx, totalBurnedSlx]);

  // Staking Interactive Handlers
  const handleStake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      addLog(t('BŁĄD: Zaloguj się, aby stakować!', 'ERROR: Log in to stake!'));
      return;
    }

    const amt = parseFloat(stakeInputVal);
    if (isNaN(amt) || amt <= 0) {
      addLog(t('BŁĄD: Wpisz poprawną ilość $SLX do stakowania!', 'ERROR: Enter a valid amount of $SLX to stake!'));
      return;
    }

    if (amt > savedSlx) {
      addLog(t('BŁĄD: Za mało $SLX na koncie wydobywcy!', 'ERROR: Insufficient $SLX in miner account!'));
      return;
    }

    const newSaved = Number((savedSlx - amt).toFixed(6));
    const newStaked = Number((stakedSlx + amt).toFixed(6));

    setSavedSlx(newSaved);
    setStakedSlx(newStaked);
    setStakeInputVal('');

    // Save profile to local storage
    const usersData = localStorage.getItem('solax_users');
    const usersList = usersData ? JSON.parse(usersData) : {};
    if (usersList[currentUser]) {
      usersList[currentUser].savedSlx = newSaved;
      usersList[currentUser].stakedSlx = newStaked;
      localStorage.setItem('solax_users', JSON.stringify(usersList));
    }

    addLog(t(`STAKOWANIE: Ulokowano ${amt.toFixed(4)} $SLX w Sejfie (Otrzymujesz +${(amt * 1.5).toFixed(1)} GH/s do hashrate!)`, `STAKING: Deposited ${amt.toFixed(4)} $SLX in Vault (You receive +${(amt * 1.5).toFixed(1)} GH/s hashrate!)`));
    triggerServerSync(currentUser, newSaved);
  };

  const handleClaimStakingRewards = () => {
    if (!currentUser || stakingRewards <= 0) return;

    const claimed = stakingRewards;
    const newSaved = Number((savedSlx + claimed).toFixed(6));

    setSavedSlx(newSaved);
    setStakingRewards(0);

    // Save profile to local storage
    const usersData = localStorage.getItem('solax_users');
    const usersList = usersData ? JSON.parse(usersData) : {};
    if (usersList[currentUser]) {
      usersList[currentUser].savedSlx = newSaved;
      localStorage.setItem('solax_users', JSON.stringify(usersList));
    }

    addLog(t(`ODEBRANO NAGRODY: +${claimed.toFixed(6)} $SLX z odsetek stakowania`, `CLAIMED REWARDS: +${claimed.toFixed(6)} $SLX from staking interest`));
    triggerServerSync(currentUser, newSaved);
  };

  const handleUnstake = () => {
    if (!currentUser || stakedSlx <= 0) return;

    const unstakedAmount = stakedSlx;
    const rewards = stakingRewards;
    const totalReturned = Number((unstakedAmount + rewards).toFixed(6));
    const newSaved = Number((savedSlx + totalReturned).toFixed(6));

    setSavedSlx(newSaved);
    setStakedSlx(0);
    setStakingRewards(0);

    // Save profile to local storage
    const usersData = localStorage.getItem('solax_users');
    const usersList = usersData ? JSON.parse(usersData) : {};
    if (usersList[currentUser]) {
      usersList[currentUser].savedSlx = newSaved;
      usersList[currentUser].stakedSlx = 0;
      localStorage.setItem('solax_users', JSON.stringify(usersList));
    }

    addLog(t(`COFNIĘTO STAKOWANIE: Odzyskano ${unstakedAmount.toFixed(4)} $SLX (+${rewards.toFixed(6)} $SLX odsetek)`, `UNSTAKED: Returned ${unstakedAmount.toFixed(4)} $SLX (+${rewards.toFixed(6)} $SLX interest)`));
    triggerServerSync(currentUser, newSaved);
  };

  // Interactive Burning Handler
  const handleManualBurn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      addLog(t('BŁĄD: Zaloguj się, aby spalić tokeny!', 'ERROR: Log in to burn tokens!'));
      return;
    }

    const amt = parseFloat(burnInputVal);
    if (isNaN(amt) || amt <= 0) {
      addLog(t('BŁĄD: Wpisz poprawną ilość $SLX do spalenia!', 'ERROR: Enter a valid amount of $SLX to burn!'));
      return;
    }

    if (amt > savedSlx) {
      addLog(t('BŁĄD: Za mało $SLX na koncie wydobywcy!', 'ERROR: Insufficient $SLX in miner account!'));
      return;
    }

    const newSaved = Number((savedSlx - amt).toFixed(6));
    const newBurned = Number((totalBurnedSlx + amt).toFixed(6));

    setSavedSlx(newSaved);
    setTotalBurnedSlx(newBurned);
    setBurnInputVal('');

    // Add to auto-burn total
    setTokensBurned((prev) => prev + amt);

    // Save profile to local storage
    const usersData = localStorage.getItem('solax_users');
    const usersList = usersData ? JSON.parse(usersData) : {};
    if (usersList[currentUser]) {
      usersList[currentUser].savedSlx = newSaved;
      usersList[currentUser].totalBurnedSlx = newBurned;
      localStorage.setItem('solax_users', JSON.stringify(usersList));
    }

    addLog(t(`🔥 SPALENIE: Trwale usunięto ${amt.toFixed(4)} $SLX z obiegu! Otrzymujesz permanentny mnożnik plonów +${(amt * 1.0).toFixed(0)}%!`, `🔥 BURNED: Permanently removed ${amt.toFixed(4)} $SLX from circulation! You receive a permanent +${(amt * 1.0).toFixed(0)}% yield multiplier boost!`));
    triggerServerSync(currentUser, newSaved);
  };

  // Calculate yield for Staking
  const estYield = (stakeAmount * (simulatedApy / 100) * (lockPeriod / 365)).toFixed(2);
  // Calculate multiplier impact (x1000 projection)
  const x1000EstValue = (Number(estYield) * 1000).toLocaleString('en-US', { maximumFractionDigits: 0 });

  // Calculate Deflation Burn Impact
  const dailyBurn = (volumeInput * (burnRate / 100));
  const yearlyBurn = dailyBurn * 365;
  const supplyBurnPercent = ((yearlyBurn / 1000000000) * 100).toFixed(2);

  return (
    <div className="border border-g/15 bg-b2/90 p-5 md:p-8 rounded-none relative overflow-hidden backdrop-blur-md">
      {/* Top dual color pulse border strip */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-r via-g to-cyan" />

      {/* Trust Tag: x1000 Gem Blueprint */}
      <div className="absolute top-4 right-4 hidden md:flex items-center gap-1.5 border border-g/25 bg-g/5 px-2.5 py-1 text-[8px] tracking-[2px] text-g font-bold uppercase font-mono">
        <Sparkles className="w-3 h-3 text-g animate-pulse" />
        {t('$SLX PROJEKT X1000 POTENCJAŁU', '$SLX x1000 POTENTIAL BLUEPRINT')}
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 text-[10px] tracking-[4px] uppercase text-g/60 font-bold mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-g animate-ping" /> {t('INNOWACYJNE WYDOBYWANIE & KUŹNIA', 'INNOVATIVE MINING & FORGE')}
        </div>
        <h3 className="font-display text-2xl md:text-3xl tracking-[1px] text-white uppercase">
          {t('WYDOBYWANIE I KUŹNIA TOKENÓW - ', 'TOKEN MINE & FORGE - ')}<span className="text-g text-shadow-[0_0_8px_rgba(0,255,136,0.35)]">SOLAXY MINING</span>
        </h3>
        <p className="text-xs text-[#c8e6d2]/50 mt-1 max-w-[640px]">
          {t(
            'Połączenie najprostszego na świecie tworzenia tokenów z innowacyjnym systemem wirtualnego wydobywania płynności (Liquidity Mining), stabilnego stakowania (Staking Vault) oraz kuźni deflacyjnej (Deflationary Forge).',
            'Combining the simplest token creation in the world with an innovative virtual liquidity mining system (Liquidity Mining), stable staking (Staking Vault) and deflationary forge (Deflationary Forge).'
          )}
        </p>
      </div>

      {/* Tabs Row */}
      <div className="grid grid-cols-3 gap-1 md:gap-3 mb-6 border-b border-white/5 pb-4">
        {/* Tab 1: Staking */}
        <button
          onClick={() => setActiveTab('staking')}
          className={`py-3 px-2 border text-center flex flex-col md:flex-row items-center justify-center gap-2 transition-all duration-300 interactive-cursor font-mono ${
            activeTab === 'staking'
              ? 'border-g text-g bg-g/5 text-shadow-[0_0_6px_rgba(0,255,136,0.3)]'
              : 'border-white/5 text-white/40 hover:text-white/80 hover:border-white/20'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span className="text-[10px] md:text-xs font-bold tracking-[2px] uppercase">{t('SEJF STAKOWANIA', 'STAKING VAULT')}</span>
        </button>

        {/* Tab 2: Mining */}
        <button
          onClick={() => setActiveTab('mining')}
          className={`py-3 px-2 border text-center flex flex-col md:flex-row items-center justify-center gap-2 transition-all duration-300 interactive-cursor font-mono ${
            activeTab === 'mining'
              ? 'border-cyan text-cyan bg-cyan/5 text-shadow-[0_0_6px_rgba(0,238,255,0.3)]'
              : 'border-white/5 text-white/40 hover:text-white/80 hover:border-white/20'
          }`}
        >
          <Hammer className="w-4 h-4" />
          <span className="text-[10px] md:text-xs font-bold tracking-[2px] uppercase">{t('WYDOBYWANIE PŁYNNOŚCI', 'LIQUIDITY MINING')}</span>
        </button>

        {/* Tab 3: Deflation */}
        <button
          onClick={() => setActiveTab('deflation')}
          className={`py-3 px-2 border text-center flex flex-col md:flex-row items-center justify-center gap-2 transition-all duration-300 interactive-cursor font-mono ${
            activeTab === 'deflation'
              ? 'border-r text-r bg-r/5 text-shadow-[0_0_6px_rgba(255,26,74,0.3)]'
              : 'border-white/5 text-white/40 hover:text-white/80 hover:border-white/20'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span className="text-[10px] md:text-xs font-bold tracking-[2px] uppercase">{t('KUŹNIA DEFLACYJNA', 'DEFLATIONARY FORGE')}</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'staking' && (
        <div className="animate-fadeIn font-mono">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            
            {/* Left Inputs block */}
            <div className="flex flex-col gap-4">
              {currentUser ? (
                <div className="bg-white/5 border border-white/10 p-3.5 rounded flex flex-col gap-2">
                  <div className="text-[10px] text-white/40 uppercase tracking-[1px] font-bold border-b border-white/5 pb-1">{t('ZASOBY PORTFELA WYDOBYWCY', 'MINER WALLET FUNDS')}</div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/60">{t('Zapisane wydobyte $SLX:', 'Saved mined $SLX:')}</span>
                    <span className="text-g font-bold text-sm">{savedSlx.toFixed(4)} $SLX</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/60">{t('Aktualnie stakowane w Sejfie:', 'Currently staked in Vault:')}</span>
                    <span className="text-cyan font-bold text-sm">{stakedSlx.toFixed(4)} $SLX</span>
                  </div>
                  {stakedSlx > 0 && (
                    <div className="flex justify-between items-center border-t border-white/5 pt-1.5 mt-1 text-xs">
                      <span className="text-g animate-pulse font-bold">{t('Oczekujące odsetki:', 'Accrued interest:')}</span>
                      <span className="text-g font-bold">{stakingRewards.toFixed(6)} $SLX</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-3.5 rounded text-xs leading-relaxed text-white/70">
                  <div className="text-[9px] text-yellow-500 font-bold uppercase tracking-[1px] mb-1">{t('TRYB DEMONSTRACYJNY', 'DEMONSTRATION MODE')}</div>
                  {t('Zaloguj się na węzeł po prawej w zakładce „Wydobywanie”, aby stakować własne zarobione tokeny i zyskać bonus do hashrate!', 'Log in as a miner in the "Mining" tab to stake your earned tokens and gain a real-time hashrate bonus!')}
                </div>
              )}

              <div>
                <label className="text-[10px] text-white/40 uppercase block mb-1.5">{t('Ilość do Stakowania ($SLX)', 'Stake Amount ($SLX)')}</label>
                <div className="flex items-center bg-black/60 border border-white/10 px-4 py-2.5">
                  <input
                    type="number"
                    value={currentUser ? stakeInputVal : stakeAmount}
                    onChange={(e) => {
                      if (currentUser) {
                        setStakeInputVal(e.target.value);
                      } else {
                        setStakeAmount(Math.max(1, Number(e.target.value)));
                      }
                    }}
                    placeholder={currentUser ? t('Wpisz ilość $SLX', 'Enter amount') : "1000"}
                    className="w-full bg-transparent text-white font-bold text-sm focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  {currentUser && (
                    <button
                      type="button"
                      onClick={() => setStakeInputVal(savedSlx.toFixed(4))}
                      className="text-[9px] text-cyan hover:text-white font-bold mr-2 uppercase"
                    >
                      MAX
                    </button>
                  )}
                  <span className="text-g font-bold text-xs">$SLX</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-white/40 uppercase block mb-2">{t('Okres Blokady Stakowania', 'Staking Lock-up Period')}</label>
                <div className="grid grid-cols-4 gap-2">
                  {[30, 90, 180, 365].map((period) => (
                    <button
                      key={period}
                      onClick={() => setLockPeriod(period)}
                      className={`py-2 text-[10px] font-bold border transition-colors interactive-cursor ${
                        lockPeriod === period
                          ? 'border-g text-g bg-g/5'
                          : 'border-white/10 text-white/50 hover:border-white/20'
                      }`}
                    >
                      {period} {t('DNI', 'DAYS')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Outputs block */}
            <div className="border border-g/10 bg-black/50 p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-2 right-2 flex items-center gap-1 text-[8px] text-g/60 font-bold tracking-[1px]">
                <ShieldCheck className="w-3 h-3 text-g" />
                {t('ZABEZPIECZONE', 'INSURED')}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] text-white/40 uppercase">{t('Zasymulowane APY', 'Simulated APY')}</div>
                  <div className="text-2xl md:text-3xl text-g font-bold mt-1 text-shadow-[0_0_8px_#00ff88]">
                    {simulatedApy}%
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-white/40 uppercase">{t('Szacowany Zysk', 'Est. Reward Yield')}</div>
                  <div className="text-2xl md:text-3xl text-white font-bold mt-1">
                    +{currentUser ? (stakedSlx * (simulatedApy / 100) * (lockPeriod / 365)).toFixed(4) : estYield} <span className="text-xs text-g">$SLX</span>
                  </div>
                </div>
              </div>

              {/* x1000 Multiplier Projection HUD */}
              <div className="border-t border-white/5 pt-4 mt-4 bg-g/5 -mx-4 -mb-4 p-4">
                <div className="flex items-center gap-2 text-[10px] text-g font-bold tracking-[2px] uppercase">
                  <TrendingUp className="w-4 h-4 text-g" />
                  {t('PROJEKCJA WARTOŚCI (Mnożnik x1000)', 'PROJECTION OF VALUE (x1000 Multiplier)')}
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xs text-white/50">{t('Wartość przy wzroście x1000:', 'Value with x1000 growth:')}</span>
                  <span className="text-base md:text-lg text-g font-bold text-shadow-[0_0_6px_#00ff88]">
                    ${currentUser ? (Number((stakedSlx * (simulatedApy / 100) * (lockPeriod / 365)).toFixed(2)) * 1000).toLocaleString('en-US', { maximumFractionDigits: 0 }) : x1000EstValue} USD
                  </span>
                </div>
              </div>
            </div>

          </div>

          {currentUser ? (
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleStake}
                className="w-full py-4 border border-g text-g font-bold tracking-[4px] uppercase text-xs hover:bg-g/15 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all duration-300 interactive-cursor"
              >
                {t('DEPOZYT W SEJFIE STAKOWANIA', 'DEPOSIT TO STAKING VAULT')}
              </button>

              {stakedSlx > 0 && (
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleClaimStakingRewards}
                    disabled={stakingRewards <= 0}
                    className={`w-1/2 py-2.5 border text-xs font-bold uppercase tracking-[2px] transition-all duration-300 ${
                      stakingRewards > 0
                        ? 'border-g text-g bg-g/5 hover:bg-g/10 cursor-pointer'
                        : 'border-white/10 text-white/30 cursor-not-allowed bg-black/20'
                    }`}
                  >
                    {t('ODBIERZ NAGRODY', 'CLAIM REWARDS')}
                  </button>
                  <button
                    type="button"
                    onClick={handleUnstake}
                    className="w-1/2 py-2.5 border border-cyan text-cyan bg-cyan/5 hover:bg-cyan/10 text-xs font-bold uppercase tracking-[2px] cursor-pointer"
                  >
                    {t('COFNIJ STAKOWANIE (UNSTAKE ALL)', 'UNSTAKE ALL')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              className="w-full py-4 border border-g text-g font-bold tracking-[4px] uppercase text-xs hover:bg-g/15 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all duration-300 interactive-cursor"
              onClick={() => alert(t('W AI Studio Preview zasymulowano stakowanie. Zarejestruj się / zaloguj na konto węzła po prawej, aby stakować własny wydobyty plon!', 'Staking simulated in AI Studio Preview. Register/login as a node on the right to stake your own mined balance!'))}
            >
              {t('DEPOZYT W SEJFIE STAKOWANIA (TRYB DEMO)', 'DEPOSIT TO STAKING VAULT (DEMO)')}
            </button>
          )}
        </div>
      )}

      {activeTab === 'mining' && (
        <div className="animate-fadeIn font-mono">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
             {/* Mining Status panel */}
             <div className="border border-white/10 bg-black/50 p-4 flex flex-col justify-between relative overflow-hidden">
               <div>
                 <div className="flex items-center justify-between mb-4">
                   <div className="text-[10px] text-white/40 uppercase">{t('Status Wydobycia Zasobów', 'Asset Excavation Status')}</div>
                   <span className={`text-[10px] border px-2 py-0.5 font-bold tracking-[1.5px] uppercase ${
                     isMining ? 'border-cyan text-cyan bg-cyan/5' : 'border-white/20 text-white/40'
                   }`}>
                     {isMining ? t('WYDOBYWANIE AKTYWNE', 'ACTIVE MINING') : t('OFFLINE', 'OFFLINE')}
                   </span>
                 </div>
 
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <div className="text-[10px] text-white/40 uppercase">{t('Prędkość Hash-Rate', 'Hash-Rate Speed')}</div>
                     <div className="text-2xl md:text-3xl text-cyan font-bold mt-1">
                       {miningSpeed} <span className="text-xs">GH/s</span>
                     </div>
                   </div>
                   <div>
                     <div className="text-[10px] text-white/40 uppercase">{t('Dowody Kryptograficzne', 'Cryptographic Proofs')}</div>
                     <div className="text-2xl md:text-3xl text-white font-bold mt-1">
                       {isMining ? '100% VALID' : 'N/A'}
                     </div>
                   </div>
                 </div>

                 {/* Node Optimization HUD */}
                 <div className="mt-4 pt-4 border-t border-white/5">
                   <div className="text-[9px] text-white/40 uppercase mb-2 flex items-center justify-between">
                     <span>{t('OPTYMALIZACJA WĘZŁA', 'NODE OPTIMIZATION')}</span>
                     {isOptimized && (
                       <span className="text-[8px] bg-g/20 border border-g/30 text-g px-1 py-0.2 uppercase font-bold animate-pulse">
                         MAX PERF
                       </span>
                     )}
                   </div>

                   {isOptimizing ? (
                     <div className="space-y-1.5 py-1">
                       <div className="text-[10px] text-cyan animate-pulse flex items-center gap-1.5">
                         <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan animate-ping" />
                         {optStatus}
                       </div>
                       <div className="w-full bg-white/5 h-1 rounded overflow-hidden">
                         <div className="bg-cyan h-full animate-pulse" style={{ width: '100%' }} />
                       </div>
                     </div>
                   ) : isOptimized ? (
                     <div className="flex flex-col gap-1.5 bg-g/5 p-2 border border-g/10">
                       <div className="text-[10px] text-g font-semibold flex items-center gap-1">
                         <Zap className="w-3.5 h-3.5 text-g" />
                         {t('Węzeł zoptymalizowany pod kątem Jito MEV & RPC', 'Node optimized for Jito MEV & RPC')}
                       </div>
                       <button
                         type="button"
                         onClick={resetOptimization}
                         className="text-left text-[9px] text-white/40 hover:text-white/80 underline uppercase font-bold cursor-pointer"
                       >
                         {t('Resetuj do standardowej konfiguracji', 'Reset to standard configuration')}
                       </button>
                     </div>
                   ) : (
                     <button
                       type="button"
                       onClick={triggerOptimization}
                       className="w-full py-1.5 bg-g/10 border border-g/30 hover:border-g text-g text-[10px] font-bold uppercase tracking-[1px] hover:bg-g/15 transition-all duration-300 cursor-pointer"
                     >
                       🚀 {t('OPTYMALIZUJ WYDAJNOŚĆ WĘZŁA', 'OPTIMIZE NODE PERFORMANCE')}
                     </button>
                   )}
                 </div>
               </div>
 
               {/* Glowing active node radar representation */}
               {isMining && (
                 <div className="h-2 bg-cyan/15 rounded overflow-hidden mt-4 relative">
                   <div className="h-full bg-cyan w-1/3 animate-ping absolute left-1/3" style={{ animationDuration: '2.5s' }} />
                   <div className="h-full bg-cyan/40 w-full animate-pulse" />
                 </div>
               )}
             </div>

            {/* Generated Mining Yield */}
            <div className="border border-cyan/15 bg-cyan/5 p-4 flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="text-[10px] text-cyan/70 uppercase font-bold tracking-[1px] mb-2">
                  {t('WYDOBYTE REZULTATY ($SLX REWARDS)', 'MINED RESULTS ($SLX REWARDS)')}
                </div>
                <div className="font-display text-3xl sm:text-4xl text-cyan text-shadow-[0_0_12px_rgba(0,238,255,0.4)]">
                  {minedRewards} <span className="text-sm font-mono font-bold">$SLX</span>
                </div>
                
                {currentUser ? (
                  <div className="mt-4 bg-black/40 border border-g/25 p-2 rounded">
                    <div className="text-[9px] text-g/70 uppercase tracking-[1px] font-bold">{t('USTAWIENIA PORTFELA', 'WALLET SETTINGS')}</div>
                    <div className="text-xs text-white/80 mt-1 flex justify-between items-center">
                      <span>{t('Wydobyte $SLX:', 'Mined $SLX:')}</span>
                      <span className="text-g font-bold text-shadow-[0_0_6px_#00ff88]">{savedSlx.toFixed(4)} $SLX</span>
                    </div>

                    {!isWithdrawing ? (
                      <button
                        onClick={() => {
                          setIsWithdrawing(true);
                          setWithdrawAmountInput(savedSlx.toFixed(4));
                        }}
                        className="w-full mt-2 py-1 bg-cyan/10 border border-cyan/30 hover:border-cyan text-cyan text-[10px] font-bold uppercase tracking-[1px] hover:bg-cyan/20 transition-all duration-300"
                      >
                        {t('Wypłać do portfela', 'Withdraw to wallet')}
                      </button>
                    ) : (
                      <form onSubmit={handleWithdraw} className="mt-2 pt-2 border-t border-white/5 flex flex-col gap-1.5">
                        <div className="text-[8px] text-white/40 uppercase">{t('Adres Portfela Solana', 'Solana Wallet Address')}</div>
                        <input
                          type="text"
                          placeholder="np. SolAnG...a37F"
                          value={withdrawWalletInput}
                          onChange={(e) => setWithdrawWalletInput(e.target.value)}
                          className="w-full bg-black/70 border border-white/10 px-1.5 py-1 text-[10px] text-white focus:outline-none"
                        />

                        <div className="text-[8px] text-white/40 uppercase">{t('Ilość do wypłaty ($SLX)', 'Amount to withdraw ($SLX)')}</div>
                        <div className="flex bg-black/70 border border-white/10 px-1.5 py-1 items-center justify-between">
                          <input
                            type="number"
                            step="any"
                            placeholder={t('Ilość', 'Amount')}
                            value={withdrawAmountInput}
                            onChange={(e) => setWithdrawAmountInput(e.target.value)}
                            className="bg-transparent text-[10px] text-white focus:outline-none w-full"
                          />
                          <button
                            type="button"
                            onClick={() => setWithdrawAmountInput(savedSlx.toFixed(4))}
                            className="text-[8px] text-cyan hover:text-white font-bold"
                          >
                            MAX
                          </button>
                        </div>

                        {withdrawError && (
                          <div className="text-[8px] text-red-500 font-bold mt-1">
                            {withdrawError}
                          </div>
                        )}

                        {withdrawSuccess && (
                          <div className="text-[8px] text-g font-bold mt-1">
                            {t('Wypłata zlecona pomyślnie!', 'Withdrawal requested successfully!')}
                          </div>
                        )}

                        <div className="flex gap-1.5 mt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setIsWithdrawing(false);
                              setWithdrawError('');
                            }}
                            className="w-1/2 py-1 border border-white/10 hover:border-white/20 text-[8px] text-white/60 uppercase"
                          >
                            {t('Anuluj', 'Cancel')}
                          </button>
                          <button
                            type="submit"
                            className="w-1/2 py-1 bg-g/15 border border-g text-[8px] text-g font-bold uppercase hover:bg-g/25"
                          >
                            {t('Wyślij', 'Send')}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ) : (
                  <div className="mt-4 bg-r/10 border border-r/25 p-2 rounded animate-pulse">
                    <div className="text-[9px] text-r uppercase tracking-[1px] font-bold">{t('SESJA OFFLINE', 'OFFLINE SESSION')}</div>
                    <div className="text-[10px] text-white/60 mt-1 leading-snug">
                      {t('Zarejestruj węzeł konta po prawej, aby zapisać wydobyty plon.', 'Register an account node on the right to save the mined yield.')}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-cyan/10 pt-4 mt-4 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/40">{t('Mnożnik strefowy:', 'Zone multiplier:')}</span>
                  <span className="text-cyan font-bold tracking-[1px]">
                    x{minedMultiplier} EXTRA REWARDS
                  </span>
                </div>

                <button
                  onClick={handleSaveMinedRewards}
                  disabled={!currentUser || minedRewards <= 0}
                  className={`w-full py-2 px-3 border text-xs font-bold uppercase tracking-[1.5px] flex items-center justify-center gap-1.5 transition-all duration-300 ${
                    currentUser && minedRewards > 0
                      ? 'border-g text-g bg-g/5 hover:bg-g/20 hover:shadow-[0_0_12px_rgba(0,255,136,0.3)] cursor-pointer'
                      : 'border-white/10 text-white/30 cursor-not-allowed bg-black/20'
                  }`}
                >
                  <Save className={`w-3.5 h-3.5 ${saveSuccess ? 'animate-bounce' : ''}`} />
                  {saveSuccess ? t('ZAPISANO PLON!', 'YIELD SAVED!') : t('ZAPISZ PLON NA KONCIE', 'SAVE YIELD IN ACCOUNT')}
                </button>
              </div>
            </div>

            {/* Column 3: Registration & Account Node Panel */}
            <div className="border border-white/10 bg-black/60 p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-2 right-2 flex items-center gap-1 text-[8px] text-cyan/60 font-bold tracking-[1px]">
                <User className="w-3 h-3 text-cyan" />
                IDENTITY MATRIX
              </div>

              {currentUser ? (
                // Logged In Status Panel
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div className="text-[10px] text-white/40 uppercase tracking-[1px] mb-3">{t('CYBER-IDENTYFIKATOR', 'CYBER-IDENTIFIER')}</div>
                    
                    <div className="border border-cyan/20 bg-cyan/5 p-3 rounded mb-4">
                      <div className="text-[11px] text-cyan uppercase font-bold tracking-[1px]">{t('WĘZEŁ ZALOGOWANY', 'NODE CONNECTED')}</div>
                      <div className="text-sm font-bold text-white mt-1.5 truncate">
                        {currentUser}
                      </div>
                      <div className="text-[9px] text-white/40 mt-1 uppercase font-mono tracking-[0.5px]">
                        ID_NODE: {currentUser.substring(0, 3).toUpperCase()}_NODE
                      </div>
                    </div>

                    <div className="bg-black/40 border border-white/5 p-2.5 rounded mb-4">
                      <div className="text-[9px] text-white/30 uppercase tracking-[1px] font-bold">{t('LOGI SYNCHRONIZACJI', 'SYNC LOGS')}</div>
                      <div className="text-[9px] font-mono mt-1 space-y-1 text-white/60">
                        {logMessages.length > 0 ? (
                          logMessages.map((log, idx) => (
                            <div key={idx} className="truncate text-cyan/80">{log}</div>
                          ))
                        ) : (
                          <div className="text-white/30 italic">{t('Oczekiwanie na komendy...', 'Awaiting commands...')}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full py-2 border border-r/30 text-r font-bold uppercase tracking-[1px] text-[10px] hover:bg-r/10 hover:border-r transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    {t('WYLOGUJ SESJĘ', 'LOG OUT SESSION')}
                  </button>
                </div>
              ) : (
                // Authentication UI Form
                <form onSubmit={handleAuth} className="flex flex-col justify-between h-full">
                  <div>
                    <div className="text-[10px] text-white/40 uppercase tracking-[1px] mb-3">
                      {isRegistering ? t('REJESTRACJA WĘZŁA', 'NODE REGISTRATION') : t('LOGOWANIE DO SKARBCA', 'VAULT LOGIN')}
                    </div>

                    <div className="space-y-2.5 mb-3">
                      <div>
                        <label className="text-[8px] text-white/40 uppercase tracking-[1px] block mb-1">[{t('NAZWA UŻYTKOWNIKA', 'USERNAME')}]</label>
                        <div className="flex items-center bg-black/70 border border-white/10 px-2.5 py-1.5">
                          <input
                            type="text"
                            placeholder="np. cyber_player"
                            value={usernameInput}
                            onChange={(e) => setUsernameInput(e.target.value)}
                            className="w-full bg-transparent text-white font-bold text-xs focus:outline-none placeholder-white/20"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[8px] text-white/40 uppercase tracking-[1px] block mb-1">[{t('HASŁO DOSTĘPU', 'ACCESS PASSWORD')}]</label>
                        <div className="flex items-center bg-black/70 border border-white/10 px-2.5 py-1.5">
                          <input
                            type="password"
                            placeholder="••••••••"
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            className="w-full bg-transparent text-white font-bold text-xs focus:outline-none placeholder-white/20"
                          />
                        </div>
                      </div>
                    </div>

                    {accountError && (
                      <div className="text-[9px] text-r font-bold mb-2 flex items-center gap-1 border border-r/25 bg-r/5 p-1 rounded">
                        <ShieldAlert className="w-3 h-3 text-r shrink-0" />
                        <span>{accountError}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-cyan/10 border border-cyan text-cyan hover:bg-cyan/20 hover:shadow-[0_0_12px_rgba(0,238,255,0.3)] transition-all duration-300 font-bold uppercase tracking-[2px] text-[10px] mb-2 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isRegistering ? t('UTWÓRZ CYBER-KONTO', 'CREATE CYBER-ACCOUNT') : t('ZALOGUJ SIĘ', 'LOG IN')}
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setIsRegistering(!isRegistering);
                          setAccountError('');
                        }}
                        className="text-[9px] text-white/40 hover:text-white/80 transition-colors uppercase font-bold tracking-[1px] cursor-pointer"
                      >
                        {isRegistering ? t('Masz już konto? Zaloguj się', 'Already have an account? Log in') : t('Nowy węzeł? Zarejestruj konto', 'New node? Register account')}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>

          </div>

          {/* Hardware & Cooling Upgrades Hub */}
          <div className="border border-white/10 bg-black/50 p-5 my-6 rounded-none relative overflow-hidden font-mono">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan/5 rounded-full filter blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2 text-cyan font-bold uppercase tracking-[2px] mb-4 pb-2 border-b border-white/5">
              <Sparkles className="w-4 h-4 text-cyan" />
              {t('CENTRUM ROZBUDOWY WĘZŁA // HARDWARE UPGRADE HUB', 'NODE HARDWARE UPGRADE HUB')}
            </div>

            <p className="text-[11px] text-white/50 mb-4 leading-relaxed">
              {t(
                'Inwestuj swoje wydobyte i zapisane tokeny $SLX bezpośrednio w moc obliczeniową! Lepsze podzespoły podwyższają bazowy hashrate oraz mnożą zysk.',
                'Invest your mined and saved $SLX tokens directly into hashpower! Higher tiers increase base hashrate and multiply your earnings.'
              )}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category 1: Hardware Rigs */}
              <div className="space-y-3">
                <div className="text-[10px] text-white/40 uppercase tracking-[1.5px] font-bold border-b border-white/5 pb-1 flex justify-between items-center">
                  <span>{t('1. POZIOM WĘZŁA SPRZĘTOWEGO', '1. HARDWARE RIG TIER')}</span>
                  <span className="text-cyan font-bold uppercase">[{hardwareTier.toUpperCase()}]</span>
                </div>
                
                <div className="space-y-2">
                  {/* Tier 1: Basic */}
                  <div className={`p-2.5 border text-xs flex justify-between items-center ${hardwareTier === 'vps' ? 'border-cyan bg-cyan/5' : 'border-white/5 bg-black/20'}`}>
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>VPS Basic</span>
                        {hardwareTier === 'vps' && <span className="text-[8px] bg-cyan/20 text-cyan px-1.5 py-0.2 uppercase font-bold">ACTIVE</span>}
                      </div>
                      <div className="text-[10px] text-white/40 mt-0.5">Base Hashrate: 245.8 GH/s</div>
                    </div>
                    <span className="text-white/40 text-[10px] font-bold uppercase">{t('Darmowy', 'Free')}</span>
                  </div>

                  {/* Tier 2: Dedicated Pro */}
                  <div className={`p-2.5 border text-xs flex justify-between items-center ${hardwareTier === 'pro' ? 'border-cyan bg-cyan/5' : 'border-white/5 bg-black/20'}`}>
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>Pro Server</span>
                        {hardwareTier === 'pro' && <span className="text-[8px] bg-cyan/20 text-cyan px-1.5 py-0.2 uppercase font-bold">ACTIVE</span>}
                      </div>
                      <div className="text-[10px] text-white/40 mt-0.5">Base Hashrate: 600.0 GH/s (+144%)</div>
                    </div>
                    {hardwareTier === 'vps' ? (
                      <button
                        type="button"
                        onClick={() => handleUpgradeHardware('pro', 10)}
                        className="px-2.5 py-1 bg-cyan text-black font-bold text-[10px] uppercase hover:bg-white transition-all interactive-cursor"
                      >
                        {t('Kup: 10 $SLX', 'Buy: 10 $SLX')}
                      </button>
                    ) : (
                      <span className="text-white/30 text-[9px] uppercase font-bold">{hardwareTier === 'pro' ? t('Aktywny', 'Active') : t('Odblokowany', 'Unlocked')}</span>
                    )}
                  </div>

                  {/* Tier 3: ASIC Cluster */}
                  <div className={`p-2.5 border text-xs flex justify-between items-center ${hardwareTier === 'asic' ? 'border-cyan bg-cyan/5' : 'border-white/5 bg-black/20'}`}>
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>ASIC Cluster</span>
                        {hardwareTier === 'asic' && <span className="text-[8px] bg-cyan/20 text-cyan px-1.5 py-0.2 uppercase font-bold">ACTIVE</span>}
                      </div>
                      <div className="text-[10px] text-white/40 mt-0.5">Base Hashrate: 1,800.0 GH/s (+632%)</div>
                    </div>
                    {hardwareTier === 'vps' || hardwareTier === 'pro' ? (
                      <button
                        type="button"
                        onClick={() => handleUpgradeHardware('asic', 45)}
                        className="px-2.5 py-1 bg-cyan text-black font-bold text-[10px] uppercase hover:bg-white transition-all interactive-cursor"
                      >
                        {t('Kup: 45 $SLX', 'Buy: 45 $SLX')}
                      </button>
                    ) : (
                      <span className="text-white/30 text-[9px] uppercase font-bold">{hardwareTier === 'asic' ? t('Aktywny', 'Active') : t('Odblokowany', 'Unlocked')}</span>
                    )}
                  </div>

                  {/* Tier 4: Quantum Frame */}
                  <div className={`p-2.5 border text-xs flex justify-between items-center ${hardwareTier === 'quantum' ? 'border-cyan bg-cyan/5' : 'border-white/5 bg-black/20'}`}>
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>Solana Quantum Mainframe</span>
                        {hardwareTier === 'quantum' && <span className="text-[8px] bg-cyan/20 text-cyan px-1.5 py-0.2 uppercase font-bold">ACTIVE</span>}
                      </div>
                      <div className="text-[10px] text-white/40 mt-0.5">Base Hashrate: 5,000.0 GH/s (+1934%)</div>
                    </div>
                    {hardwareTier !== 'quantum' ? (
                      <button
                        type="button"
                        onClick={() => handleUpgradeHardware('quantum', 150)}
                        className="px-2.5 py-1 bg-cyan text-black font-bold text-[10px] uppercase hover:bg-white transition-all interactive-cursor"
                      >
                        {t('Kup: 150 $SLX', 'Buy: 150 $SLX')}
                      </button>
                    ) : (
                      <span className="text-white/30 text-[9px] uppercase font-bold">{t('Aktywny', 'Active')}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Category 2: Cooling Boosters */}
              <div className="space-y-3">
                <div className="text-[10px] text-white/40 uppercase tracking-[1.5px] font-bold border-b border-white/5 pb-1 flex justify-between items-center">
                  <span>{t('2. KRIOGENICZNE CHŁODZENIE', '2. CRYOGENIC COOLING')}</span>
                  <span className="text-g font-bold uppercase">[{coolingTier.toUpperCase()}]</span>
                </div>

                <div className="space-y-2">
                  {/* Passive Cooling */}
                  <div className={`p-2.5 border text-xs flex justify-between items-center ${coolingTier === 'passive' ? 'border-g bg-g/5' : 'border-white/5 bg-black/20'}`}>
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>Passive Air Cooling</span>
                        {coolingTier === 'passive' && <span className="text-[8px] bg-g/20 text-g px-1.5 py-0.2 uppercase font-bold">ACTIVE</span>}
                      </div>
                      <div className="text-[10px] text-white/40 mt-0.5">Cooling Multiplier: x1.00</div>
                    </div>
                    <span className="text-white/40 text-[10px] font-bold uppercase">{t('Darmowy', 'Free')}</span>
                  </div>

                  {/* Water Cooling */}
                  <div className={`p-2.5 border text-xs flex justify-between items-center ${coolingTier === 'water' ? 'border-g bg-g/5' : 'border-white/5 bg-black/20'}`}>
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>Closed-Loop Liquid</span>
                        {coolingTier === 'water' && <span className="text-[8px] bg-g/20 text-g px-1.5 py-0.2 uppercase font-bold">ACTIVE</span>}
                      </div>
                      <div className="text-[10px] text-white/40 mt-0.5">Cooling Multiplier: x1.25 (+25% hashrate)</div>
                    </div>
                    {coolingTier === 'passive' ? (
                      <button
                        type="button"
                        onClick={() => handleUpgradeCooling('water', 5)}
                        className="px-2.5 py-1 bg-g text-black font-bold text-[10px] uppercase hover:bg-white transition-all interactive-cursor"
                      >
                        {t('Kup: 5 $SLX', 'Buy: 5 $SLX')}
                      </button>
                    ) : (
                      <span className="text-white/30 text-[9px] uppercase font-bold">{coolingTier === 'water' ? t('Aktywne', 'Active') : t('Odblokowane', 'Unlocked')}</span>
                    )}
                  </div>

                  {/* Liquid Nitrogen */}
                  <div className={`p-2.5 border text-xs flex justify-between items-center ${coolingTier === 'nitrogen' ? 'border-g bg-g/5' : 'border-white/5 bg-black/20'}`}>
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>Liquid Nitrogen (Cryo)</span>
                        {coolingTier === 'nitrogen' && <span className="text-[8px] bg-g/20 text-g px-1.5 py-0.2 uppercase font-bold">ACTIVE</span>}
                      </div>
                      <div className="text-[10px] text-white/40 mt-0.5">Cooling Multiplier: x1.65 (+65% hashrate)</div>
                    </div>
                    {coolingTier !== 'nitrogen' ? (
                      <button
                        type="button"
                        onClick={() => handleUpgradeCooling('nitrogen', 25)}
                        className="px-2.5 py-1 bg-g text-black font-bold text-[10px] uppercase hover:bg-white transition-all interactive-cursor"
                      >
                        {t('Kup: 25 $SLX', 'Buy: 25 $SLX')}
                      </button>
                    ) : (
                      <span className="text-white/30 text-[9px] uppercase font-bold">{t('Aktywne', 'Active')}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setIsMining(!isMining)}
            className={`w-full py-4 border font-bold tracking-[4px] uppercase text-xs transition-all duration-300 interactive-cursor mb-6 ${
              isMining 
                ? 'border-r text-r hover:bg-r/10 hover:shadow-[0_0_20px_rgba(255,26,74,0.3)]' 
                : 'border-cyan text-cyan hover:bg-cyan/15 hover:shadow-[0_0_20px_rgba(0,238,255,0.3)]'
            }`}
          >
            {isMining ? t('⚡ WYŁĄCZ DECYZJĘ WYDOBYCIA', '⚡ SHUTDOWN ASSET EXCAVATOR') : t('⚡ URUCHOM DECYZJĘ WYDOBYCIA', '⚡ LAUNCH ASSET EXCAVATOR')}
          </button>

          {/* Real-time Mining Network Database & History section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Live Miners Panel */}
            <div className="border border-cyan/10 bg-black/40 p-4">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                <span className="text-xs text-cyan font-bold uppercase tracking-[2px] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
                  {t('Baza danych aktywnie kopiących', 'Active miners database')}
                </span>
                <span className="text-[10px] text-white/40 uppercase">
                  {serverMiners.filter(m => m.isOnline).length} ONLINE
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="text-white/30 text-[10px] uppercase border-b border-white/5">
                      <th className="py-1.5">{t('Nazwa Węzła', 'Node Name')}</th>
                      <th className="py-1.5 text-right">{t('Prędkość', 'Speed')}</th>
                      <th className="py-1.5 text-right">{t('Saldo $SLX', '$SLX Balance')}</th>
                      <th className="py-1.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {serverMiners.length > 0 ? (
                      serverMiners.map((m, idx) => (
                        <tr key={idx} className={m.username === currentUser ? "text-cyan bg-cyan/5 font-bold" : "text-white/80"}>
                          <td className="py-2 flex items-center gap-1.5 truncate max-w-[120px]">
                            <User className="w-3 h-3 text-cyan/70" />
                            <span className="truncate" title={m.username}>{m.username}</span>
                            {m.username === currentUser && <span className="text-[8px] bg-cyan/20 px-1 py-0.5 rounded text-cyan shrink-0">{t('TY', 'YOU')}</span>}
                          </td>
                          <td className="py-2 text-right text-cyan/90">{m.isOnline ? `${m.hashRate} GH/s` : '0 GH/s'}</td>
                          <td className="py-2 text-right font-bold">{m.balance.toFixed(4)}</td>
                          <td className="py-2 text-right">
                            <span 
                              className={`inline-block w-1.5 h-1.5 rounded-full ${
                                m.isOnline 
                                  ? (m.hashRate > 0 ? 'bg-g animate-pulse' : 'bg-yellow-500 animate-pulse') 
                                  : 'bg-white/20'
                              }`} 
                              title={
                                m.isOnline 
                                  ? (m.hashRate > 0 ? t('Kopie', 'Mining') : t('Standby', 'Standby')) 
                                  : t('Offline', 'Offline')
                              }
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-white/30 italic">
                          {t('Twój węzeł jest nieaktywny. Zarejestruj się / zaloguj po prawej stronie i uruchom wydobywanie, aby aktywować swój węzeł.', 'Your node is inactive. Register or log in on the right and launch the miner to activate your node.')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mining History Panel */}
            <div className="border border-white/10 bg-black/40 p-4">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                <span className="text-xs text-white/70 font-bold uppercase tracking-[2px] flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-g" />
                  {t('Historia kopiących z saldami', 'Miners history with balances')}
                </span>
                <span className="text-[10px] text-white/40 uppercase">{t('Logi sieci', 'Network logs')}</span>
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {serverHistory.length > 0 ? (
                  serverHistory.map((h, idx) => {
                    const isWithdrawal = h.action === 'WYPŁAĆ' || h.action === 'WYPŁATA' || h.action === 'WITHDRAWAL';
                    return (
                      <div key={idx} className="text-xs font-mono bg-black/30 p-2 border border-white/5 flex flex-col justify-between sm:flex-row gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-white/40 text-[10px] shrink-0">{h.timestamp}</span>
                          <span className="font-bold text-white truncate max-w-[100px]">{h.username}</span>
                          <span className={`text-[10px] px-1 py-0.2 uppercase shrink-0 font-bold ${
                            h.action === 'ZAPIS_PLONU' || h.action === 'SAVE_YIELD' ? 'bg-g/10 text-g border border-g/20' : 
                            isWithdrawal ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-cyan/10 text-cyan border border-cyan/20'
                          }`}>
                            {h.action === 'ZAPIS_PLONU' ? t('ZAPIS_PLONU', 'SAVE_YIELD') : h.action === 'WYPŁATA' || h.action === 'WYPŁAĆ' ? t('WYPŁATA', 'WITHDRAWAL') : h.action}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          {h.amount > 0 ? (
                            <span className={isWithdrawal ? "text-red-500 font-bold" : "text-g font-bold"}>
                              {isWithdrawal ? '-' : '+'}{h.amount.toFixed(4)} $SLX
                            </span>
                          ) : (
                            <span className="text-white/40">{t('Zarejestrowano', 'Registered')}</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-xs text-white/30 italic text-center py-4 font-mono">
                    {t('Brak rzeczywistych transakcji w historii. Aktywuj wydobywanie i dokonaj zapisu plonu, aby zobaczyć autentyczne dane.', 'No real transactions in history. Activate the miner and save your yield to see authentic data.')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Real-time Payout matrix / MiningLedger */}
          <div className="mt-6">
            <MiningLedger
              withdrawals={serverWithdrawals}
              onRefresh={fetchNetworkStatus}
              currentUser={currentUser}
            />
          </div>

          {/* Solana Network Core Data Hub / Educational Panel */}
          <div className="border border-white/10 bg-black/50 p-5 mt-6 rounded relative overflow-hidden font-mono text-xs">
            {/* Visual glow detail */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan/5 rounded-full filter blur-xl pointer-events-none" />
            
            <div className="flex items-center gap-2 text-cyan font-bold uppercase tracking-[2px] mb-3 pb-2 border-b border-white/5">
              <Zap className="w-4 h-4 text-cyan" />
              {t('SOLANA POŚRÓD KRYPTOWALUT - SPECYFIKA WYDOBYCIA', 'SOLANA AMONG CRYPTOCURRENCIES - MINING SPECIFICS')}
            </div>
            <p className="text-white/60 mb-4 leading-relaxed text-[11px]">
              {t(
                'Ważne wyjaśnienie: W przeciwieństwie do tradycyjnych sieci Proof-of-Work (jak Bitcoin czy Litecoin), sieć Solana opiera się na wydajnym i pro-ekologicznym konsensusie Proof-of-Stake (PoS) połączonym z Proof-of-History (PoH). Nie wydobywa się jej przy użyciu kart graficznych (GPU) ani koparek ASIC. Bezpieczeństwo i zatwierdzanie transakcji w sieci Solana leży w rękach rozproszonych Walidatorów, a użytkownicy mogą delegować (stakować) swoje monety SOL, otrzymując nagrody z inflacji protokołu.',
                'Important Explanation: Unlike traditional Proof-of-Work networks (such as Bitcoin or Litecoin), the Solana network utilizes an eco-friendly and highly efficient Proof-of-Stake (PoS) consensus combined with Proof-of-History (PoH). It cannot be mined using graphics cards (GPUs) or ASIC miners. Solana security is sustained by distributed Validators, and users can delegate (stake) their SOL coins to earn native protocol inflation yield.'
              )}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-black/40 p-3.5 border border-white/5 rounded">
              <div>
                <div className="text-white/40 uppercase text-[9px] font-bold tracking-wide">{t('MECHANIZM KONSENSUSU', 'CONSENSUS MECHANISM')}</div>
                <div className="text-white font-bold text-sm mt-0.5">Proof of Stake (PoS) + PoH</div>
              </div>
              <div>
                <div className="text-white/40 uppercase text-[9px] font-bold tracking-wide">{t('PRZEPUSTOWOŚĆ REALNA (TPS)', 'REAL THROUGHPUT (TPS)')}</div>
                <div className="text-cyan font-bold text-sm mt-0.5">~2,912 TPS</div>
              </div>
              <div>
                <div className="text-white/40 uppercase text-[9px] font-bold tracking-wide">{t('CZAS BLOKU / SLOTU', 'BLOCK / SLOT TIME')}</div>
                <div className="text-g font-bold text-sm mt-0.5">~398 ms</div>
              </div>
              <div>
                <div className="text-white/40 uppercase text-[9px] font-bold tracking-wide">{t('AKTYWNI WALIDATORZY', 'ACTIVE VALIDATORS')}</div>
                <div className="text-white font-bold text-sm mt-0.5">1,842 {t('Węzłów', 'Nodes')}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'deflation' && (
        <div className="animate-fadeIn font-mono">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            
            {/* Burn Simulator & Personal Forge controls */}
            <div className="flex flex-col gap-4">
              {currentUser ? (
                <div className="bg-red-500/5 border border-red-500/10 p-3.5 rounded flex flex-col gap-2">
                  <div className="text-[10px] text-r uppercase tracking-[1px] font-bold border-b border-white/5 pb-1 flex justify-between">
                    <span>{t('OSOBISTY PIEC HUTNICZY', 'PERSONAL SMELTER FORGE')}</span>
                    <span className="text-r font-bold">SLX MULTIPLIER: +{(totalBurnedSlx * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/60">{t('Zasoby Twojego portfela:', 'Your wallet funds:')}</span>
                    <span className="text-white font-bold">{savedSlx.toFixed(4)} $SLX</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/60">{t('Twoje spalone tokeny:', 'Your burned tokens:')}</span>
                    <span className="text-r font-bold">{totalBurnedSlx.toFixed(4)} $SLX</span>
                  </div>

                  {/* Personal Burn Form */}
                  <form onSubmit={handleManualBurn} className="mt-2 pt-2 border-t border-white/5">
                    <label className="text-[9px] text-white/40 uppercase block mb-1">{t('Moc Spalania (Trwałe usunięcie z obiegu)', 'Burn Power (Permanent Destruction)')}</label>
                    <div className="flex items-center bg-black/60 border border-white/10 px-2.5 py-1.5 mb-2">
                      <input
                        type="number"
                        step="any"
                        value={burnInputVal}
                        onChange={(e) => setBurnInputVal(e.target.value)}
                        placeholder={t('Ilość do spalenia', 'Amount to burn')}
                        className="w-full bg-transparent text-white font-bold text-xs focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setBurnInputVal(savedSlx.toFixed(4))}
                        className="text-[9px] text-r hover:text-white font-bold mr-2 uppercase shrink-0"
                      >
                        MAX
                      </button>
                      <span className="text-r font-bold text-[10px] shrink-0">$SLX</span>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-r/10 border border-r text-r hover:bg-r/25 hover:shadow-[0_0_12px_rgba(255,26,74,0.3)] transition-all font-bold uppercase tracking-[2px] text-[10px] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      {t('ZAINICJUJ SPALANIE $SLX', 'INITIATE $SLX INCINERATION')}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-3.5 rounded text-xs leading-relaxed text-white/70">
                  <div className="text-[9px] text-yellow-500 font-bold uppercase tracking-[1px] mb-1">{t('KONTROLA PIECA ZABLOKOWANA', 'SMELTER CONTROL LOCKED')}</div>
                  {t('Zaloguj się do swojego węzła po prawej, aby móc fizycznie palić wydobyty kapitał $SLX i aktywować stały bonus do zysku z wydobycia!', 'Log in to your node on the right to physically burn your mined $SLX capital and activate a permanent yield rate boost!')}
                </div>
              )}

              <div className="border border-white/5 p-3 bg-black/30">
                <div className="text-[9px] text-white/40 uppercase tracking-[1px] mb-2 font-bold">{t('SYMULATOR DEFLACJI PROJEKTU', 'PROJECT DEFLATION SIMULATOR')}</div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-white/40 uppercase block mb-1">{t('Prognozowany wolumen dobowy ($)', 'Projected daily volume ($)')}</label>
                    <div className="flex items-center bg-black/60 border border-white/10 px-3 py-1.5">
                      <input
                        type="number"
                        value={volumeInput}
                        onChange={(e) => setVolumeInput(Math.max(1000, Number(e.target.value)))}
                        className="w-full bg-transparent text-white font-bold text-xs focus:outline-none [appearance:textfield]"
                      />
                      <span className="text-r font-bold text-[10px]">USD</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-white/40 uppercase mb-1">
                      <span>{t('Procent Wskaźnika Spalania', 'Burn Rate Percentage')}</span>
                      <span className="text-r font-bold">{burnRate}%</span>
                    </div>
                    <div className="flex items-center h-[32px] bg-black/50 border border-white/10 px-3">
                      <input 
                        type="range" 
                        min="1.0" 
                        max="5.0" 
                        step="0.5"
                        value={burnRate} 
                        onChange={(e) => setBurnRate(Number(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-r"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Deflationary HUD metrics */}
            <div className="border border-r/15 bg-black/60 p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-r/5 rounded-full filter blur-2xl pointer-events-none" />
              <div>
                <div className="text-[10px] text-white/40 uppercase">{t('Suma Dotychczas Spalonych Tokenów', 'Total Tokens Auto-Burned To Date')}</div>
                <div className="text-xl md:text-2xl text-r font-bold mt-1 text-shadow-[0_0_8px_#ff1a4a] flex items-center gap-1.5">
                  <Flame className="w-5 h-5 text-r animate-bounce" />
                  {tokensBurned.toLocaleString(undefined, { maximumFractionDigits: 4 })} $SLX
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 mt-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-white/30 uppercase text-[9px] block">{t('Spalone / Rok', 'Burned / Year')}</span>
                    <span className="text-white font-bold">
                      {yearlyBurn.toLocaleString()} <span className="text-r text-[10px]">$SLX</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-white/30 uppercase text-[9px] block">{t('Kurczenie się Podaży', 'Supply Contraction')}</span>
                    <span className="text-r font-bold">
                      -{supplyBurnPercent}% / {t('Rok', 'Year')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="bg-r/5 border border-r-2 bg-gradient-to-r from-r/10 to-transparent p-4 text-center">
            <div className="text-xs text-white/80 font-bold tracking-[1px] leading-relaxed">
              🔥 <span className="text-r">{t('CZYSTO DEFLACYJNY SKARB:', 'PURELY DEFLATIONARY TREASURE:')}</span> {t('Każda transakcja trwale kurczy całkowity wolumen $SLX na rynku.', 'Each transaction permanently shrinks the total $SLX volume on the market.')}{' '}
              {t('Prawdziwy gem x1000 zbudowany na matematycznej rzadkości.', 'A true gem x1000 built on mathematical scarcity.')}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
