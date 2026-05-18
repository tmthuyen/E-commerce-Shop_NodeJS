import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AlertRating from './AlertRating';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('AlertRating', () => {
  it('shows the login prompt when open', () => {
    render(<AlertRating isOpen={true} setIsOpen={vi.fn()} />);

    expect(screen.getByText(/vui lòng đăng nhập để đánh giá sản phẩm/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /đăng nhập/i })).toBeInTheDocument();
  });

  it('closes dialog and navigates to login', () => {
    const setIsOpen = vi.fn();

    render(<AlertRating isOpen={true} setIsOpen={setIsOpen} />);

    fireEvent.click(screen.getByRole('button', { name: /đăng nhập/i }));

    expect(setIsOpen).toHaveBeenCalledWith(false);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
