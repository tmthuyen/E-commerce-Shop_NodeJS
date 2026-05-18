import { Link, Outlet } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import './CustomerLayout.css';
import CustomerFooter from '@/components/customer/CustomerFooter';
import { ACTIVE_PAGES } from '@/constants/pageConstants';
import SearchHome from '@/components/customer/SearchHome';
// import CategoryDrawer from '@/pages/customer/Category/CategoryDrawer';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Person,
  ListAltOutlined as ListAlt,
  ShoppingCartOutlined as CartIcon,
  AccountCircle,
  ArrowDropUpOutlined,
  ArrowDropDownOutlined, 
  Logout,
  Login,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllCategory,
  getAllRootCategory,
} from '../../redux/reducers/categorySlice';
import { Badge } from '@mui/material';
import useCart from '../../hooks/cartHook';
import CartDrawer from '../../components/customer/CartDrawer';
import CategoryDrawer from '../../components/customer/CategoryDrawer';
import CategoryDropdown from '../../components/customer/CategoryDropdown';
import useAuth from '../../hooks/authHook';
import { fetchCartUser } from '../../redux/reducers/cartSlice';
import UserMenuMobile from '../../components/customer/Menu/UserMenuMobile';

const menuPages = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'About Us', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const menuBottom = [
  { name: 'Trang chủ', path: '/', icon: <HomeIcon /> },
  // { name: 'Yêu thích', path: '/account/favorites', icon: <Favorite /> },
  { name: 'Tài khoản', path: '/account/profile', icon: <AccountCircle /> },
  // { name: 'Giỏ hàng', path: '/account/carts', icon: <ShoppingCart /> },
  { name: 'Đơn hàng', path: '/account/orders', icon: <ListAlt /> },
];
function CustomerLayout() {
  const { user } = useAuth();
  const { length } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { categories, rootCategories } = useSelector(
    (state) => state.categories
  );
  const dispatch = useDispatch();
  // const [categories, setCategories] = useState(null)

  // load cart neu da login
  useEffect(() => {
    if (user) {
      dispatch(fetchCartUser(user._id));
    }
  }, [dispatch, user]);

  // load cate
  useEffect(() => {
    if (!categories) {
      dispatch(getAllCategory());
      // setIsOpen();
    }
  }, [dispatch, categories]);

  useEffect(() => {
    if (!rootCategories) {
      dispatch(getAllRootCategory());
      // setIsOpen();
    }
  }, [dispatch, rootCategories]);

  // ESC để đóng + khóa scroll khi mở
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setDrawerOpen(false);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  // Đóng menu profile khi click ra ngoài
  const profileMenuRef = useRef();
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    }
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  const [activePage, setActivePage] = useState(ACTIVE_PAGES.home);
  const handleActivePage = (page) => {
    setActivePage(page);
  };

  // Đóng menu danh mục khi click ra ngoài
  const cateMenuRef = useRef();
  const [isOpenCateMenu, setIsOpenCateMenu] = useState(false);
  useEffect(() => {
    function handleClickOutside(event) {
      if (cateMenuRef.current && !cateMenuRef.current.contains(event.target)) {
        setIsOpenCateMenu(false);
      }
    }
    if (isOpenCateMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpenCateMenu]);

  // Drawer categories for mobile
  const [isOpenDrawerCate, setIsOpenDrawerCate] = useState(false);
  const drawerCateRef = useRef();
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        drawerCateRef.current &&
        !drawerCateRef.current.contains(event.target)
      ) {
        setIsOpenDrawerCate(false);
      }
    }
    if (isOpenDrawerCate) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpenDrawerCate]);

  // Drawer cart khi click cart icon
  const [isOpenDrawerCart, setIsOpenDrawerCart] = useState(false);
  const drawerCartRef = useRef();
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        drawerCartRef.current &&
        !drawerCartRef.current.contains(event.target)
      ) {
        setIsOpenDrawerCart(false);
      }
    }
    if (isOpenDrawerCart) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpenDrawerCart]);

  return (
    <div className="layout-customer flex flex-col items-stretch min-h-screen">
      {/* ✅ Header với 2 hàng: Logo/Search/Cart/User | Category/Pages */}
      <header className="layout-customer__header fixed w-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg z-10">
        {/* Hàng 1: Logo, Search, Cart, User - Desktop */}
        <div className="layout-customer__nav container mx-auto py-3 hidden md:flex justify-between items-center gap-4 px-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <div className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg p-2 transition-all">
                <img
                  src={'/logo_e_shop.png'}
                  className="h-10 w-10 object-cover"
                  alt="Logo"
                />
                <p className="font-bold text-white text-lg whitespace-nowrap">
                  E Shop
                </p>
              </div>
            </Link>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-2xl mx-4">
            <SearchHome isHomePage={true} />
          </div>

          {/* Cart */}
          <div
            className="nav-item--cart cursor-pointer hover:scale-110 transition-transform"
            onClick={() => setIsOpenDrawerCart(true)}
          >
            <Badge color="error" badgeContent={length} max={99}>
              <div className="bg-white/10 hover:bg-white/20 p-2 rounded-full">
                <CartIcon className="text-white" fontSize="large" />
              </div>
            </Badge>
          </div>

          {/* User menu */}
          <div className="nav-item--account relative" ref={profileMenuRef}>
            <div
              onClick={() => setShowProfileMenu((v) => !v)}
              className="flex items-center gap-2 cursor-pointer bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 transition-all"
            >
              <AccountCircle className="text-white" />
              <p className="font-semibold text-white text-sm">
                {user?.username || user?.full_name || 'Khách'}
              </p>
              <span
                className={`arrow-down ${showProfileMenu ? 'open' : ''}`}
              ></span>
            </div>

            {/* Dropdown menu */}
            <div
              className={`menuProfile-modern absolute right-0 top-full mt-2 min-w-[200px] z-20 transition-all duration-300 ${
                showProfileMenu
                  ? 'visible opacity-100 scale-100'
                  : 'invisible opacity-0 scale-95'
              }`}
            >
              <ul className="py-2">
                {user ? (
                  <>
                    <li
                      className="menuProfile-item"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Link to="/account/profile">
                        <Person className="mr-2" /> Tài khoản của tôi
                      </Link>
                    </li>
                    <li
                      className="menuProfile-item"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Link to="/account/orders">
                        <ListAlt className="mr-2" /> Đơn hàng của tôi
                      </Link>
                    </li>
                    <li
                      className="menuProfile-item"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Link to="/account/carts">
                        <CartIcon className="mr-2" /> Giỏ hàng ({length})
                      </Link>
                    </li>
                    <li
                      className="menuProfile-item text-red-600"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Link to="/logout">
                        <Logout className="mr-2" /> Đăng xuất
                      </Link>
                    </li>
                  </>
                ) : (
                  <li
                    className="menuProfile-item"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <Link to="/login">
                      <Login className="mr-2" /> Đăng nhập
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* ✅ Hàng 2: Category + Pages - Desktop (ngang hàng) */}
        <div className="bg-white/10 border-t border-white/20 hidden md:block">
          <div className="container mx-auto px-4 py-2 flex items-center gap-4">
            {/* Category Dropdown */}
            <div ref={cateMenuRef} className="relative flex-shrink-0">
              <div
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-all min-w-[200px]"
                onClick={() => setIsOpenCateMenu(!isOpenCateMenu)}
              >
                <MenuIcon />
                <span className="font-semibold">Danh mục sản phẩm</span>
                {isOpenCateMenu ? (
                  <ArrowDropUpOutlined className="ml-auto" />
                ) : (
                  <ArrowDropDownOutlined className="ml-auto" />
                )}
              </div>

              {/* Category Dropdown Menu */}
              <div className="absolute left-0 top-full mt-1 min-w-[200px] z-20">
                <CategoryDropdown
                  categories={rootCategories}
                  isOpenCateMenu={isOpenCateMenu}
                />
              </div>
            </div>

            {/* Pages Navigation */}
            <nav className="flex items-center gap-2 flex-1">
              {menuPages.map((page) => (
                <Link
                  key={page.name}
                  to={page.path}
                  onClick={() => handleActivePage(page.name)}
                  className={clsx(
                    'px-4 py-2 rounded-lg font-medium transition-all',
                    'hover:bg-white/20 hover:text-white',
                    activePage === page.name
                      ? 'bg-white/20 text-white border-b-2 border-white'
                      : 'text-white/90'
                  )}
                >
                  {page.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* ✅ Mobile Header */}
        <div className="md:hidden flex justify-between items-center px-4 py-3">
          <MenuIcon
            className="cursor-pointer text-white"
            onClick={() => setIsOpenDrawerCate(!isOpenDrawerCate)}
          />

          {/* Logo */}
          <Link to="/">
            <div className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg p-2 transition-all">
              <img
                src={'/logo_e_shop.png'}
                className="h-10 w-10 object-cover"
                alt="Logo"
              />
              <p className="font-bold text-white text-lg whitespace-nowrap">
                E Shop
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {/* Cart */}
            <div
              className="cursor-pointer"
              onClick={() => setIsOpenDrawerCart(true)}
            >
              <Badge color="error" badgeContent={length} max={99}>
                <CartIcon className="text-white" />
              </Badge>
            </div>

            {/* User Menu */}
            <UserMenuMobile user={user} cartLength={length} />
          </div>
        </div>

        {/* Category Drawer Mobile */}
        <CategoryDrawer
          categories={rootCategories}
          isOpen={isOpenDrawerCate}
          setIsOpen={setIsOpenDrawerCate}
          ref={drawerCateRef}
        />

        {/* Cart Drawer */}
        <CartDrawer
          ref={drawerCartRef}
          isOpen={isOpenDrawerCart}
          setIsOpen={setIsOpenDrawerCart}
        />
      </header>

      {/* ✅ Main content với padding-top để không bị header che */}
      <main className="layout-customer__main container mx-auto pt-32 md:pt-36 pb-20 md:pb-4">
        <Outlet />
      </main>

      {/* Bottom Navigation Mobile */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg md:hidden z-10">
        <div className="flex justify-around py-2">
          {menuBottom.map((page) => (
            <Link
              key={page.name}
              to={page.path}
              className="flex flex-col items-center justify-center px-3 py-1 hover:text-blue-500 transition-colors"
            >
              {page.icon}
              <p className="text-xs mt-1">{page.name}</p>
            </Link>
          ))}
        </div>
      </div>

      <footer className="layout-customer__footer bg-gray-200">
        <CustomerFooter />
      </footer>
    </div>
  );

}

export default CustomerLayout;
