import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {TouchableOpacity, Text, Linking} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';
import TransactionApprovalModal, { PendingTransaction } from './src/components/TransactionApprovalModal';

const BACKEND_URL = 'https://chromepe-relay.chromepe-relay.workers.dev';
const MY_VPA = 'prasad@okicici'; 

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [pendingTxn, setPendingTxn] = useState<PendingTransaction | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      // Don't poll if we are already showing a transaction modal
      if (pendingTxn) return;
      
      try {
        const response = await fetch(`${BACKEND_URL}/payment/pending?vpa=${MY_VPA}`);
        const data = await response.json();
        
        if (data && data.pending && data.txnId) {
          setPendingTxn(data);
        }
      } catch (e) {
        console.log('Polling error:', e);
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [pendingTxn]);

  const handleApprove = async (txnId: string) => {
    try {
      await fetch(`${BACKEND_URL}/payment/${txnId}/callback`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({status: 'SUCCESS'}),
      });
      setPendingTxn(null); // Close modal on success
      
      // Attempt to return to Iqooistant
      Linking.openURL('iqooistant://payment?status=success').catch(() => console.log('Could not return'));
    } catch (e) {
      console.error('Approve error:', e);
    }
  };

  const handleReject = async () => {
    if (!pendingTxn) return;
    try {
      await fetch(`${BACKEND_URL}/payment/${pendingTxn.txnId}/callback`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({status: 'FAILED'}),
      });
    } catch (e) {
      console.error('Reject error:', e);
    } finally {
      setPendingTxn(null);
      Linking.openURL('iqooistant://payment?status=declined').catch(() => console.log('Could not return'));
    }
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider style={{flex: 1}}>
        {showSplash ? (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        ) : (
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        )}
        
        <TransactionApprovalModal
          visible={!!pendingTxn}
          transaction={pendingTxn}
          onApprove={handleApprove}
          onReject={handleReject}
        />
        

      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
