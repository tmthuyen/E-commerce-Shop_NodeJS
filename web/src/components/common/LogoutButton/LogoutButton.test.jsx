import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import LogoutButton from './LogoutButton';

describe('LogoutButton', () => {
  it('renders the logout link with default label', () => {
    render(
      <MemoryRouter>
        <LogoutButton />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: /đăng xuất/i });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/logout');
  });

  it('renders custom text', () => {
    render(
      <MemoryRouter>
        <LogoutButton text='Thoát tài khoản' />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /thoát tài khoản/i })).toBeInTheDocument();
  });
});
