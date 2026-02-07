// BCBA Billing Tracker - Browser-ready version
// Uses global React, ReactDOM, and Lucide from CDN

const { useState, useEffect } = React;
const { 
  Calendar, Clock, Users, FileText, Settings, Plus, ChevronRight, 
  AlertCircle, CheckCircle, X, Menu, Lock, Unlock, Key, Shield, 
  UserPlus, LogOut, User 
} = lucide;

// Encryption utilities using Web Crypto API
class CryptoManager {
  constructor() {
    this.algorithm = 'AES-GCM';
    this.keyLength = 256;
    this.ivLength = 12;
    this.saltLength = 16;
    this.iterations = 100000;
  }

  async deriveKey(password, salt) {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    const keyMaterial = await crypto.subtle.importKey('raw', passwordBuffer, 'PBKDF2', false, ['deriveBits', 'deriveKey']);
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: salt, iterations: this.iterations, hash: 'SHA-256' },
      keyMaterial,
      { name: this.algorithm, length: this.keyLength },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async encrypt(data, password) {
    const salt = crypto.getRandomValues(new Uint8Array(this.saltLength));
    const iv = crypto.getRandomValues(new Uint8Array(this.ivLength));
    const key = await this.deriveKey(password, salt);
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const encryptedBuffer = await crypto.subtle.encrypt({ name: this.algorithm, iv: iv }, key, dataBuffer);
    const encryptedArray = new Uint8Array(encryptedBuffer);
    const combined = new Uint8Array(salt.length + iv.length + encryptedArray.length);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(encryptedArray, salt.length + iv.length);
    return this.arrayBufferToBase64(combined);
  }

  async decrypt(encryptedData, password) {
    const combined = this.base64ToArrayBuffer(encryptedData);
    const salt = combined.slice(0, this.saltLength);
    const iv = combined.slice(this.saltLength, this.saltLength + this.ivLength);
    const data = combined.slice(this.saltLength + this.ivLength);
    const key = await this.deriveKey(password, salt);
    const decryptedBuffer = await crypto.subtle.decrypt({ name: this.algorithm, iv: iv }, key, data);
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  }

  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return this.arrayBufferToBase64(new Uint8Array(hashBuffer));
  }

  arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
}

const BCBABillingTracker = () => {
  // Authentication state
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginScreen, setShowLoginScreen] = useState(true);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  
  // App state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [clients, setClients] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [providers, setProviders] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [showAddClient, setShowAddClient] = useState(false);
  const [showAddSession, setShowAddSession] = useState(false);
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [saveNotification, setSaveNotification] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  
  // Encryption state
  const [encryptionEnabled, setEncryptionEnabled] = useState(false);
  const [encryptionPassword, setEncryptionPassword] = useState(null);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [cryptoManager] = useState(new CryptoManager());

  // Load data from storage
  useEffect(() => {
    checkAuthentication();
  }, []);

  // Check if user is logged in
  const checkAuthentication = async () => {
    try {
      const currentUserData = await window.storage.get('bcba-current-user');
      if (currentUserData?.value) {
        const userData = JSON.parse(currentUserData.value);
        setCurrentUser(userData);
        setIsAuthenticated(true);
        setShowLoginScreen(false);
        await loadUserData(userData.username);
      } else {
        setShowLoginScreen(true);
      }
    } catch (error) {
      console.log('No authenticated user found');
      setShowLoginScreen(true);
    }
  };

  const loadData = async () => {
    if (!currentUser) return;
    await loadUserData(currentUser.username);
  };

  const loadUserData = async (username) => {
    try {
      // Check if encryption is enabled
      const encryptionStatus = await window.storage.get(`bcba-${username}-encryption-enabled`);
      const isEncrypted = encryptionStatus?.value === 'true';
      
      if (isEncrypted && !encryptionPassword) {
        setEncryptionEnabled(true);
        setIsLocked(true);
        setShowPasswordPrompt(true);
        return;
      }

      const clientsData = await window.storage.get(`bcba-${username}-clients`);
      const sessionsData = await window.storage.get(`bcba-${username}-sessions`);
      const providersData = await window.storage.get(`bcba-${username}-providers`);
      const activeSessionData = await window.storage.get(`bcba-${username}-active-session`);
      
      if (isEncrypted && encryptionPassword) {
        // Decrypt data
        if (clientsData?.value) {
          const decrypted = await cryptoManager.decrypt(clientsData.value, encryptionPassword);
          setClients(JSON.parse(decrypted));
        }
        if (sessionsData?.value) {
          const decrypted = await cryptoManager.decrypt(sessionsData.value, encryptionPassword);
          setSessions(JSON.parse(decrypted));
        }
        if (providersData?.value) {
          const decrypted = await cryptoManager.decrypt(providersData.value, encryptionPassword);
          setProviders(JSON.parse(decrypted));
        }
        if (activeSessionData?.value) {
          const decrypted = await cryptoManager.decrypt(activeSessionData.value, encryptionPassword);
          setActiveSession(JSON.parse(decrypted));
        }
      } else {
        // Load unencrypted data
        if (clientsData?.value) setClients(JSON.parse(clientsData.value));
        if (sessionsData?.value) setSessions(JSON.parse(sessionsData.value));
        if (providersData?.value) setProviders(JSON.parse(providersData.value));
        if (activeSessionData?.value) setActiveSession(JSON.parse(activeSessionData.value));
      }
      
      setEncryptionEnabled(isEncrypted);
      setIsLocked(false);
    } catch (error) {
      console.log('Load error:', error);
      if (error.message?.includes('decrypt')) {
        alert('Incorrect password or corrupted data. Please try again.');
        setIsLocked(true);
        setShowPasswordPrompt(true);
      }
    }
  };

  // Timer for active session
  useEffect(() => {
    let interval;
    if (activeSession) {
      interval = setInterval(() => {
        const start = new Date(activeSession.startTime);
        const now = new Date();
        const duration = Math.floor((now - start) / 1000);
        setSessionDuration(duration);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeSession]);
      console.log('Load error:', error);
      if (error.message?.includes('decrypt')) {
        alert('Incorrect password or corrupted data. Please try again.');
        setIsLocked(true);
        setShowPasswordPrompt(true);
      }
    }
  };

  const saveData = async (type, data) => {
    if (!currentUser) return;
    
    try {
      const jsonData = JSON.stringify(data);
      let dataToSave = jsonData;
      
      if (encryptionEnabled && encryptionPassword) {
        dataToSave = await cryptoManager.encrypt(jsonData, encryptionPassword);
      }
      
      await window.storage.set(`bcba-${currentUser.username}-${type}`, dataToSave);
      setSaveNotification('Data saved ✓');
      setTimeout(() => setSaveNotification(null), 2000);
    } catch (error) {
      setSaveNotification('Save failed ✗');
      setTimeout(() => setSaveNotification(null), 3000);
      console.error('Save error:', error);
    }
  };

  // Authentication Functions
  const createAccount = async (username, password, fullName, email) => {
    try {
      // Check if username already exists
      const existingUser = await window.storage.get(`bcba-user-${username}`);
      if (existingUser?.value) {
        alert('Username already exists. Please choose a different username.');
        return false;
      }

      // Hash password
      const passwordHash = await cryptoManager.hashPassword(password);

      // Create user account
      const userData = {
        username,
        fullName,
        email,
        passwordHash,
        createdAt: new Date().toISOString()
      };

      // Save user data
      await window.storage.set(`bcba-user-${username}`, JSON.stringify(userData));
      
      // Set as current user
      await window.storage.set('bcba-current-user', JSON.stringify({ username, fullName, email }));
      
      setCurrentUser({ username, fullName, email });
      setIsAuthenticated(true);
      setShowLoginScreen(false);
      setShowCreateAccount(false);
      
      alert(`Account created successfully! Welcome, ${fullName}!`);
      return true;
    } catch (error) {
      console.error('Account creation error:', error);
      alert('Failed to create account. Please try again.');
      return false;
    }
  };

  const login = async (username, password) => {
    try {
      // Get user data
      const userData = await window.storage.get(`bcba-user-${username}`);
      if (!userData?.value) {
        alert('Invalid username or password.');
        return false;
      }

      const user = JSON.parse(userData.value);
      
      // Verify password
      const passwordHash = await cryptoManager.hashPassword(password);
      if (passwordHash !== user.passwordHash) {
        alert('Invalid username or password.');
        return false;
      }

      // Set as current user
      await window.storage.set('bcba-current-user', JSON.stringify({
        username: user.username,
        fullName: user.fullName,
        email: user.email
      }));
      
      setCurrentUser({ username: user.username, fullName: user.fullName, email: user.email });
      setIsAuthenticated(true);
      setShowLoginScreen(false);
      
      // Load user's data
      await loadUserData(user.username);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
      return false;
    }
  };

  const logout = async () => {
    if (confirm('Are you sure you want to log out?')) {
      try {
        await window.storage.delete('bcba-current-user');
        setCurrentUser(null);
        setIsAuthenticated(false);
        setShowLoginScreen(true);
        setClients([]);
        setSessions([]);
        setProviders([]);
        setActiveSession(null);
        setEncryptionPassword(null);
        setEncryptionEnabled(false);
        setIsLocked(false);
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  };

  // Format duration for display
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Enable encryption
  const enableEncryption = async (password) => {
    if (!currentUser) return;
    
    try {
      // Hash password for verification
      const passwordHash = await cryptoManager.hashPassword(password);
      await window.storage.set(`bcba-${currentUser.username}-password-hash`, passwordHash);
      await window.storage.set(`bcba-${currentUser.username}-encryption-enabled`, 'true');
      
      setEncryptionPassword(password);
      setEncryptionEnabled(true);
      
      // Re-save all existing data with encryption
      if (clients.length > 0) await saveData('clients', clients);
      if (sessions.length > 0) await saveData('sessions', sessions);
      if (providers.length > 0) await saveData('providers', providers);
      if (activeSession) await saveData('active-session', activeSession);
      
      alert('Encryption enabled successfully! Your data is now encrypted.');
    } catch (error) {
      console.error('Enable encryption error:', error);
      alert('Failed to enable encryption. Please try again.');
    }
  };

  // Disable encryption
  const disableEncryption = async (password) => {
    if (!currentUser) return;
    
    try {
      // Verify password
      const passwordHash = await cryptoManager.hashPassword(password);
      const storedHash = await window.storage.get(`bcba-${currentUser.username}-password-hash`);
      
      if (storedHash?.value !== passwordHash) {
        alert('Incorrect password. Cannot disable encryption.');
        return;
      }
      
      // Decrypt and re-save all data without encryption
      setEncryptionPassword(password);
      await loadData(); // Load encrypted data first
      
      setEncryptionEnabled(false);
      setEncryptionPassword(null);
      
      // Re-save unencrypted
      if (clients.length > 0) await window.storage.set(`bcba-${currentUser.username}-clients`, JSON.stringify(clients));
      if (sessions.length > 0) await window.storage.set(`bcba-${currentUser.username}-sessions`, JSON.stringify(sessions));
      if (providers.length > 0) await window.storage.set(`bcba-${currentUser.username}-providers`, JSON.stringify(providers));
      if (activeSession) await window.storage.set(`bcba-${currentUser.username}-active-session`, JSON.stringify(activeSession));
      
      await window.storage.delete(`bcba-${currentUser.username}-password-hash`);
      await window.storage.delete(`bcba-${currentUser.username}-encryption-enabled`);
      
      alert('Encryption disabled. Your data is no longer encrypted.');
    } catch (error) {
      console.error('Disable encryption error:', error);
      alert('Failed to disable encryption.');
    }
  };

  // Unlock app with password
  const unlockApp = async (password) => {
    if (!currentUser) return false;
    
    try {
      const passwordHash = await cryptoManager.hashPassword(password);
      const storedHash = await window.storage.get(`bcba-${currentUser.username}-password-hash`);
      
      if (storedHash?.value !== passwordHash) {
        alert('Incorrect password. Please try again.');
        return false;
      }
      
      setEncryptionPassword(password);
      setShowPasswordPrompt(false);
      await loadData();
      return true;
    } catch (error) {
      console.error('Unlock error:', error);
      alert('Failed to unlock. Please try again.');
      return false;
    }
  };

  // Lock app
  const lockApp = () => {
    setEncryptionPassword(null);
    setIsLocked(true);
    setClients([]);
    setSessions([]);
    setProviders([]);
    setActiveSession(null);
    setActiveTab('dashboard');
  };

  // Excel Export/Import Functions using SheetJS
  const exportToExcel = () => {
    try {
      // Create workbook
      const wb = XLSX.utils.book_new();

      // Sessions Sheet
      const sessionsData = sessions.map(s => {
        const client = clients.find(c => c.id === s.clientId);
        const provider = providers.find(p => p.id === s.providerId);
        return {
          'Date': new Date(s.startTime).toLocaleDateString(),
          'Start Time': new Date(s.startTime).toLocaleTimeString(),
          'End Time': s.endTime ? new Date(s.endTime).toLocaleTimeString() : 'In Progress',
          'Client Name': client?.name || 'Unknown',
          'Client ID': client?.clientId || '',
          'Provider': provider?.name || 'Unknown',
          'Provider Type': provider?.type || '',
          'CPT Code': s.cptCode,
          'Location': s.location,
          'Duration (min)': s.durationMinutes || 0,
          'Units': s.units || 0,
          'Notes': s.notes || '',
          'Status': s.status || 'completed'
        };
      });
      const sessionsSheet = XLSX.utils.json_to_sheet(sessionsData);
      XLSX.utils.book_append_sheet(wb, sessionsSheet, 'Sessions');

      // Clients Sheet
      const clientsData = clients.map(c => ({
        'Name': c.name,
        'Client ID': c.clientId,
        'Prior Auth Number': c.priorAuthNumber || '',
        'Diagnosis Code': c.diagnosisCode || '',
        'Created Date': new Date(c.createdAt).toLocaleDateString()
      }));
      const clientsSheet = XLSX.utils.json_to_sheet(clientsData);
      XLSX.utils.book_append_sheet(wb, clientsSheet, 'Clients');

      // Providers Sheet
      const providersData = providers.map(p => ({
        'Name': p.name,
        'Type': p.type,
        'NPI Number': p.npi,
        'Credentials': p.credentials || '',
        'Created Date': new Date(p.createdAt).toLocaleDateString()
      }));
      const providersSheet = XLSX.utils.json_to_sheet(providersData);
      XLSX.utils.book_append_sheet(wb, providersSheet, 'Providers');

      // Summary Sheet
      const totalSessions = sessions.length;
      const totalUnits = sessions.reduce((sum, s) => sum + (s.units || 0), 0);
      const totalMinutes = sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
      const rbtSessions = sessions.filter(s => s.cptCode === '97153').length;
      const supervisionSessions = sessions.filter(s => s.cptCode === '97155').length;
      const supervisionCompliance = rbtSessions > 0 ? ((supervisionSessions / rbtSessions) * 100).toFixed(1) : 0;

      const summaryData = [
        { 'Metric': 'Total Sessions', 'Value': totalSessions },
        { 'Metric': 'Total Units Billed', 'Value': totalUnits },
        { 'Metric': 'Total Minutes', 'Value': totalMinutes },
        { 'Metric': 'Total Clients', 'Value': clients.length },
        { 'Metric': 'Total Providers', 'Value': providers.length },
        { 'Metric': 'RBT Sessions (97153)', 'Value': rbtSessions },
        { 'Metric': 'Supervision Sessions (97155)', 'Value': supervisionSessions },
        { 'Metric': 'Supervision Compliance %', 'Value': supervisionCompliance + '%' },
        { 'Metric': 'Export Date', 'Value': new Date().toLocaleString() },
        { 'Metric': 'Exported By', 'Value': currentUser?.fullName || currentUser?.username || '' }
      ];
      const summarySheet = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');

      // Generate Excel file
      const filename = `bcba-export-${currentUser?.username || 'data'}-${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, filename);
      
      return true;
    } catch (error) {
      console.error('Excel export error:', error);
      throw error;
    }
  };

  const importFromExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        let importedClients = [];
        let importedSessions = [];
        let importedProviders = [];

        // Import Clients
        if (workbook.SheetNames.includes('Clients')) {
          const clientsSheet = workbook.Sheets['Clients'];
          const clientsArray = XLSX.utils.sheet_to_json(clientsSheet);
          importedClients = clientsArray.map(row => ({
            id: 'client-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            name: row['Name'] || '',
            clientId: row['Client ID'] || '',
            priorAuthNumber: row['Prior Auth Number'] || '',
            diagnosisCode: row['Diagnosis Code'] || '',
            createdAt: new Date().toISOString()
          })).filter(c => c.name);
        }

        // Import Providers
        if (workbook.SheetNames.includes('Providers')) {
          const providersSheet = workbook.Sheets['Providers'];
          const providersArray = XLSX.utils.sheet_to_json(providersSheet);
          importedProviders = providersArray.map(row => ({
            id: 'provider-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            name: row['Name'] || '',
            type: row['Type'] || 'RBT',
            npi: row['NPI Number'] || '',
            credentials: row['Credentials'] || '',
            createdAt: new Date().toISOString()
          })).filter(p => p.name);
        }

        // Import Sessions (need to match clients and providers)
        if (workbook.SheetNames.includes('Sessions')) {
          const sessionsSheet = workbook.Sheets['Sessions'];
          const sessionsArray = XLSX.utils.sheet_to_json(sessionsSheet);
          
          importedSessions = sessionsArray.map(row => {
            // Find matching client
            const clientName = row['Client Name'] || '';
            const matchingClient = importedClients.find(c => c.name === clientName) || clients.find(c => c.name === clientName);
            
            // Find matching provider
            const providerName = row['Provider'] || '';
            const matchingProvider = importedProviders.find(p => p.name === providerName) || providers.find(p => p.name === providerName);

            if (!matchingClient || !matchingProvider) return null;

            // Parse date and time
            const dateStr = row['Date'] || new Date().toLocaleDateString();
            const startTimeStr = row['Start Time'] || '09:00:00';
            const endTimeStr = row['End Time'] && row['End Time'] !== 'In Progress' ? row['End Time'] : null;

            return {
              id: 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
              clientId: matchingClient.id,
              providerId: matchingProvider.id,
              cptCode: row['CPT Code'] || '97153',
              location: row['Location'] || 'Clinic',
              startTime: new Date(dateStr + ' ' + startTimeStr).toISOString(),
              endTime: endTimeStr ? new Date(dateStr + ' ' + endTimeStr).toISOString() : null,
              durationMinutes: parseInt(row['Duration (min)']) || 0,
              units: parseInt(row['Units']) || 0,
              notes: row['Notes'] || '',
              status: row['Status'] || 'completed'
            };
          }).filter(s => s !== null);
        }

        // Confirm import
        const message = `Import ${importedClients.length} clients, ${importedProviders.length} providers, and ${importedSessions.length} sessions?\n\nThis will ADD to your existing data (not replace).`;
        
        if (confirm(message)) {
          // Merge with existing data
          const newClients = [...clients, ...importedClients];
          const newProviders = [...providers, ...importedProviders];
          const newSessions = [...sessions, ...importedSessions];

          setClients(newClients);
          setProviders(newProviders);
          setSessions(newSessions);

          saveData('clients', newClients);
          saveData('providers', newProviders);
          saveData('sessions', newSessions);

          alert(`Successfully imported:\n${importedClients.length} clients\n${importedProviders.length} providers\n${importedSessions.length} sessions`);
        }
      } catch (error) {
        console.error('Excel import error:', error);
        alert('Error importing Excel file. Please make sure it\'s a valid BCBA Tracker export file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // CPT Codes for Indiana BCBA billing
  const cptCodes = [
    { code: '97151', name: 'Behavior ID Assessment', requiresClient: true, maxUnits: 971 },
    { code: '97153', name: 'Direct ABA Therapy (RBT)', requiresClient: true, maxUnits: 971 },
    { code: '97155', name: 'Protocol Modification', requiresClient: true, maxUnits: 971 },
    { code: '97156', name: 'Family Guidance', requiresClient: false, maxUnits: 971 },
    { code: '97158', name: 'Group Treatment', requiresClient: true, maxUnits: 971 }
  ];

  const locationTypes = ['Home', 'School', 'Community', 'Telehealth', 'Clinic'];

  // Add Client
  const addClient = (clientData) => {
    const newClient = {
      id: Date.now().toString(),
      ...clientData,
      createdAt: new Date().toISOString()
    };
    const updatedClients = [...clients, newClient];
    setClients(updatedClients);
    saveData('clients', updatedClients);
    setShowAddClient(false);
  };

  // Add Provider
  const addProvider = (providerData) => {
    const newProvider = {
      id: Date.now().toString(),
      ...providerData,
      createdAt: new Date().toISOString()
    };
    const updatedProviders = [...providers, newProvider];
    setProviders(updatedProviders);
    saveData('providers', updatedProviders);
    setShowAddProvider(false);
  };

  // Start Session
  const startSession = (sessionData) => {
    const newSession = {
      id: Date.now().toString(),
      ...sessionData,
      startTime: new Date().toISOString(),
      status: 'active'
    };
    setActiveSession(newSession);
    saveData('active-session', newSession);
  };

  // End Session
  const endSession = async (notes) => {
    if (!activeSession) return;
    
    const endTime = new Date();
    const startTime = new Date(activeSession.startTime);
    const durationMinutes = Math.round((endTime - startTime) / 60000);
    const units = Math.ceil(durationMinutes / 15); // 15-minute units
    
    const completedSession = {
      ...activeSession,
      endTime: endTime.toISOString(),
      durationMinutes,
      units,
      notes,
      status: 'completed'
    };
    
    const updatedSessions = [...sessions, completedSession];
    setSessions(updatedSessions);
    saveData('sessions', updatedSessions);
    setActiveSession(null);
    
    // Clear active session from storage
    try {
      await window.storage.delete('bcba-active-session');
    } catch (error) {
      console.log('Error clearing active session');
    }
  };

  // Add manual session
  const addManualSession = (sessionData) => {
    const start = new Date(sessionData.date + 'T' + sessionData.startTime);
    const end = new Date(sessionData.date + 'T' + sessionData.endTime);
    const durationMinutes = Math.round((end - start) / 60000);
    const units = Math.ceil(durationMinutes / 15);
    
    const newSession = {
      id: Date.now().toString(),
      ...sessionData,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      durationMinutes,
      units,
      status: 'completed'
    };
    
    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    saveData('sessions', updatedSessions);
    setShowAddSession(false);
  };

  // Calculate supervision compliance
  const calculateSupervisionCompliance = () => {
    const rbtSessions = sessions.filter(s => {
      const provider = providers.find(p => p.id === s.providerId);
      return provider?.type === 'RBT' && s.cptCode === '97153';
    });
    
    const supervisionSessions = sessions.filter(s => s.cptCode === '97155');
    
    const totalRBTMinutes = rbtSessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    const totalSupervisionMinutes = supervisionSessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    
    const requiredSupervision = totalRBTMinutes * 0.1; // 10% minimum
    const compliance = totalRBTMinutes > 0 ? (totalSupervisionMinutes / requiredSupervision) * 100 : 100;
    
    return {
      rbtMinutes: totalRBTMinutes,
      supervisionMinutes: totalSupervisionMinutes,
      requiredMinutes: requiredSupervision,
      compliancePercent: Math.min(compliance, 100)
    };
  };

  // Dashboard Component
  const Dashboard = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaySessions = sessions.filter(s => s.startTime?.startsWith(today));
    const todayUnits = todaySessions.reduce((sum, s) => sum + (s.units || 0), 0);
    const todayMinutes = todaySessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
    const supervision = calculateSupervisionCompliance();
    
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">BCBA Billing Tracker</h1>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-600 mb-1">Today's Sessions</div>
            <div className="text-2xl font-bold text-blue-900">{todaySessions.length}</div>
            <div className="text-xs text-blue-600 mt-1">{todayMinutes} min / {todayUnits} units</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-sm text-green-600 mb-1">Active Clients</div>
            <div className="text-2xl font-bold text-green-900">{clients.length}</div>
            <div className="text-xs text-green-600 mt-1">{providers.length} providers</div>
          </div>
        </div>

        {/* Supervision Compliance */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Supervision Compliance</span>
            <span className={`text-sm font-bold ${supervision.compliancePercent >= 100 ? 'text-green-600' : 'text-orange-600'}`}>
              {supervision.compliancePercent.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className={`h-2 rounded-full ${supervision.compliancePercent >= 100 ? 'bg-green-500' : 'bg-orange-500'}`}
              style={{ width: `${Math.min(supervision.compliancePercent, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-600">
            {supervision.supervisionMinutes} / {supervision.requiredMinutes.toFixed(0)} required minutes
          </div>
        </div>

        {/* Active Session Alert */}
        {activeSession && (
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg p-4 mb-6 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <span className="font-bold text-lg">Session in Progress</span>
              </div>
              <Clock className="w-6 h-6" />
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-3">
              <div className="text-sm opacity-90 mb-1">
                {clients.find(c => c.id === activeSession.clientId)?.name || 'Unknown Client'}
              </div>
              <div className="text-2xl font-mono font-bold tracking-wider">
                {formatDuration(sessionDuration)}
              </div>
              <div className="text-xs opacity-75 mt-1">
                CPT {activeSession.cptCode} • {activeSession.location}
              </div>
            </div>
            
            <button
              onClick={() => {
                const notes = prompt('Enter session notes (optional):');
                if (notes !== null) endSession(notes);
              }}
              className="w-full bg-white text-red-600 py-3 px-4 rounded-lg font-bold shadow-md active:scale-95 transition-transform"
            >
              End Session
            </button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-3">
          <button
            onClick={() => setShowAddSession(true)}
            disabled={activeSession !== null}
            className={`w-full ${activeSession ? 'bg-gray-400' : 'bg-blue-600 active:bg-blue-700'} text-white py-4 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all text-lg`}
          >
            <Plus className="w-6 h-6" />
            {activeSession ? 'Session Active' : 'Log Session'}
          </button>
          
          <button
            onClick={() => setShowAddClient(true)}
            className="w-full bg-green-600 active:bg-green-700 text-white py-4 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all text-lg"
          >
            <Users className="w-6 h-6" />
            Add Client
          </button>
        </div>

        {/* Recent Sessions */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Recent Sessions</h2>
          {sessions.slice(-5).reverse().map(session => {
            const client = clients.find(c => c.id === session.clientId);
            const provider = providers.find(p => p.id === session.providerId);
            const cpt = cptCodes.find(c => c.code === session.cptCode);
            
            return (
              <div key={session.id} className="bg-white border border-gray-200 rounded-lg p-3 mb-2">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-gray-800">{client?.name || 'Unknown Client'}</span>
                  <span className="text-sm text-gray-600">{session.units} units</span>
                </div>
                <div className="text-sm text-gray-600">
                  CPT {session.cptCode} - {cpt?.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(session.startTime).toLocaleDateString()} • {provider?.name} • {session.durationMinutes} min
                </div>
              </div>
            );
          })}
          {sessions.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No sessions logged yet
            </div>
          )}
        </div>
      </div>
    );
  };

  // Clients List Component
  const ClientsList = () => {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Clients</h1>
          <button
            onClick={() => setShowAddClient(true)}
            className="bg-blue-600 text-white p-2 rounded-lg"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        
        {clients.map(client => {
          const clientSessions = sessions.filter(s => s.clientId === client.id);
          const totalUnits = clientSessions.reduce((sum, s) => sum + (s.units || 0), 0);
          
          return (
            <div key={client.id} className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold text-gray-800">{client.name}</div>
                  <div className="text-sm text-gray-600">ID: {client.clientId}</div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-sm text-gray-600">
                {clientSessions.length} sessions • {totalUnits} total units
              </div>
              {client.priorAuthNumber && (
                <div className="text-xs text-gray-500 mt-1">
                  PA: {client.priorAuthNumber}
                </div>
              )}
            </div>
          );
        })}
        
        {clients.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No clients added yet</p>
            <button
              onClick={() => setShowAddClient(true)}
              className="mt-4 text-blue-600 font-semibold"
            >
              Add your first client
            </button>
          </div>
        )}
      </div>
    );
  };

  // Sessions Log Component
  const SessionsLog = () => {
    const [filterDate, setFilterDate] = useState('');
    
    const filteredSessions = filterDate 
      ? sessions.filter(s => s.startTime?.startsWith(filterDate))
      : sessions;
    
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Sessions Log</h1>
        
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
        />
        
        <div className="space-y-2">
          {filteredSessions.reverse().map(session => {
            const client = clients.find(c => c.id === session.clientId);
            const provider = providers.find(p => p.id === session.providerId);
            const cpt = cptCodes.find(c => c.code === session.cptCode);
            
            return (
              <div key={session.id} className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold text-gray-800">{client?.name}</div>
                    <div className="text-sm text-gray-600">CPT {session.cptCode} - {cpt?.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">{session.units} units</div>
                    <div className="text-sm text-gray-600">{session.durationMinutes} min</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(session.startTime).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  Provider: {provider?.name} • Location: {session.location}
                </div>
                {session.notes && (
                  <div className="text-sm text-gray-700 mt-2 p-2 bg-gray-50 rounded">
                    {session.notes}
                  </div>
                )}
              </div>
            );
          })}
          
          {filteredSessions.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              No sessions found
            </div>
          )}
        </div>
      </div>
    );
  };

  // Reports Component
  const Reports = () => {
    const supervision = calculateSupervisionCompliance();
    
    // Calculate by CPT code
    const cptSummary = cptCodes.map(cpt => {
      const cptSessions = sessions.filter(s => s.cptCode === cpt.code);
      const totalUnits = cptSessions.reduce((sum, s) => sum + (s.units || 0), 0);
      const totalMinutes = cptSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
      return {
        ...cpt,
        sessions: cptSessions.length,
        units: totalUnits,
        minutes: totalMinutes
      };
    }).filter(c => c.sessions > 0);
    
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Reports</h1>
        
        {/* Summary Stats */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <h2 className="font-semibold mb-3 text-gray-800">Overall Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Sessions:</span>
              <span className="font-semibold">{sessions.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Units:</span>
              <span className="font-semibold">{sessions.reduce((sum, s) => sum + (s.units || 0), 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Minutes:</span>
              <span className="font-semibold">{sessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0)}</span>
            </div>
          </div>
        </div>
        
        {/* Supervision Compliance */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <h2 className="font-semibold mb-3 text-gray-800">Supervision Compliance</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">RBT Direct Service:</span>
              <span className="font-semibold">{supervision.rbtMinutes} min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Supervision Provided:</span>
              <span className="font-semibold">{supervision.supervisionMinutes} min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Required (10%):</span>
              <span className="font-semibold">{supervision.requiredMinutes.toFixed(0)} min</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-gray-600">Compliance:</span>
              <span className={`font-bold ${supervision.compliancePercent >= 100 ? 'text-green-600' : 'text-orange-600'}`}>
                {supervision.compliancePercent.toFixed(0)}%
                {supervision.compliancePercent >= 100 ? ' ✓' : ' ⚠'}
              </span>
            </div>
          </div>
        </div>
        
        {/* By CPT Code */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="font-semibold mb-3 text-gray-800">By CPT Code</h2>
          <div className="space-y-3">
            {cptSummary.map(cpt => (
              <div key={cpt.code} className="pb-3 border-b border-gray-200 last:border-0">
                <div className="font-semibold text-gray-800 mb-1">
                  CPT {cpt.code} - {cpt.name}
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="text-gray-600 text-xs">Sessions</div>
                    <div className="font-semibold">{cpt.sessions}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-xs">Units</div>
                    <div className="font-semibold">{cpt.units}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-xs">Minutes</div>
                    <div className="font-semibold">{cpt.minutes}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Add Client Modal
  const AddClientModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      clientId: '',
      priorAuthNumber: '',
      diagnosisCode: ''
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
        <div className="bg-white rounded-t-3xl sm:rounded-lg p-6 w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Add New Client</h2>
            <button 
              onClick={() => setShowAddClient(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Client Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2">Client ID *</label>
              <input
                type="text"
                value={formData.clientId}
                onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none"
                placeholder="12345"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2">Prior Authorization #</label>
              <input
                type="text"
                value={formData.priorAuthNumber}
                onChange={(e) => setFormData({...formData, priorAuthNumber: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none"
                placeholder="PA-2024-12345"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2">Diagnosis Code</label>
              <input
                type="text"
                value={formData.diagnosisCode}
                onChange={(e) => setFormData({...formData, diagnosisCode: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none"
                placeholder="F84.0"
              />
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowAddClient(false)}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold active:bg-gray-300 text-base"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (formData.name && formData.clientId) {
                  addClient(formData);
                }
              }}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold active:bg-blue-700 text-base"
            >
              Add Client
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Add Session Modal
  const AddSessionModal = () => {
    const [isTimerMode, setIsTimerMode] = useState(true);
    const [formData, setFormData] = useState({
      clientId: '',
      providerId: '',
      cptCode: '97153',
      location: 'Home',
      date: new Date().toISOString().split('T')[0],
      startTime: '',
      endTime: '',
      notes: '',
      clientPresent: true
    });

    if (isTimerMode) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
          <div className="bg-white rounded-t-3xl sm:rounded-lg p-6 w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Start Session Timer</h2>
              <button 
                onClick={() => setShowAddSession(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Client *</label>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select client</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Provider *</label>
                <select
                  value={formData.providerId}
                  onChange={(e) => setFormData({...formData, providerId: e.target.value})}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select provider</option>
                  {providers.map(p => <option key={p.id} value={p.id}>{p.name} ({p.type})</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">CPT Code *</label>
                <select
                  value={formData.cptCode}
                  onChange={(e) => setFormData({...formData, cptCode: e.target.value})}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none"
                >
                  {cptCodes.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Location *</label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none"
                >
                  {locationTypes.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={() => {
                  if (formData.clientId && formData.providerId) {
                    startSession(formData);
                    setShowAddSession(false);
                  }
                }}
                className="w-full bg-green-600 text-white py-4 px-4 rounded-xl font-bold active:bg-green-700 text-lg"
              >
                Start Timer
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddSession(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold active:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsTimerMode(false)}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold active:bg-blue-700"
                >
                  Manual Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto z-50">
        <div className="bg-white rounded-t-3xl sm:rounded-lg p-6 w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Add Manual Session</h2>
            <button 
              onClick={() => setShowAddSession(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Client *</label>
              <select
                value={formData.clientId}
                onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2">Provider *</label>
              <select
                value={formData.providerId}
                onChange={(e) => setFormData({...formData, providerId: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select provider</option>
                {providers.map(p => <option key={p.id} value={p.id}>{p.name} ({p.type})</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2">CPT Code *</label>
              <select
                value={formData.cptCode}
                onChange={(e) => setFormData({...formData, cptCode: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none"
              >
                {cptCodes.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2">Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-2">Start Time *</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">End Time *</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2">Location *</label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none"
              >
                {locationTypes.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2">Session Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none"
                rows="3"
                placeholder="Session notes, interventions, observations..."
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={() => {
                if (formData.clientId && formData.providerId && formData.startTime && formData.endTime) {
                  addManualSession(formData);
                }
              }}
              className="w-full bg-blue-600 text-white py-4 px-4 rounded-xl font-bold active:bg-blue-700 text-lg"
            >
              Add Session
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddSession(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold active:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsTimerMode(true)}
                className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold active:bg-gray-700"
              >
                Timer Mode
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Settings Component
  const SettingsPage = () => {
    const [showEncryptionSetup, setShowEncryptionSetup] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleEnableEncryption = async () => {
      if (!newPassword || !confirmPassword) {
        alert('Please enter and confirm your password.');
        return;
      }
      if (newPassword !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }
      if (newPassword.length < 8) {
        alert('Password must be at least 8 characters long.');
        return;
      }
      
      await enableEncryption(newPassword);
      setShowEncryptionSetup(false);
      setNewPassword('');
      setConfirmPassword('');
    };

    const handleDisableEncryption = async () => {
      const password = prompt('Enter your password to disable encryption:');
      if (password) {
        await disableEncryption(password);
      }
    };

    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Settings</h1>
        
        <div className="space-y-4">
          {/* Encryption Settings */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <h2 className="font-semibold text-gray-800">Data Encryption</h2>
              </div>
              {encryptionEnabled && (
                <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                  <Lock className="w-4 h-4" />
                  Enabled
                </div>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-3">
              {encryptionEnabled 
                ? 'Your data is encrypted with AES-256-GCM encryption. All data is encrypted before being saved.'
                : 'Protect your sensitive client data with end-to-end encryption. Your data will be encrypted with a password only you know.'
              }
            </p>
            
            {!encryptionEnabled ? (
              showEncryptionSetup ? (
                <div className="space-y-3 mt-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none"
                      placeholder="At least 8 characters"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none"
                      placeholder="Re-enter password"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowEncryptionSetup(false);
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleEnableEncryption}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold"
                    >
                      Enable Encryption
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowEncryptionSetup(true)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Enable Encryption
                </button>
              )
            ) : (
              <div className="space-y-2">
                <button
                  onClick={lockApp}
                  className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Lock App Now
                </button>
                <button
                  onClick={handleDisableEncryption}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  Disable Encryption
                </button>
              </div>
            )}
            
            {encryptionEnabled && (
              <div className="mt-3 p-3 bg-green-50 rounded border border-green-200">
                <p className="text-xs text-green-800">
                  <strong>Security Info:</strong> Your password is never stored. Only a secure hash is kept for verification. If you forget your password, your data cannot be recovered.
                </p>
              </div>
            )}
          </div>

          {/* Account Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-gray-600" />
              <h2 className="font-semibold text-gray-800">Account</h2>
            </div>
            
            {currentUser && (
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-semibold text-gray-800">{currentUser.fullName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Username:</span>
                  <span className="font-semibold text-gray-800">{currentUser.username}</span>
                </div>
                {currentUser.email && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold text-gray-800">{currentUser.email}</span>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={logout}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 active:bg-red-700"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="font-semibold mb-3 text-gray-800">Providers</h2>
            
            {providers.map(p => (
              <div key={p.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                <div>
                  <div className="font-semibold text-gray-800">{p.name}</div>
                  <div className="text-sm text-gray-600">{p.type} - NPI: {p.npi}</div>
                </div>
              </div>
            ))}
            
            <button
              onClick={() => setShowAddProvider(true)}
              className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Provider
            </button>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="font-semibold mb-2 text-gray-800">Data Management</h2>
            <p className="text-sm text-gray-600 mb-3">All data is stored locally on your device and persists between sessions</p>
            
            <div className="space-y-2">
              {/* Excel Export */}
              <button
                onClick={() => {
                  if (confirm('Export all data to Excel? This will create a spreadsheet with all your sessions, clients, and providers.')) {
                    try {
                      exportToExcel();
                      alert('Excel file downloaded successfully!');
                    } catch (error) {
                      console.error('Excel export error:', error);
                      alert('Error creating Excel file. Please try again.');
                    }
                  }
                }}
                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg font-semibold active:bg-emerald-700 flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Export to Excel
              </button>

              {/* Excel Import */}
              <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.xlsx,.xls';
                  input.onchange = async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      importFromExcel(file);
                    }
                  };
                  input.click();
                }}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold active:bg-blue-700 flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Import from Excel
              </button>

              <div className="border-t border-gray-200 my-3 pt-3">
                <p className="text-xs text-gray-500 mb-2">JSON Format (for backup/advanced users)</p>
              </div>

              {/* JSON Export */}
              <button
                onClick={() => {
                  if (confirm('Export all data? This will generate a JSON file with all your sessions, clients, and providers.')) {
                    const data = { clients, sessions, providers, exportDate: new Date().toISOString() };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `bcba-export-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                  }
                }}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold active:bg-green-700"
              >
                Export Data (JSON)
              </button>
              
              {/* JSON Import */}
              {/* JSON Import */}
              <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.json';
                  input.onchange = async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = async (event) => {
                        try {
                          const data = JSON.parse(event.target.result);
                          if (confirm('Import this data? This will replace your current data.')) {
                            if (data.clients) {
                              setClients(data.clients);
                              await saveData('clients', data.clients);
                            }
                            if (data.sessions) {
                              setSessions(data.sessions);
                              await saveData('sessions', data.sessions);
                            }
                            if (data.providers) {
                              setProviders(data.providers);
                              await saveData('providers', data.providers);
                            }
                            alert('Data imported successfully!');
                          }
                        } catch (error) {
                          alert('Error importing data. Please check the file format.');
                        }
                      };
                      reader.readAsText(file);
                    }
                  };
                  input.click();
                }}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold active:bg-blue-700"
              >
                Import Data (JSON)
              </button>
              
              <button
                onClick={async () => {
                  if (confirm('⚠️ WARNING: This will delete ALL your data including clients, sessions, and providers. This cannot be undone. Are you sure?')) {
                    if (confirm('Are you absolutely sure? This action is permanent.')) {
                      setClients([]);
                      setSessions([]);
                      setProviders([]);
                      setActiveSession(null);
                      try {
                        await window.storage.delete('bcba-clients');
                        await window.storage.delete('bcba-sessions');
                        await window.storage.delete('bcba-providers');
                        await window.storage.delete('bcba-active-session');
                      } catch (error) {
                        console.log('Error clearing storage');
                      }
                      alert('All data has been cleared.');
                    }
                  }
                }}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-semibold"
              >
                Clear All Data
              </button>
            </div>
            
            <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
              <p className="text-xs text-blue-800">
                <strong>Storage Info:</strong> Your data is saved automatically and persists even when you close the app. Export regularly for backups.
              </p>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="font-semibold mb-2 text-gray-800">About</h2>
            <p className="text-sm text-gray-600">
              BCBA Billing Tracker for Indiana
              <br />
              Version 1.0
              <br />
              <br />
              This app helps BCBAs and RBTs track billable hours according to Indiana Medicaid BCBA billing requirements.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Add Provider Modal
  const AddProviderModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      type: 'BCBA',
      npi: '',
      credentials: ''
    });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
        <div className="bg-white rounded-t-3xl sm:rounded-lg p-6 w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Add Provider</h2>
            <button 
              onClick={() => setShowAddProvider(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none"
                placeholder="Jane Smith"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none"
              >
                <option value="BCBA">BCBA</option>
                <option value="BCaBA">BCaBA</option>
                <option value="RBT">RBT</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2">NPI Number *</label>
              <input
                type="text"
                value={formData.npi}
                onChange={(e) => setFormData({...formData, npi: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none"
                placeholder="1234567890"
                inputMode="numeric"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2">Credentials</label>
              <input
                type="text"
                value={formData.credentials}
                onChange={(e) => setFormData({...formData, credentials: e.target.value})}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none"
                placeholder="BCBA, M.Ed"
              />
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowAddProvider(false)}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold active:bg-gray-300 text-base"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (formData.name && formData.type && formData.npi) {
                  addProvider(formData);
                }
              }}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold active:bg-blue-700 text-base"
            >
              Add Provider
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Login Screen
  const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleLogin = async () => {
      if (!username || !password) {
        alert('Please enter both username and password.');
        return;
      }
      setIsLoggingIn(true);
      await login(username, password);
      setIsLoggingIn(false);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">BCBA Tracker</h1>
            <p className="text-gray-600 mt-2">Secure billing management for BCBA professionals</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none"
                placeholder="Enter your username"
                disabled={isLoggingIn}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none"
                placeholder="Enter your password"
                disabled={isLoggingIn}
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={isLoggingIn || !username || !password}
              className="w-full bg-blue-600 text-white py-4 px-4 rounded-xl font-bold active:bg-blue-700 text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? 'Logging in...' : 'Log In'}
            </button>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Don't have an account?</p>
              <button
                onClick={() => setShowCreateAccount(true)}
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Create Account Screen
  const CreateAccountScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateAccount = async () => {
      if (!username || !password || !fullName) {
        alert('Please fill in all required fields.');
        return;
      }
      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }
      if (password.length < 8) {
        alert('Password must be at least 8 characters long.');
        return;
      }
      if (username.length < 3) {
        alert('Username must be at least 3 characters long.');
        return;
      }

      setIsCreating(true);
      await createAccount(username, password, fullName, email);
      setIsCreating(false);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-700 to-teal-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
            <p className="text-gray-600 mt-2">Set up your secure BCBA billing account</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-green-500 focus:outline-none"
                placeholder="John Doe, BCBA"
                disabled={isCreating}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-green-500 focus:outline-none"
                placeholder="john.doe@example.com"
                disabled={isCreating}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Username *</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-green-500 focus:outline-none"
                placeholder="johndoe (min 3 characters)"
                disabled={isCreating}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Password *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-green-500 focus:outline-none"
                placeholder="At least 8 characters"
                disabled={isCreating}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Confirm Password *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg text-base focus:border-green-500 focus:outline-none"
                placeholder="Re-enter password"
                disabled={isCreating}
              />
            </div>

            <button
              onClick={handleCreateAccount}
              disabled={isCreating}
              className="w-full bg-green-600 text-white py-4 px-4 rounded-xl font-bold active:bg-green-700 text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Already have an account?</p>
              <button
                onClick={() => setShowCreateAccount(false)}
                className="text-green-600 font-semibold hover:text-green-700"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Password Prompt Modal
  const PasswordPromptModal = () => {
    const [password, setPassword] = useState('');
    const [isUnlocking, setIsUnlocking] = useState(false);

    const handleSubmit = async () => {
      if (!password) return;
      setIsUnlocking(true);
      const success = await unlockApp(password);
      if (!success) {
        setPassword('');
      }
      setIsUnlocking(false);
    };

    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Enter Password</h2>
            <p className="text-sm text-gray-600 mt-2 text-center">
              Your data is encrypted. Enter your password to unlock.
            </p>
          </div>
          
          <div className="mb-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full p-4 border-2 border-gray-300 rounded-lg text-base focus:border-blue-500 focus:outline-none"
              placeholder="Enter your password"
              autoFocus
              disabled={isUnlocking}
            />
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!password || isUnlocking}
            className="w-full bg-blue-600 text-white py-4 px-4 rounded-xl font-bold active:bg-blue-700 text-lg disabled:bg-gray-400"
          >
            {isUnlocking ? 'Unlocking...' : 'Unlock'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col" style={{ maxWidth: '100vw', overflowX: 'hidden' }}>
      <style>{`
        * { -webkit-tap-highlight-color: transparent; }
        input, select, textarea { font-size: 16px; }
        .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .active\:scale-95:active { transform: scale(0.95); }
        .active\:scale-98:active { transform: scale(0.98); }
      `}</style>
      
      {/* Show Authentication Screens */}
      {showLoginScreen && !showCreateAccount && <LoginScreen />}
      {showCreateAccount && <CreateAccountScreen />}
      
      {/* Show Password Prompt if data is encrypted */}
      {showPasswordPrompt && isAuthenticated && <PasswordPromptModal />}
      
      {/* Main App - Only show if authenticated and not locked */}
      {isAuthenticated && !showLoginScreen && !showPasswordPrompt && (
        <>
          {/* Save Notification Toast */}
          {saveNotification && (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg font-semibold">
              {saveNotification}
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto pb-24" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="max-w-md mx-auto">
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'clients' && <ClientsList />}
              {activeTab === 'sessions' && <SessionsLog />}
              {activeTab === 'reports' && <Reports />}
              {activeTab === 'settings' && <SettingsPage />}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto safe-area-bottom shadow-lg">
            <div className="flex justify-around py-3 px-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex flex-col items-center p-2 min-w-[60px] rounded-lg transition-colors ${activeTab === 'dashboard' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 active:bg-gray-100'}`}
              >
                <Clock className="w-6 h-6" />
                <span className="text-xs mt-1 font-medium">Home</span>
              </button>
              <button
                onClick={() => setActiveTab('clients')}
                className={`flex flex-col items-center p-2 min-w-[60px] rounded-lg transition-colors ${activeTab === 'clients' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 active:bg-gray-100'}`}
              >
                <Users className="w-6 h-6" />
                <span className="text-xs mt-1 font-medium">Clients</span>
              </button>
              <button
                onClick={() => setActiveTab('sessions')}
                className={`flex flex-col items-center p-2 min-w-[60px] rounded-lg transition-colors ${activeTab === 'sessions' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 active:bg-gray-100'}`}
              >
                <FileText className="w-6 h-6" />
                <span className="text-xs mt-1 font-medium">Sessions</span>
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`flex flex-col items-center p-2 min-w-[60px] rounded-lg transition-colors ${activeTab === 'reports' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 active:bg-gray-100'}`}
              >
                <Calendar className="w-6 h-6" />
                <span className="text-xs mt-1 font-medium">Reports</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex flex-col items-center p-2 min-w-[60px] rounded-lg transition-colors ${activeTab === 'settings' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 active:bg-gray-100'}`}
              >
                <Settings className="w-6 h-6" />
                <span className="text-xs mt-1 font-medium">Settings</span>
              </button>
            </div>
          </div>

          {/* Modals */}
          {showAddClient && <AddClientModal />}
          {showAddSession && <AddSessionModal />}
          {showAddProvider && <AddProviderModal />}
        </>
      )}
    </div>
  );
};

// Make component available globally for browser use
window.BCBABillingTracker = BCBABillingTracker;
