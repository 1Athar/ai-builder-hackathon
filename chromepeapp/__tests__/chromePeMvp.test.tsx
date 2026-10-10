import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {Text} from 'react-native';
import App from '../App';
import colors from '../src/theme/colors';
import {currentUser, transactions, contacts, banks, mobilePlans, billCategories} from '../src/data/mockData';
import ContactAvatar from '../src/components/ContactAvatar';
import TransactionItem from '../src/components/TransactionItem';

describe('ChromePe MVP scaffolding', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });
  test('exports theme colors and mock data', () => {
    expect(colors.primary).toBe('#5f259f');
    expect(currentUser.name).toBe('Prasad');
    expect(transactions).toHaveLength(10);
    expect(contacts).toHaveLength(3);
    expect(banks).toHaveLength(2);
    expect(mobilePlans).toHaveLength(4);
    expect(billCategories).toHaveLength(4);
  });

  test('renders avatar initial', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(<ContactAvatar name="Prasad" />);
    });
    const text = tree!.root.findByType(Text);
    expect(text.props.children).toBe('P');
  });

  test('renders credited transaction amount with plus sign', async () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        <TransactionItem name="Salary Credit" amount={45000} type="received" date="2026-05-26" />,
      );
    });
    const texts = tree!.root.findAllByType(Text);
    expect(texts.some(node => node.props.children === '+₹45,000')).toBe(true);
  });

  test('shows splash branding on first render', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<App />);
    });
    const texts = renderer!.root.findAllByType(Text);
    expect(texts.some(node => node.props.children === 'ChromePe')).toBe(true);
    expect(texts.some(node => node.props.children === 'Fast. Safe. Simple.')).toBe(true);
    await ReactTestRenderer.act(() => {
      renderer!.unmount();
    });
  });
});
