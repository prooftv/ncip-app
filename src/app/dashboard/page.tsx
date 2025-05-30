// ... existing imports ...
import { requestNotificationPermission, getFCMToken, isMessagingSupported } from '@lib/firebase/messaging';

export default function DashboardPage() {
  // ... existing state and effects ...

  const [messagingSupported, setMessagingSupported] = useState(true);

  useEffect(() => {
    const checkMessagingSupport = async () => {
      const supported = await isMessagingSupported();
      setMessagingSupported(supported);
    };

    checkMessagingSupport();
  }, []);

  // ... existing code ...

  const saveFCMToken = async () => {
    if (!user || !messagingSupported) return;
    
    try {
      const token = await getFCMToken();
      // ... rest of token saving logic ...
    } catch (error) {
      console.error('Failed to save FCM token:', error);
    }
  };

  // ... in the UI, add browser warning ...
  return (
    <div className={styles.container}>
      {!messagingSupported && (
        <div className={styles.browserWarning}>
          <FaExclamationTriangle className={styles.warningIcon} />
          <span>Your browser doesn't support push notifications. Some features may be limited.</span>
        </div>
      )}

      {/* ... rest of dashboard ... */}
    </div>
  );
}
