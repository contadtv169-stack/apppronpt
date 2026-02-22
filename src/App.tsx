/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Layout, 
  Zap, 
  Shield, 
  CheckCircle2, 
  ChevronRight, 
  Copy, 
  Save, 
  History, 
  Star, 
  Trash2, 
  Search,
  LogOut,
  User,
  CreditCard,
  Menu,
  X,
  ArrowRight,
  Bot,
  Code,
  Rocket,
  MessageSquare,
  Quote,
  Image as ImageIcon,
  Users,
  Download,
  FileCode,
  Heart,
  Share2,
  Globe
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { supabase } from './lib/supabase';

// --- Types ---
type IAType = 'Lovable' | 'v0' | 'AI Studio';
type Category = 'App' | 'Landing Page' | 'Automação' | 'Chatbot' | 'SaaS';
type Level = 'Básico' | 'Intermediário' | 'Avançado' | 'Expert';
type Tab = 'prompts' | 'logos' | 'chat' | 'images' | 'code';

interface CommunityPost {
  id: number;
  user_id: number;
  author_name: string;
  title: string;
  content: string;
  type: 'prompt' | 'code';
  likes: number;
  created_at: string;
}

interface Prompt {
  id: number;
  title: string;
  content: string;
  ia_type: string;
  category: string;
  level: string;
  is_favorite: boolean;
  created_at: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  is_subscriber: boolean;
  is_trial_active?: boolean;
  trial_ends_at?: string;
}

// --- Components ---

const Navbar = ({ user, onLogout, onNavigate }: { user: UserData | null, onLogout: () => void, onNavigate: (page: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight leading-none">AppPrompt</span>
              <span className="text-[10px] text-blue-400 font-medium uppercase tracking-widest">GrupoWillames • 2026</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-blue-400 transition-colors">Dashboard</button>
                <button onClick={() => onNavigate('history')} className="hover:text-blue-400 transition-colors">Histórico</button>
                <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                  <button onClick={onLogout} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <button onClick={() => onNavigate('home')} className="hover:text-blue-400 transition-colors">Início</button>
                <button onClick={() => onNavigate('login')} className="hover:text-blue-400 transition-colors">Entrar</button>
                <button onClick={() => onNavigate('signup')} className="btn-primary py-2 px-4 text-sm">Criar Conta</button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {user ? (
                <>
                  <button onClick={() => { onNavigate('dashboard'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5">Dashboard</button>
                  <button onClick={() => { onNavigate('history'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5">Histórico</button>
                  <button onClick={() => { onLogout(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-red-400">Sair</button>
                </>
              ) : (
                <>
                  <button onClick={() => { onNavigate('home'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5">Início</button>
                  <button onClick={() => { onNavigate('login'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 rounded-lg hover:bg-white/5">Entrar</button>
                  <button onClick={() => { onNavigate('signup'); setIsOpen(false); }} className="block w-full text-center btn-primary py-2 mt-4">Criar Conta</button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const LandingPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-blue-500 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-purple-500 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold mb-8 uppercase tracking-wider">
                <Zap className="w-4 h-4" /> Teste Grátis por 24 Horas
              </span>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
                Domine a IA com <span className="gradient-text">Prompts de Elite</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto">
                A ferramenta definitiva para desenvolvedores e criadores. Gere prompts que extraem 100% do potencial do Lovable, v0 e AI Studio.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button onClick={() => onNavigate('signup')} className="btn-primary w-full sm:w-auto text-xl px-10 py-5 group">
                  Começar Teste Grátis <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="flex flex-col items-center sm:items-start">
                  <span className="text-2xl font-bold">R$ 19,90<span className="text-sm text-slate-500 font-normal">/mês</span></span>
                  <span className="text-xs text-emerald-400 font-medium">Acesso Vitalício ao Histórico</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Preview Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-24 relative"
          >
            <div className="glass rounded-3xl p-3 shadow-2xl shadow-blue-500/20 border-white/10">
              <div className="bg-slate-900 rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
                 <div className="text-center p-12">
                    <Bot className="w-24 h-24 text-blue-500 mx-auto mb-6 opacity-50" />
                    <h3 className="text-3xl font-bold mb-4">Interface Ultra-Moderna</h3>
                    <p className="text-slate-400 max-w-md mx-auto">Projetado para máxima produtividade em 2026. Simples, rápido e extremamente poderoso.</p>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-slate-900/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Recursos de <span className="gradient-text">Próxima Geração</span></h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Desenvolvido para quem não aceita nada menos que a perfeição em seus projetos de IA.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Bot className="w-10 h-10 text-blue-400" />, title: "Engenharia de Prompts Expert", desc: "Nossos algoritmos geram estruturas complexas que as IAs entendem perfeitamente, reduzindo erros em 95%." },
              { icon: <Zap className="w-10 h-10 text-purple-400" />, title: "Produtividade Instantânea", desc: "O que levava horas de 'tentativa e erro' agora é resolvido em 3 segundos com um clique." },
              { icon: <Shield className="w-10 h-10 text-emerald-400" />, title: "Segurança e Privacidade", desc: "Seus prompts e dados são protegidos com criptografia de ponta a ponta e armazenados com segurança." }
            ].map((item, i) => (
              <div key={i} className="glass p-10 rounded-[2rem] hover:border-blue-500/30 transition-all group">
                <div className="mb-8 p-4 bg-white/5 rounded-2xl w-fit group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Fluxo de Trabalho <span className="gradient-text">Simplificado</span></h2>
            <p className="text-slate-400 text-lg">Do conceito à realidade em tempo recorde.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-16 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2"></div>
            {[
              { step: "01", title: "Escolha seu Alvo", desc: "Selecione Lovable, v0 ou AI Studio. Cada um tem sua própria linguagem otimizada." },
              { step: "02", title: "Defina o Objetivo", desc: "Apps SaaS, Landing Pages ou Automações. Nossa IA entende o contexto de cada nicho." },
              { step: "03", title: "Extraia o Poder", desc: "Receba o prompt expert, copie e veja a mágica acontecer instantaneamente." }
            ].map((item, i) => (
              <div key={i} className="relative text-center z-10">
                <div className="w-20 h-20 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center mx-auto mb-8 text-3xl font-bold gradient-text shadow-xl">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-slate-400 text-lg leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">O que dizem os <span className="gradient-text">Especialistas</span></h2>
            <p className="text-slate-400 text-lg">Junte-se a milhares de usuários satisfeitos.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Ricardo Silva", role: "Dev Fullstack", text: "O AppPrompt mudou minha forma de trabalhar com o Lovable. Os prompts são cirúrgicos!", avatar: "https://picsum.photos/seed/user1/100/100" },
              { name: "Ana Oliveira", role: "UI/UX Designer", text: "A geração de logos e prompts para v0 economiza horas do meu dia. Indispensável.", avatar: "https://picsum.photos/seed/user2/100/100" },
              { name: "Marcos Souza", role: "Product Manager", text: "Interface limpa, rápida e os prompts realmente entregam o que prometem. 10/10.", avatar: "https://picsum.photos/seed/user3/100/100" }
            ].map((item, i) => (
              <div key={i} className="glass p-8 rounded-3xl border-white/5 relative">
                <div className="flex items-center gap-4 mb-6">
                  <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full border-2 border-blue-500/30" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="font-bold">{item.name}</h4>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">{item.role}</p>
                  </div>
                </div>
                <p className="text-slate-300 italic leading-relaxed">"{item.text}"</p>
                <div className="absolute top-6 right-8 opacity-10">
                  <Quote className="w-10 h-10 text-blue-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-16 text-center tracking-tight">Dúvidas Frequentes</h2>
          <div className="grid gap-6">
            {[
              { q: "Como funciona o teste grátis de 1 dia?", a: "Ao criar sua conta, você ganha 24 horas de acesso total a todas as ferramentas do AppPrompt sem custo algum. Após esse período, você precisará assinar o plano Pro para continuar usando." },
              { q: "O pagamento via Pix é seguro?", a: "Sim, utilizamos o PixGo, uma das plataformas mais seguras do Brasil. O QR Code é gerado na hora e a ativação é instantânea após o pagamento." },
              { q: "Posso usar os prompts comercialmente?", a: "Com certeza! Todos os prompts gerados são de sua propriedade e podem ser usados em projetos comerciais, freelances ou para uso pessoal." }
            ].map((item, i) => (
              <div key={i} className="glass p-8 rounded-2xl border-white/5 hover:border-white/10 transition-all">
                <h4 className="text-xl font-bold mb-3 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  {item.q}
                </h4>
                <p className="text-slate-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
                <Sparkles className="text-white w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight leading-none">AppPrompt</span>
                <span className="text-[10px] text-blue-400 font-medium uppercase tracking-widest">GrupoWillames • 2026</span>
              </div>
            </div>
            <div className="flex gap-10 text-sm font-medium text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Suporte 24h</a>
            </div>
            <div className="text-sm text-slate-500 font-medium">
              © 2026 AppPrompt - GrupoWillames. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const AuthPage = ({ type, onAuthSuccess, onNavigate }: { type: 'login' | 'signup', onAuthSuccess: (user: UserData) => void, onNavigate: (page: string) => void }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (type === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
            }
          }
        });

        if (signUpError) throw signUpError;
        if (data.user) {
          // Sync with local DB
          const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password })
          });
          const localData = await res.json();
          onAuthSuccess({ ...localData, is_subscriber: false, is_trial_active: true });
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (signInError) throw signInError;
        if (data.user) {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email, password: formData.password })
          });
          const localData = await res.json();
          onAuthSuccess(localData);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-8 rounded-2xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mx-auto mb-4">
            <Sparkles className="text-white w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold">{type === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}</h2>
          <p className="text-slate-400 mt-2">Comece a criar prompts profissionais hoje.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'signup' && (
            <div>
              <label className="block text-sm font-medium mb-1">Nome Completo</label>
              <input 
                type="text" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all"
                placeholder="Seu nome"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">E-mail</label>
            <input 
              type="email" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input 
              type="password" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-3 mt-2"
          >
            {loading ? 'Processando...' : (type === 'login' ? 'Entrar' : 'Cadastrar')}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-400">
          {type === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
          <button 
            onClick={() => onNavigate(type === 'login' ? 'signup' : 'login')}
            className="text-blue-400 ml-1 hover:underline"
          >
            {type === 'login' ? 'Cadastre-se' : 'Faça login'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

const CheckoutPage = ({ user, onPaymentSuccess }: { user: UserData, onPaymentSuccess: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const [status, setStatus] = useState<'pending' | 'completed' | 'expired'>('pending');
  const [cpf, setCpf] = useState('');

  const handlePay = async () => {
    if (!cpf) return alert('Por favor, informe seu CPF para emissão do comprovante.');
    setLoading(true);
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, name: user.name, email: user.email, cpf })
      });
      const data = await res.json();
      if (res.ok) {
        setPixData(data);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Erro ao gerar Pix. Tente novamente em instantes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval: any;
    if (pixData && status === 'pending') {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/payment/status/${pixData.payment_id}`);
          const data = await res.json();
          if (data.success && data.data.status === "completed") {
            setStatus('completed');
            clearInterval(interval);
            setTimeout(() => onPaymentSuccess(), 2000);
          }
        } catch (err) {
          console.error(err);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [pixData, status]);

  const copyToClipboard = () => {
    if (pixData?.qr_code) {
      navigator.clipboard.writeText(pixData.qr_code);
      alert('Código Pix copiado com sucesso!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 bg-slate-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 blur-[100px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-10 rounded-[2.5rem] w-full max-w-xl relative overflow-hidden border-white/10"
      >
        {!pixData ? (
          <div className="space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold mb-2">Checkout Seguro</h2>
                <p className="text-slate-400">Finalize sua assinatura premium</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            
            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Plano Pro Mensal</span>
                <span className="font-bold">R$ 19,90</span>
              </div>
              <div className="h-px bg-white/5 w-full"></div>
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold">Total</span>
                <span className="font-bold text-blue-400">R$ 19,90</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest">Informações de Pagamento</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-blue-500 transition-all font-medium"
                  placeholder="Digite seu CPF (apenas números)"
                  value={cpf}
                  onChange={e => setCpf(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-xs font-medium text-slate-300">Ativação Imediata</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-medium text-slate-300">Garantia Total</span>
              </div>
            </div>

            <button 
              onClick={handlePay}
              disabled={loading}
              className="btn-primary w-full py-5 text-xl shadow-2xl shadow-blue-600/30"
            >
              {loading ? 'Processando...' : 'Gerar QR Code Pix'}
            </button>
            
            <p className="text-center text-xs text-slate-500">
              Pagamento processado com segurança via PixGo. <br />
              Ao clicar em pagar, você concorda com nossos termos.
            </p>
          </div>
        ) : (
          <div className="space-y-8 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Quase lá!</h2>
              <p className="text-slate-400">Escaneie o código abaixo para ativar sua conta</p>
            </div>

            <div className="bg-white p-6 rounded-3xl inline-block mx-auto shadow-2xl">
              <img src={pixData.qr_image_url} alt="Pix QR Code" className="w-56 h-56" />
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={copyToClipboard}
                className="btn-secondary w-full py-4 text-lg border-white/10"
              >
                <Copy className="w-5 h-5" /> Copiar Código Pix Copia e Cola
              </button>
              
              <div className="flex items-center justify-center gap-3 p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></div>
                <span className="text-sm font-bold text-blue-400 uppercase tracking-widest">
                  {status === 'completed' ? 'Pagamento Confirmado!' : 'Aguardando Pagamento...'}
                </span>
              </div>
            </div>

            {status === 'completed' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400"
              >
                <p className="text-xl font-bold mb-1">Pagamento Confirmado!</p>
                <p className="text-sm opacity-80">Sua assinatura de R$ 19,90 foi ativada. Muito obrigado pela compra!</p>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

const Dashboard = ({ user, onNavigate }: { user: UserData, onNavigate: (page: string) => void }) => {
  const [activeTab, setActiveTab] = useState<Tab>('prompts');
  const [iaType, setIaType] = useState<IAType>('Lovable');
  const [category, setCategory] = useState<Category>('App');
  const [level, setLevel] = useState<Level>('Básico');
  const [appDescription, setAppDescription] = useState('');
  const [appObjective, setAppObjective] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(false);

  // Logo Generator State
  const [logoPrompt, setLogoPrompt] = useState('');
  const [generatedLogo, setGeneratedLogo] = useState('');
  const [logoLoading, setLogoLoading] = useState(false);

  // Chatbot State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const generatePrompt = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const model = ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `Gere um prompt avançado e profissional para a ferramenta de IA ${iaType}. 
        Contexto do App: ${appDescription || 'Criação de um sistema moderno'}
        Objetivo da IA: ${appObjective || 'Desenvolver as funcionalidades principais com alta performance'}
        A categoria é ${category} e o nível de complexidade deve ser ${level}.
        O prompt deve ser detalhado, estruturado e pronto para uso imediato para obter os melhores resultados possíveis na ferramenta ${iaType}.
        Responda apenas com o prompt formatado.`
      });
      const response = await model;
      setGeneratedPrompt(response.text || "");
    } catch (err) {
      alert("Erro ao gerar prompt. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const generateLogo = async () => {
    if (!logoPrompt) return;
    setLogoLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { text: `Crie uma logo marca profissional e moderna para: ${logoPrompt}. Estilo minimalista, vetorizado, alta qualidade.` },
          ],
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setGeneratedLogo(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (err) {
      alert("Erro ao gerar logo.");
    } finally {
      setLogoLoading(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput) return;
    const newMessages = [...chatMessages, { role: 'user' as const, text: chatInput }];
    setChatMessages(newMessages);
    setChatInput('');
    setChatLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: chatInput,
        config: {
          systemInstruction: "Você é um especialista em engenharia de prompts e design de software. Ajude o usuário a criar os melhores prompts e logos."
        }
      });
      setChatMessages([...newMessages, { role: 'bot', text: response.text || "Desculpe, não consegui processar sua mensagem." }]);
    } catch (err) {
      setChatMessages([...newMessages, { role: 'bot', text: "Erro ao conectar com a IA." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleSave = async () => {
    if (!generatedPrompt) return;
    try {
      const res = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          title: `Prompt ${iaType} - ${category}`,
          content: generatedPrompt,
          iaType,
          category,
          level
        })
      });
      if (res.ok) {
        setSaveFeedback(true);
        setTimeout(() => setSaveFeedback(false), 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Trial Banner */}
      {user.is_trial_active && !user.is_subscriber && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="font-bold text-blue-100">Você está no Período de Teste Grátis</p>
              <p className="text-xs text-slate-400">Seu acesso expira em breve. Assine agora para não perder seu histórico.</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('checkout')}
            className="btn-primary py-2 px-6 text-sm whitespace-nowrap"
          >
            Assinar Plano Pro - R$ 19,90
          </button>
        </motion.div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        <button 
          onClick={() => setActiveTab('prompts')}
          className={`px-6 py-2 rounded-xl font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'prompts' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
        >
          <Zap className="w-4 h-4" /> Gerador de Prompts
        </button>
        <button 
          onClick={() => setActiveTab('logos')}
          className={`px-6 py-2 rounded-xl font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'logos' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
        >
          <Layout className="w-4 h-4" /> Gerador de Logo
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          className={`px-6 py-2 rounded-xl font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'chat' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
        >
          <MessageSquare className="w-4 h-4" /> Chat Especialista
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'prompts' && (
          <motion.div 
            key="prompts"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            {/* Controls */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-400" /> Configurações
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-3">Ferramenta de IA</label>
                    <div className="grid grid-cols-1 gap-2">
                      {(['Lovable', 'v0', 'AI Studio'] as IAType[]).map(type => (
                        <button
                          key={type}
                          onClick={() => setIaType(type)}
                          className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border ${
                            iaType === type 
                            ? 'bg-blue-500/20 border-blue-500 text-blue-400' 
                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-3">Categoria</label>
                    <select 
                      value={category}
                      onChange={e => setCategory(e.target.value as Category)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all"
                    >
                      {['App', 'Landing Page', 'Automação', 'Chatbot', 'SaaS'].map(cat => (
                        <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-3">Nível de Complexidade</label>
                    <div className="flex flex-wrap gap-2">
                      {(['Básico', 'Intermediário', 'Avançado', 'Expert'] as Level[]).map(lvl => (
                        <button
                          key={lvl}
                          onClick={() => setLevel(lvl)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                            level === lvl 
                            ? 'bg-purple-500/20 border-purple-500 text-purple-400' 
                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-3">O que é o seu App?</label>
                    <textarea 
                      value={appDescription}
                      onChange={e => setAppDescription(e.target.value)}
                      placeholder="Ex: Um SaaS de gestão financeira para freelancers..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all text-sm h-24 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-3">O que a IA deve fazer?</label>
                    <textarea 
                      value={appObjective}
                      onChange={e => setAppObjective(e.target.value)}
                      placeholder="Ex: Criar a tela de dashboard com gráficos e filtros..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all text-sm h-24 resize-none"
                    />
                  </div>

                  <button 
                    onClick={generatePrompt}
                    disabled={loading}
                    className="btn-primary w-full py-4 mt-4"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Gerando...
                      </div>
                    ) : (
                      <>Gerar Prompt Avançado <Sparkles className="w-5 h-5" /></>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Output */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass rounded-2xl flex flex-col h-full min-h-[500px]">
                <div className="p-4 border-b border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-sm font-medium text-slate-400">Resultado do Prompt</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleCopy}
                      disabled={!generatedPrompt}
                      className={`p-2 rounded-lg transition-all flex items-center gap-2 text-sm ${
                        copyFeedback ? 'bg-emerald-500/20 text-emerald-400' : 'hover:bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {copyFeedback ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copyFeedback ? 'Copiado!' : 'Copiar'}
                    </button>
                    <button 
                      onClick={handleSave}
                      disabled={!generatedPrompt}
                      className={`p-2 rounded-lg transition-all flex items-center gap-2 text-sm ${
                        saveFeedback ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {saveFeedback ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                      {saveFeedback ? 'Salvo!' : 'Salvar'}
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 p-6">
                  {generatedPrompt ? (
                    <textarea
                      value={generatedPrompt}
                      onChange={e => setGeneratedPrompt(e.target.value)}
                      className="w-full h-full bg-transparent resize-none focus:outline-none text-slate-300 leading-relaxed font-mono text-sm"
                    />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                      <Bot className="w-12 h-12 opacity-20" />
                      <p>Configure as opções ao lado e clique em gerar para ver a mágica.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'logos' && (
          <motion.div 
            key="logos"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid lg:grid-cols-2 gap-8"
          >
            <div className="glass p-8 rounded-2xl space-y-6">
              <h3 className="text-2xl font-bold">Gerador de Logo Profissional</h3>
              <p className="text-slate-400">Descreva sua marca e deixe a IA criar uma logo única para você.</p>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Descrição da Marca</label>
                <textarea 
                  value={logoPrompt}
                  onChange={e => setLogoPrompt(e.target.value)}
                  placeholder="Ex: Uma startup de tecnologia chamada 'NexGen' que foca em energia limpa. Use tons de azul e verde."
                  className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-all resize-none"
                />
              </div>

              <button 
                onClick={generateLogo}
                disabled={logoLoading}
                className="btn-primary w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600"
              >
                {logoLoading ? 'Criando sua Logo...' : 'Gerar Logo Profissional'}
              </button>
            </div>

            <div className="glass rounded-2xl flex items-center justify-center p-8 min-h-[400px]">
              {generatedLogo ? (
                <div className="text-center space-y-6">
                  <img src={generatedLogo} alt="Generated Logo" className="max-w-full h-auto rounded-xl shadow-2xl" />
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = generatedLogo;
                      link.download = 'logo-appprompt.png';
                      link.click();
                    }}
                    className="btn-secondary"
                  >
                    Baixar Logo
                  </button>
                </div>
              ) : (
                <div className="text-center text-slate-500 space-y-4">
                  <Layout className="w-16 h-16 mx-auto opacity-10" />
                  <p>Sua logo aparecerá aqui.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'chat' && (
          <motion.div 
            key="chat"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass rounded-2xl flex flex-col h-[600px]"
          >
            <div className="p-4 border-b border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold">Chat Especialista</h3>
                <p className="text-xs text-slate-400">Tire dúvidas sobre prompts e design.</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatMessages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                  <MessageSquare className="w-12 h-12 opacity-10" />
                  <p>Como posso te ajudar hoje?</p>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-300'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-2xl flex gap-2">
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/5">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-all"
                />
                <button 
                  onClick={sendChatMessage}
                  disabled={chatLoading || !chatInput}
                  className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition-all disabled:opacity-50"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HistoryPage = ({ user }: { user: UserData }) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copyId, setCopyId] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  const fetchPrompts = async () => {
    try {
      const res = await fetch(`/api/prompts/${user.id}`);
      const data = await res.json();
      setPrompts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir este prompt?')) return;
    try {
      await fetch(`/api/prompts/${id}`, { method: 'DELETE' });
      setPrompts(prompts.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFavorite = async (id: number, current: boolean) => {
    try {
      await fetch(`/api/prompts/${id}/favorite`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !current })
      });
      setPrompts(prompts.map(p => p.id === id ? { ...p, is_favorite: !current } : p));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPrompts = prompts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                         p.content.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || p.is_favorite;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-bold tracking-tight mb-2">Seu <span className="gradient-text">Histórico</span></h2>
          <p className="text-slate-400">Gerencie e organize seus prompts de elite.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setFilter('favorites')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${filter === 'favorites' ? 'bg-yellow-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Star className="w-3.5 h-3.5" /> Favoritos
            </button>
          </div>
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Buscar prompts..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredPrompts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map(prompt => (
            <motion.div 
              layout
              key={prompt.id}
              className="glass p-6 rounded-2xl flex flex-col group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                    {prompt.ia_type}
                  </span>
                  <span className="px-2 py-1 rounded-md bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-wider">
                    {prompt.category}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => toggleFavorite(prompt.id, prompt.is_favorite)}
                    className={`p-1.5 rounded-lg transition-all ${prompt.is_favorite ? 'text-yellow-400' : 'text-slate-500 hover:text-white'}`}
                  >
                    <Star className={`w-4 h-4 ${prompt.is_favorite ? 'fill-current' : ''}`} />
                  </button>
                  <button 
                    onClick={() => handleDelete(prompt.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold mb-3 line-clamp-1">{prompt.title}</h3>
              <p className="text-slate-400 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                {prompt.content}
              </p>
              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <span className="text-[10px] text-slate-500">
                  {new Date(prompt.created_at).toLocaleDateString()}
                </span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(prompt.content);
                    setCopyId(prompt.id);
                    setTimeout(() => setCopyId(null), 2000);
                  }}
                  className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> {copyId === prompt.id ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass rounded-2xl">
          <History className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500">Nenhum prompt encontrado.</p>
        </div>
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('appprompt_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      // Verify status with server
      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: parsedUser.email, password: parsedUser.password })
      })
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          setUser(data);
          localStorage.setItem('appprompt_user', JSON.stringify(data));
          if (!data.is_subscriber && !data.is_trial_active) {
            setPage('checkout');
          }
        }
      })
      .catch(err => console.error('Error verifying user:', err));
    }
  }, []);

  const handleAuthSuccess = (userData: UserData) => {
    setUser(userData);
    localStorage.setItem('appprompt_user', JSON.stringify(userData));
    setPage(userData.is_subscriber || userData.is_trial_active ? 'dashboard' : 'checkout');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('appprompt_user');
    setPage('home');
  };

  const handlePaymentSuccess = () => {
    if (user) {
      const updatedUser = { ...user, is_subscriber: true };
      setUser(updatedUser);
      localStorage.setItem('appprompt_user', JSON.stringify(updatedUser));
      setPage('dashboard');
    }
  };

  const renderPage = () => {
    switch (page) {
      case 'home': return <LandingPage onNavigate={setPage} />;
      case 'login': return <AuthPage type="login" onAuthSuccess={handleAuthSuccess} onNavigate={setPage} />;
      case 'signup': return <AuthPage type="signup" onAuthSuccess={handleAuthSuccess} onNavigate={setPage} />;
      case 'checkout': return user ? <CheckoutPage user={user} onPaymentSuccess={handlePaymentSuccess} /> : <LandingPage onNavigate={setPage} />;
      case 'dashboard': return (user?.is_subscriber || user?.is_trial_active) ? <Dashboard user={user} onNavigate={setPage} /> : <CheckoutPage user={user!} onPaymentSuccess={handlePaymentSuccess} />;
      case 'history': return (user?.is_subscriber || user?.is_trial_active) ? <HistoryPage user={user} /> : <CheckoutPage user={user!} onPaymentSuccess={handlePaymentSuccess} />;
      default: return <LandingPage onNavigate={setPage} />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar user={user} onLogout={handleLogout} onNavigate={setPage} />
      <AnimatePresence mode="wait">
        <motion.main
          key={page}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderPage()}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
