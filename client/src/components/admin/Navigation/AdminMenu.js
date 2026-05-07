import {
  AppstoreOutlined,
  ContainerOutlined,
  CustomerServiceOutlined,
  LogoutOutlined,
  NotificationOutlined,
  OrderedListOutlined,
  PieChartOutlined,
  SettingOutlined,
  ShoppingOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

const items = [
  {
    key: '1',
    icon: <PieChartOutlined />,
    label: <Link to="/admin/home">Trang chủ</Link>,
  },
  {
    key: '2',
    icon: <AppstoreOutlined />,
    label: <Link to="/admin/categories">Danh mục</Link>,
    children: [
      {
        key: '2-1',
        label: <Link to="/admin/categories">Danh sách danh mục</Link>,
      },
      {
        key: '2-2',
        label: <Link to="/admin/categories/add">Thêm danh mục</Link>,
      },
    ],
  },
  {
    key: '3',
    icon: <TagsOutlined />,
    label: <Link to="/admin/brands">Thương hiệu</Link>,
    children: [
      {
        key: '3-1',
        label: <Link to="/admin/brands">Danh sách thương hiệu</Link>,
      },
      {
        key: '3-2',
        label: <Link to="/admin/brands/add">Thêm thương hiệu</Link>,
      },
    ],
  },
  {
    key: '4',
    icon: <ShoppingOutlined />,
    label: <Link to="/admin/products">Sản phẩm</Link>,
    children: [
      {
        key: '4-1',
        label: <Link to="/admin/products">Danh sách sản phẩm</Link>,
      },
      {
        key: '4-2',
        label: <Link to="/admin/products/add">Thêm sản phẩm</Link>,
      },
      // {
      //   key: '4-3',
      //   label: <Link to="/admin/products/edit">Sửa sản phẩm</Link>,
      // },
      // {
      //   key: '4-4',
      //   label: <Link to="/admin/products/:slug">Chi tiết sản phẩm</Link>,
      // },
    
    ],
  },
  {
    key: '5',
    icon: <OrderedListOutlined />,
    label: <Link to="/admin/orders">Đơn hàng</Link>,
  },
  {
    key: '6',
    icon: <CustomerServiceOutlined />,
    label: <Link to="/admin/customers">Khách hàng</Link>,
  },
  {
    key: '7',
    icon: <ContainerOutlined />,
    label: <Link to="/admin/promotions">Khuyến mãi</Link>,
  },
  // {
  //   key: '8',
  //   icon: <ContainerOutlined />,
  //   label: <Link to="/admin/reports">Báo cáo, phân tích</Link>,
  // },
  {
    key: '8',
    icon: <ContainerOutlined />,
    label: <Link to="/admin/reports">Báo cáo, phân tích</Link>,
  },
  // {
  //   key: '9',
  //   icon: <NotificationOutlined />,
  //   label: <Link to="/admin/notifications">Thông báo</Link>,
  // },
  // {
  //   key: '10',
  //   icon: <SettingOutlined />,
  //   label: <Link to="/admin/settings">Cài đặt</Link>,
  
  // }

  // {
  //   key: '11',
  //   icon: <LogoutOutlined />,
  //   label: <Link to="/logout">Đăng xuất</Link>,
  // },
];

// const flattenItemsToMap = (list, map = new Map()) => {
//     for (const it of list) {
//         if (it.path) map.set(it.key, it.path);
//         if (it.children) flattenItemsToMap(it.children, map);
//     }
//     return map;
// };

const AdminMenu = ({ collapsed, className }) => {
  // const navigate = useNavigate();
  // const location = useLocation();

  // const keyPathMap = useMemo(() => flattenItemsToMap(items), []);
  // const selectedKey = useMemo(() => {
  //     // chọn key khớp với URL hiện tại (ưu tiên path dài nhất)
  //     let match = null;
  //     for (const [k, p] of keyPathMap.entries()) {
  //         if (p === '/admin/products/:slug') continue; // không điều hướng literal
  //         if (
  //             location.pathname === p ||
  //             location.pathname.startsWith(p + '/')
  //         ) {
  //             if (!match || p.length > keyPathMap.get(match).length)
  //                 match = k;
  //         }
  //     }
  //     return match ? [match] : [];
  // }, [location.pathname, keyPathMap]);

  // const onSelect = ({ key }) => {
  //     const path = keyPathMap.get(key);
  //     if (!path) return;
  //     if (path.includes(':')) return; // chặn route động trong menu
  //     navigate(path);
  // };

  return (
    <div className="=">
      <Menu
        mode="inline"
        theme="light"
        defaultSelectedKeys={['1']}
        // onSelect={onSelect}
        // selectedKeys={selectedKey} // 🔥 controlled theo URL
        inlineCollapsed={collapsed}
        items={items}
        style={{ background: 'inherit'}}
        className={className}
      />


      {/* <ConfigProvider
                theme={{
                    token: {
                        itemHoverBg: '#FFEDD5',
                        itemHoverColor: '#FB923C',
                        itemSelectedBg: '#FEE2E2',
                        itemSelectedColor: '#DC2626',
                        darkItemHoverBg: '#374151',
                        darkItemHoverColor: '#F97316',
                        darkItemSelectedBg: '#1F2937',
                        darkItemSelectedColor: '#F97316',
                    },
                }}
            >
                
            </ConfigProvider> */}
    </div>
  );
};

export { items as adminMenuItems };
export default AdminMenu;