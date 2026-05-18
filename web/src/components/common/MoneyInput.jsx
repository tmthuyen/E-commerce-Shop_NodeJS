import { Input } from "antd"
import { useMemo,} from "react";

import { formatNumber, unFormatNumber } from "../../utils/numberFormat";

const MoneyInput = ({ value, onChange, placeholder, ...props }) => {
   // Tính giá trị hiển thị từ prop, không cần state riêng
  const displayValue = useMemo(() => {
    if (value !== undefined && value !== null) {
      const numericVal = unFormatNumber(value);
      return formatNumber(numericVal);
    }
    return "";
  }, [value]);
  
  const handleChange = (e) => {
    const val = e.target.value;

    // Chỉ giữ sô
    const numericVal = unFormatNumber(val);
 
    // Gọi onChange với giá trị số
    if (onChange) {
      onChange(numericVal === "" ? 0 : parseInt(numericVal, 10));
    }

    // 
  }

  return (<>
    <Input 
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder || "Nhập số tiền"}
      {...props}
    />
  </>)
}
export default MoneyInput;