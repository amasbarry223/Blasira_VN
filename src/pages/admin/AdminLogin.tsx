import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import logo from '@/assets/logo.png';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { signIn, isAdmin, loading } = useAdminAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAdmin && !loading) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdmin, loading, navigate]);

  const isPhoneValid = /^\d{8}$/.test(phone.replace(/\s/g, ''));
  const isPasswordValid = password.length >= 6;
  const isFormValid = isPhoneValid && isPasswordValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setError(null);
    setIsSubmitting(true);

    const { error: signInError } = await signIn(phone, password);
    
    if (signInError) {
      setError(signInError.message || 'Numéro ou mot de passe incorrect');
    } else {
      navigate('/admin/dashboard', { replace: true });
    }
    
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border bg-card p-8 shadow-lg">
          {/* Logo & header */}
          <div className="mb-8 text-center">
            <motion.img
              src={logo}
              alt="Blasira Admin"
              className="mx-auto mb-4 h-16 w-16 object-contain"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            />
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-extrabold">Administration Blasira</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Connectez-vous pour accéder au tableau de bord
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone Input */}
            <div className="space-y-2">
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="XX XX XX XX"
                  value={phone}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 8);
                    setPhone(cleaned);
                    setError(null);
                  }}
                  className="pl-9"
                  required
                />
              </div>
              {phone && !isPhoneValid && (
                <p className="text-xs text-destructive">Le numéro doit contenir 8 chiffres</p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  className="pl-9 pr-9"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password && !isPasswordValid && (
                <p className="text-xs text-destructive">Le mot de passe doit contenir au moins 6 caractères</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Connexion...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Se connecter
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Accès réservé aux administrateurs uniquement
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;

