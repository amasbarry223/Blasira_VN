import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Heart, Shield, Users, HelpCircle, FileText } from 'lucide-react';
import logo from '@/assets/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Chercher un trajet', path: '/search' },
    { label: 'Publier un trajet', path: '/publish' },
    { label: 'Mes trajets', path: '/my-trips' },
    { label: 'Mon profil', path: '/profile' },
  ];

  const aboutLinks = [
    { label: 'Comment ça marche', path: '/#how-it-works' },
    { label: 'À propos', path: '/#about' },
    { label: 'Sécurité', path: '/#security' },
    { label: 'FAQ', path: '/#faq' },
  ];

  const legalLinks = [
    { label: 'Conditions d\'utilisation', path: '/legal/terms' },
    { label: 'Politique de confidentialité', path: '/legal/privacy' },
    { label: 'Mentions légales', path: '/legal/mentions' },
  ];

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: 'https://facebook.com/blasira', color: 'hover:text-blue-600' },
    { icon: Twitter, label: 'Twitter', href: 'https://twitter.com/blasira', color: 'hover:text-sky-500' },
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/blasira', color: 'hover:text-pink-600' },
  ];

  return (
    <footer className="relative mt-20 border-t border-border bg-card">
      {/* Wave separator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-mali" />
      
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Blasira" className="h-10 w-10 object-contain" />
              <span className="text-xl font-bold text-gradient-mali">Blasira</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Plateforme de covoiturage et moto-partage pour étudiants maliens. 
              Déplacez-vous ensemble, économisez ensemble.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-4 w-4 text-primary" />
              <span>Communauté étudiante vérifiée</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-foreground">Navigation rapide</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <span className="h-1 w-1 rounded-full bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About & Support */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-foreground">À propos & Support</h3>
            <ul className="space-y-2.5">
              {aboutLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <span className="h-1 w-1 rounded-full bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2">
              <a
                href="mailto:contact@blasira.ml"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4" />
                contact@blasira.ml
              </a>
              <a
                href="tel:+223XXXXXXXX"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4" />
                +223 XX XX XX XX
              </a>
            </div>
          </div>

          {/* Legal & Social */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-foreground">Légal & Réseaux</h3>
            <ul className="space-y-2.5 mb-6">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="space-y-3">
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Suivez-nous</p>
                <div className="flex items-center gap-3">
                  {socialLinks.map(({ icon: Icon, label, href, color }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-all hover:border-primary hover:bg-primary/5 ${color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>Bamako, Mali 🇲🇱</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <span>© {currentYear} Blasira. Tous droits réservés.</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1">
                Fait avec <Heart className="h-3 w-3 fill-mali-red text-mali-red" /> au Mali
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-primary" />
                Communauté étudiante
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

