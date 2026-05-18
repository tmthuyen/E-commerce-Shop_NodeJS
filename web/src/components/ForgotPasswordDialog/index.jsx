import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  Email,
  Close,
  Send,
  CheckCircle
} from '@mui/icons-material';
import axios from 'axios';

const ForgotPasswordDialog = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setError('');
    
    if (value && !validateEmail(value)) {
      setEmailError('Định dạng email không hợp lệ');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setEmailError('Email là bắt buộc');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Định dạng email không hợp lệ');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/forgot-password`,
        { email: email.trim() }
      );

      if (response.data.success) {
        setSuccess(true);
      } else {
        setError(response.data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage = error.response?.data?.message || 'Không thể gửi email khôi phục. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setLoading(false);
    setSuccess(false);
    setError('');
    setEmailError('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      {/* Header */}
      <DialogTitle 
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          textAlign: 'center',
          py: 3
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white'
          }}
        >
          <Close />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Email sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h5" fontWeight={700}>
            Quên mật khẩu
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        {!success ? (
          <Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
              Nhập địa chỉ email của bạn để nhận liên kết khôi phục mật khẩu
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Địa chỉ email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                error={!!emailError}
                helperText={emailError}
                placeholder="example@gmail.com"
                required
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <Email color={emailError ? 'error' : 'primary'} sx={{ mr: 1 }} />
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <Box sx={{ 
                p: 3, 
                bgcolor: '#e3f2fd', 
                borderRadius: 2, 
                border: '1px solid #bbdefb',
                mb: 3 
              }}>
                <Typography variant="body2" color="primary.main" fontWeight={600}>
                  📧 Hướng dẫn khôi phục:
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  • Kiểm tra email sau khi gửi yêu cầu<br/>
                  • Click vào liên kết trong email để xác nhận<br/>
                  • Mật khẩu mới sẽ được gửi về email của bạn<br/>
                  • Đăng nhập bằng mật khẩu mới và đổi mật khẩu ngay
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CheckCircle 
              sx={{ 
                fontSize: 64, 
                color: 'success.main',
                mb: 2 
              }} 
            />
            <Typography variant="h6" fontWeight={700} color="success.main" gutterBottom>
              Email đã được gửi!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Chúng tôi đã gửi email khôi phục mật khẩu đến:
            </Typography>
            <Typography variant="body1" fontWeight={600} color="primary.main" sx={{ mb: 3 }}>
              {email}
            </Typography>
            <Box sx={{ 
              p: 2, 
              bgcolor: '#fff3cd', 
              borderRadius: 2, 
              border: '1px solid #ffeaa7' 
            }}>
              <Typography variant="body2" color="warning.main">
                <strong>⚠️ Lưu ý:</strong> Kiểm tra cả hộp thư spam nếu không thấy email.
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      {!success && (
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={loading}
            sx={{ mr: 1 }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !!emailError || !email.trim()}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              }
            }}
          >
            {loading ? 'Đang gửi...' : 'Gửi email khôi phục'}
          </Button>
        </DialogActions>
      )}

      {success && (
        <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'center' }}>
          <Button
            onClick={handleClose}
            variant="contained"
            color="success"
            size="large"
          >
            Đóng
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ForgotPasswordDialog;