import React, {useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../theme/colors';

export interface PendingTransaction {
  txnId: string;
  amount: string;
  vpa: string;
  merchantName: string;
  description: string;
}

interface Props {
  visible: boolean;
  transaction: PendingTransaction | null;
  onApprove: (txnId: string) => Promise<void>;
  onReject: () => void;
}

export default function TransactionApprovalModal({
  visible,
  transaction,
  onApprove,
  onReject,
}: Props) {
  const [loading, setLoading] = useState(false);

  if (!transaction) return null;

  const handleApprove = async () => {
    setLoading(true);
    await onApprove(transaction.txnId);
    setLoading(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Icon name="payment" size={32} color={colors.primary} />
            </View>
            <Text style={styles.title}>Payment Request</Text>
            <Text style={styles.subtitle}>from ChromePe Extension</Text>
          </View>

          <View style={styles.amountContainer}>
            <Text style={styles.currency}>₹</Text>
            <Text style={styles.amount}>{transaction.amount}</Text>
          </View>

          <View style={styles.detailsBox}>
            <DetailRow label="To" value={transaction.merchantName} />
            <DetailRow label="VPA" value={transaction.vpa} />
            {transaction.description ? (
              <DetailRow label="Note" value={transaction.description} />
            ) : null}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={onReject}
              disabled={loading}>
              <Text style={styles.rejectText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.approveButton}
              onPress={handleApprove}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.approveText}>Approve</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function DetailRow({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  currency: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.textPrimary,
    marginRight: 4,
  },
  amount: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  detailsBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  rowLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 2,
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  rejectButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
  },
  rejectText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  approveButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#34A853',
    alignItems: 'center',
    shadowColor: '#34A853',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  approveText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
