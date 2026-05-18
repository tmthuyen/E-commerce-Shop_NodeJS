import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import MoneyInput from './MoneyInput';

describe('MoneyInput', () => {
  it('renders the formatted value', () => {
    render(<MoneyInput value={1234567} />);

    expect(screen.getByDisplayValue('1.234.567')).toBeInTheDocument();
  });

  it('formats user input and returns numeric value', () => {
    const handleChange = vi.fn();

    render(<MoneyInput value={0} onChange={handleChange} placeholder='Nhập số tiền' />);

    fireEvent.change(screen.getByPlaceholderText('Nhập số tiền'), {
      target: { value: '12.345.678đ' },
    });

    expect(handleChange).toHaveBeenCalledWith(12345678);
  });
});
