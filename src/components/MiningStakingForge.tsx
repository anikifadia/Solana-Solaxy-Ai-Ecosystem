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
      if (usersList[active]) {
        setSavedSlx(usersList[active].savedSlx || 0);
      }
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
            hashRate: isMining ? 245.8 : 0,
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
  }, [currentUser, isMining, savedSlx]);

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
    if (lockPeriod === 30) setSimulatedApy(18.5);
    else if (lockPeriod === 90) setSimulatedApy(45.2);
    else if (lockPeriod === 180) setSimulatedApy(88.9);
    else setSimulatedApy(142.4);
  }, [lockPeriod]);

  // Real-time counter for auto-burned tokens
  useEffect(() => {
    const burnTimer = setInterval(() => {
      setTokensBurned((prev) => prev + Number((Math.random() * 2.8 + 0.4).toFixed(4)));
    }, 1800);
    return () => clearInterval(burnTimer);
  }, []);

  // Mining cycle simulation
  useEffect(() => {
    if (!isMining) {
      setMiningSpeed(0);
      return;
    }

    // Set mining speed hash-rate
    setMiningSpeed(245.8);

    const mineInterval = setInterval(() => {
      setMinedRewards((prev) => {
        const rewardIncrease = 0.0042 * (1 + (Math.random() - 0.4) * 0.1);
        return Number((prev + rewardIncrease).toFixed(6));
      });

      // Sim multiplier level changes
      setMinedMultiplier((prev) => {
        if (Math.random() < 0.15) {
          const randMult = Math.random() * 5.0 + 1.2;
          return Number(randMult.toFixed(2));
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(mineInterval);
  }, [isMining]);

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
          <span className="w-1.5 h-1.5 rounded-full bg-g animate-ping" /> {t('INNOWACYJNE GÓRNICTWO & KUŹNIA', 'INNOVATIVE MINING & FORGE')}
        </div>
        <h3 className="font-display text-2xl md:text-3xl tracking-[1px] text-white uppercase">
          {t('KOPALNIA I KUŹNIA TOKENÓW - ', 'TOKEN MINE & FORGE - ')}<span className="text-g text-shadow-[0_0_8px_rgba(0,255,136,0.35)]">SOLAXY MINING</span>
        </h3>
        <p className="text-xs text-[#c8e6d2]/50 mt-1 max-w-[640px]">
          {t(
            'Połączenie najprostszego na świecie tworzenia tokenów z innowacyjnym systemem wirtualnego górnictwa (Mining) i stabilnego stakowania (Staking Vault).',
            'Combining the simplest token creation in the world with an innovative virtual mining system (Mining) and stable staking (Staking Vault).'
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
          <span className="text-[10px] md:text-xs font-bold tracking-[2px] uppercase">{t('GÓRNICTWO PŁYNNOŚCI', 'LIQUIDITY MINING')}</span>
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
              <div>
                <label className="text-[10px] text-white/40 uppercase block mb-1.5">{t('Ilość do Stakowania ($SLX)', 'Stake Amount ($SLX)')}</label>
                <div className="flex items-center bg-black/60 border border-white/10 px-4 py-2.5">
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-transparent text-white font-bold text-sm focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
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
                    +{estYield} <span className="text-xs text-g">$SLX</span>
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
                    ${x1000EstValue} USD
                  </span>
                </div>
              </div>
            </div>

          </div>

          <button 
            className="w-full py-4 border border-g text-g font-bold tracking-[4px] uppercase text-xs hover:bg-g/15 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all duration-300 interactive-cursor"
            onClick={() => alert(t('W AI Studio Preview zasymulowano stakowanie. Twój portfel połączył się i ulokował tokeny bezpiecznie w puli Smart Contract!', 'Staking simulated in AI Studio Preview. Your wallet connected and deposited tokens securely in the Smart Contract pool!'))}
          >
            {t('DEPOZYT W SEJFIE STAKOWANIA', 'DEPOSIT TO STAKING VAULT')}
          </button>
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
                    {isMining ? t('GÓRNICTWO AKTYWNE', 'ACTIVE MINING') : t('OFFLINE', 'OFFLINE')}
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
                      <span>{t('Wykopane $SLX:', 'Mined $SLX:')}</span>
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
                      {t('Zarejestruj węzeł konta po prawej, aby zapisać wykopany plon.', 'Register an account node on the right to save the mined yield.')}
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
                    {serverMiners.map((m, idx) => (
                      <tr key={idx} className={m.username === currentUser ? "text-cyan bg-cyan/5 font-bold" : "text-white/80"}>
                        <td className="py-2 flex items-center gap-1.5 truncate max-w-[120px]">
                          <User className="w-3 h-3 text-cyan/70" />
                          {m.username} {m.username === currentUser && <span className="text-[8px] bg-cyan/20 px-1 py-0.5 rounded text-cyan">{t('TY', 'YOU')}</span>}
                        </td>
                        <td className="py-2 text-right text-cyan/90">{m.isOnline ? `${m.hashRate} GH/s` : '0 GH/s'}</td>
                        <td className="py-2 text-right font-bold">{m.balance.toFixed(4)}</td>
                        <td className="py-2 text-right">
                          <span className={`inline-block w-1.5 h-1.5 rounded-full ${m.isOnline ? 'bg-g animate-pulse' : 'bg-white/20'}`} />
                        </td>
                      </tr>
                    ))}
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
                  <div className="text-xs text-white/30 italic text-center py-4 font-mono">{t('Brak wpisów w historii...', 'No history entries...')}</div>
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
        </div>
      )}

      {activeTab === 'deflation' && (
        <div className="animate-fadeIn font-mono">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            
            {/* Burn Simulator controls */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[10px] text-white/40 uppercase block mb-1.5">{t('Prognozowany wolumen dobowy ($)', 'Projected daily volume ($)')}</label>
                <div className="flex items-center bg-black/60 border border-white/10 px-4 py-2.5">
                  <input
                    type="number"
                    value={volumeInput}
                    onChange={(e) => setVolumeInput(Math.max(1000, Number(e.target.value)))}
                    className="w-full bg-transparent text-white font-bold text-sm focus:outline-none [appearance:textfield]"
                  />
                  <span className="text-r font-bold text-xs">USD</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-white/40 uppercase mb-1.5">
                  <span>{t('Procent Wskaźnika Spalania', 'Burn Rate Percentage')}</span>
                  <span className="text-r font-bold">{burnRate}%</span>
                </div>
                <div className="flex items-center h-[38px] bg-black/50 border border-white/10 px-4">
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

            {/* Simulated Deflationary HUD metrics */}
            <div className="border border-r/15 bg-black/60 p-4 flex flex-col justify-between">
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
