import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, Brain, Search, TrendingUp, BookOpen, Award, 
  Users, CheckCircle, ArrowRight, Zap, Globe, Shield
} from 'lucide-react';

const TRACKS = [
  { name: 'Software Development', icon: '💻' },
  { name: 'Data Science',         icon: '🧠' },
  { name: 'Data Analysis',        icon: '📊' },
  { name: 'Cybersecurity',        icon: '🔒' },
  { name: 'UI/UX Design',         icon: '🎨' },
  { name: 'Cloud Computing',      icon: '☁️' },
  { name: 'AI/ML',                icon: '🤖' },
  { name: 'DevOps',               icon: '⚙️' },
  { name: 'Product Management',   icon: '📋' },
  { name: 'Game Development',     icon: '🎮' },
  { name: 'Quality Assurance',    icon: '🔍' },
  { name: 'Animation',            icon: '🎬' },
];

const FEATURES = [
  {
    icon: <Bot className="h-6 w-6 text-green-600" />,
    title: 'Compass AI Assistant',
    desc:  'Get real-time guidance, concept explanations, and personalised study advice powered by Groq Llama 3.3.',
  },
  {
    icon: <Brain className="h-6 w-6 text-purple-600" />,
    title: 'AI Learning Insights',
    desc:  'Intelligent analysis of your progress — strengths, gaps, milestones, and a dynamic progress score.',
  },
  {
    icon: <Search className="h-6 w-6 text-blue-600" />,
    title: 'Semantic Search',
    desc:  'Search your track content using natural language. Find exactly what you need, instantly.',
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-orange-500" />,
    title: 'Smart Recommendations',
    desc:  'AI-curated next steps based on your completed modules, skill level, and learning pace.',
  },
  {
    icon: <BookOpen className="h-6 w-6 text-teal-600" />,
    title: 'Adaptive Learning Path',
    desc:  'Your path evolves as you grow. Beginner, standard, or accelerated — Compass AI decides.',
  },
  {
    icon: <Award className="h-6 w-6 text-yellow-500" />,
    title: 'Achievement System',
    desc:  'Earn badges, track milestones, and share your 3MTT progress with the community.',
  },
];

const STATS = [
  { value: '12',  label: 'Learning Tracks', icon: <BookOpen className="h-5 w-5" /> },
  { value: '50+', label: 'Learning Modules', icon: <Zap className="h-5 w-5" /> },
  { value: 'AI',  label: 'Powered by Groq',  icon: <Bot className="h-5 w-5" /> },
  { value: '🇳🇬',  label: 'Made for Nigeria', icon: <Globe className="h-5 w-5" /> },
];

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">3MTT Compass AI</span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate('/login')} className="text-sm">
              Sign In
            </Button>
            <Button onClick={() => navigate('/register')}
              className="bg-green-600 hover:bg-green-700 text-sm rounded-full px-5">
              Get Started Free
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-green-50 text-green-700 border-green-200 mb-6 text-xs px-3 py-1">
            🇳🇬 Built for 3MTT Nigeria Fellows
          </Badge>
          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6 text-gray-900">
            Your AI-Powered{' '}
            <span className="text-green-600">Learning Compass</span>
            {' '}for 3MTT
          </h1>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Compass AI creates a personalised learning path for your 3MTT track, answers your questions in real time,
            and adapts as you grow — powered by Groq Llama 3.3.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/register')}
              className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 py-6 text-base font-bold gap-2 shadow-lg shadow-green-600/25">
              Start Your Journey <ArrowRight className="h-5 w-5" />
            </Button>
            <Button variant="outline" onClick={() => navigate('/login')}
              className="rounded-full px-8 py-6 text-base border-gray-200 text-gray-700">
              Sign In to Dashboard
            </Button>
          </div>
          <p className="mt-4 text-gray-400 text-sm">Free to use · No credit card required</p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-black text-green-600 mb-1">{s.value}</p>
              <p className="text-gray-500 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Everything you need to <span className="text-green-600">thrive in 3MTT</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Real AI. Real guidance. Built specifically for Nigeria's 3MTT program.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border border-gray-100 bg-white hover:border-green-200 hover:shadow-md transition-all">
                <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center mb-4">{f.icon}</div>
                <h3 className="font-bold text-base mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tracks ── */}
      <section className="py-20 bg-gray-50 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">12 Specialised Tracks</h2>
            <p className="text-gray-500">Pick your path — Compass AI does the rest.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {TRACKS.map(t => (
              <div key={t.name} className="bg-white border border-gray-100 rounded-xl p-4 text-center hover:border-green-200 hover:shadow-sm transition-all">
                <div className="text-2xl mb-2">{t.icon}</div>
                <p className="text-sm font-medium text-gray-700 leading-tight">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-green-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Ready to accelerate your 3MTT journey?
          </h2>
          <p className="text-green-100 mb-8 text-lg">
            Join thousands of Nigerian tech talents using AI to learn smarter.
          </p>
          <Button onClick={() => navigate('/register')}
            className="bg-white text-green-700 hover:bg-green-50 rounded-full px-10 py-6 text-base font-bold gap-2">
            Create Free Account <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-green-600 flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-sm text-gray-700">3MTT Compass AI</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Shield className="h-3 w-3" />
            Built with ♥ for Nigerian 3MTT Fellows · Powered by Groq
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
