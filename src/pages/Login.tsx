import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Navigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';

const Login = () => {
  const { signIn, session } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirigir si ya está autenticado
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setLoading(true);
    const { error: signInError } = await signIn(email, password);
    setLoading(false);

    if (signInError) {
      setError('Credenciales incorrectas o ha ocurrido un error.');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-sans">
      {/* Panel de Marca - Oculto en móviles */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-800 via-purple-800 to-indigo-900 justify-center items-center p-12 relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>

         <div className="relative z-10 text-white text-center max-w-lg flex flex-col items-center">
           <div className="mb-8 p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl">
             <Sparkles className="w-12 h-12 text-indigo-200" />
           </div>
           <h1 className="text-4xl font-extrabold mb-6 tracking-tight">Zapphiro ERP</h1>
           <p className="text-lg text-indigo-100/90 leading-relaxed">
             Sistema avanzado de gestión para inventario, analítica de ventas y optimización de recursos.
           </p>
         </div>
      </div>

      {/* Panel de Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-8 left-8 lg:hidden flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-600" />
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Zapphiro
          </span>
        </div>

        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Bienvenido de nuevo</h2>
            <p className="text-slate-500 font-medium">Ingresa tus credenciales para acceder</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full shrink-0"></div>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 block w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-slate-900 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-none sm:text-sm"
                  placeholder="usuario@ejemplo.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 block w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-slate-900 shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all outline-none sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Ingresando...</span>
                  </>
                ) : (
                  'Ingresar al sistema'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;