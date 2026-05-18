import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { RequireAuth, RequireGuest } from './RequiredAuthRoute';

// mock the hook used by RequireAuth/RequireGuest
// Use a global callback to avoid vi.mock hoisting issues; tests will set
// `globalThis.__useAuthMock` to a function returning the desired value.
vi.mock('../hooks/authHook', () => {
  return {
    default: () => (globalThis.__useAuthMock ? globalThis.__useAuthMock() : { user: null, loading: false }),
  };
});

describe('Route Guards', () => {
  afterEach(() => {
    // cleanup the global mock between tests
    delete globalThis.__useAuthMock;
  });
  it('PrivateRoute allows access when role matches', () => {
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route
            path="/admin"
            element={<PrivateRoute role="ADMIN" user={{ role: 'ADMIN' }} />}
          >
            <Route index element={<div>Protected</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected')).toBeInTheDocument();
  });

  it('PrivateRoute denies access when role does not match', () => {
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route
            path="/admin"
            element={<PrivateRoute role="ADMIN" user={{ role: 'USER' }} />}
          >
            <Route index element={<div>Protected</div>} />
          </Route>
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Protected should not render when role mismatches
    expect(screen.queryByText('Protected')).not.toBeInTheDocument();
  });

  it('RequireAuth redirects to login when no user', () => {
    globalThis.__useAuthMock = () => ({ user: null, loading: false });

    render(
      <MemoryRouter initialEntries={["/secret"]}>
        <Routes>
          <Route path="/secret" element={<RequireAuth />}>
            <Route index element={<div>Secret</div>} />
          </Route>
          <Route path="/login" element={<div>LoginPage</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('LoginPage')).toBeInTheDocument();
  });

  it('RequireAuth allows when user exists', () => {
    globalThis.__useAuthMock = () => ({ user: { id: 1 }, loading: false });

    render(
      <MemoryRouter initialEntries={["/secret"]}>
        <Routes>
          <Route path="/secret" element={<RequireAuth />}>
            <Route index element={<div>Secret</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Secret')).toBeInTheDocument();
  });

  it('RequireGuest redirects logged-in user to home', () => {
    globalThis.__useAuthMock = () => ({ user: { id: 1 }, loading: false });

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<RequireGuest />}>
            <Route index element={<div>LoginPage</div>} />
          </Route>
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('RequireGuest allows guest access', () => {
    globalThis.__useAuthMock = () => ({ user: null, loading: false });

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<RequireGuest />}>
            <Route index element={<div>LoginPage</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('LoginPage')).toBeInTheDocument();
  });
});
