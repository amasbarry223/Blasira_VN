import { motion } from 'framer-motion';
import { Shield, Users, Bike, ArrowRight, Play, Star, CheckCircle, MapPin, Clock, UserCheck, Car, TrendingUp, Smartphone, Download } from 'lucide-react';
import SearchForm from '@/components/SearchForm';
import TripCard from '@/components/TripCard';
import Section from '@/components/layout/Section';
import SectionHeader from '@/components/layout/SectionHeader';
import heroImage from '@/assets/hero-blasira.jpg';
import { useQuery } from '@tanstack/react-query';
import { fetchTrips } from '@/lib/api';
import { popularRoutes } from '@/lib/pricing';
import { useState } from 'react';
import { Link } from 'react-router-dom';

// Location images
import imgBadalabougou from '@/assets/locations/badalabougou.jpg';
import imgUssgb from '@/assets/locations/universite-ussgb.jpg';
import imgAci from '@/assets/locations/aci-2000.jpg';
import imgKalaban from '@/assets/locations/kalaban-coro.jpg';
import imgHippodrome from '@/assets/locations/hippodrome.jpg';
import imgMagnambougou from '@/assets/locations/magnambougou.jpg';

const locationImages: Record<string, string> = {
  'badalabougou': imgBadalabougou,
  'universite-ussgb': imgUssgb,
  'aci-2000': imgAci,
  'kalaban-coro': imgKalaban,
  'hippodrome': imgHippodrome,
  'magnambougou': imgMagnambougou,
};

const features = [
  { icon: Shield, title: 'Étudiants vérifiés', desc: "Carte d'étudiant obligatoire", color: 'bg-green-500/10 text-green-600' },
  { icon: Users, title: 'Frais partagés', desc: 'Dès 300 FCFA/trajet', color: 'bg-blue-500/10 text-blue-600' },
  { icon: Bike, title: 'Moto & Voiture', desc: 'Choisissez votre mode', color: 'bg-orange-500/10 text-orange-600' },
];

const stats = [
  { value: '500+', label: 'Étudiants', icon: Users },
  { value: '200+', label: 'Trajets/mois', icon: TrendingUp },
  { value: '4.8', label: 'Note moyenne', icon: Star },
];

const steps = [
  { number: '1', icon: UserCheck, title: 'Inscrivez-vous', desc: 'Créez votre compte avec votre numéro de téléphone' },
  { number: '2', icon: MapPin, title: 'Trouvez un trajet', desc: 'Recherchez un trajet selon votre destination' },
  { number: '3', icon: Clock, title: 'Réservez', desc: 'Confirmez votre place en quelques clics' },
  { number: '4', icon: CheckCircle, title: 'Voyagez !', desc: 'Rejoignez votre conducteur et partagez les frais' },
];

const testimonials = [
  {
    name: 'Aminata Diallo',
    location: 'Étudiante, USSGB',
    avatar: 'https://ui-avatars.com/api/?name=Aminata+Diallo&background=16a34a&color=fff',
    text: "Blasira m'a permis d'économiser sur mes trajets quotidiens vers l'université. Je recommande à tous les étudiants !",
    rating: 5,
  },
  {
    name: 'Moussa Keita',
    location: 'Étudiant, ULSHB',
    avatar: 'https://ui-avatars.com/api/?name=Moussa+Keita&background=eab308&color=fff',
    text: "Très pratique pour aller à la fac depuis Badalabougou. Les conducteurs sont toujours ponctuels et sympathiques.",
    rating: 5,
  },
  {
    name: 'Fatoumata Sangaré',
    location: 'Étudiante, ENSup',
    avatar: 'https://ui-avatars.com/api/?name=Fatoumata+Sangare&background=16a34a&color=fff',
    text: "En tant que conductrice, je partage mes frais d'essence et je rencontre d'autres étudiants. Top !",
    rating: 5,
  },
  {
    name: 'Ibrahim Traoré',
    location: 'Étudiant, ACI-2000',
    avatar: 'https://ui-avatars.com/api/?name=Ibrahim+Traore&background=16a34a&color=fff',
    text: "L'application Blasira a révolutionné mes déplacements. Simple, rapide et économique !",
    rating: 5,
  },
  {
    name: 'Aissata Coulibaly',
    location: 'Étudiante, Kalaban-Coro',
    avatar: 'https://ui-avatars.com/api/?name=Aissata+Coulibaly&background=eab308&color=fff',
    text: "Je fais mes trajets quotidiens avec Blasira depuis 6 mois. C'est devenu indispensable !",
    rating: 5,
  },
  {
    name: 'Boubacar Diarra',
    location: 'Étudiant, Magnambougou',
    avatar: 'https://ui-avatars.com/api/?name=Boubacar+Diarra&background=16a34a&color=fff',
    text: "Excellent service ! Les trajets sont sécurisés et les prix très abordables pour les étudiants.",
    rating: 5,
  },
];

const Index = () => {
  const { data: trips = [] } = useQuery({
    queryKey: ['trips-popular'],
    queryFn: () => fetchTrips(),
  });
  const [showVideo, setShowVideo] = useState(false);

  const availableTrips = trips.slice(0, 6);

  return (
    <div className="pb-20 md:pb-0">
      {/* Hero Section */}
      <Section container={false} spacing="none" className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Étudiants maliens en covoiturage" 
            className="h-full w-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-foreground/60 to-background/90" />
        </div>
        <div className="relative container py-16 md:py-24 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="mb-4 text-4xl font-extrabold leading-tight text-card md:text-6xl lg:text-7xl">
              Déplacez-vous <span className="text-gradient-mali">ensemble</span>
            </h1>
            <p className="mb-8 text-base text-card/90 md:text-lg lg:text-xl">
              Covoiturage & moto-partage pour étudiants maliens 🇲🇱
            </p>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-6 md:gap-8"
            >
              {stats.map((s) => (
                <div key={s.label} className="flex items-center gap-2 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-card/20 backdrop-blur-sm">
                    <s.icon className="h-5 w-5 text-mali-gold" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-mali-gold md:text-3xl">{s.value}</div>
                    <div className="text-xs text-card/80 md:text-sm">{s.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </Section>

      {/* Search Form Section */}
      <Section spacing="sm" className="-mt-8 md:-mt-12 relative z-10">
        <div className="max-w-2xl lg:max-w-3xl mx-auto">
          <SearchForm />
        </div>
      </Section>

      {/* Features Section */}
      <Section spacing="md" id="features">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {features.map((f, i) => (
            <motion.div 
              key={f.title} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4 + i * 0.1 }}
              className="group flex flex-col items-center rounded-2xl bg-card p-6 text-center shadow-sm border border-border hover:shadow-md transition-all hover:border-primary/20"
            >
              <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${f.color} transition-transform group-hover:scale-110`}>
                <f.icon className="h-7 w-7" />
              </div>
              <h3 className="mb-2 text-base font-bold md:text-lg">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Popular Routes Section */}
      <Section spacing="lg" id="popular-routes" className="bg-muted/30">
        <div className="mb-8 flex items-center justify-between">
          <SectionHeader 
            title="🔥 Trajets populaires" 
            description="Les destinations les plus recherchées par nos étudiants"
            align="left"
            className="mb-0"
          />
          <Link 
            to="/search" 
            className="hidden md:flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voir tout <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popularRoutes.map((route, i) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/search?from=${encodeURIComponent(route.from)}&to=${encodeURIComponent(route.to)}`}
                className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-lg hover:border-primary/20"
              >
                <div className="relative h-40 md:h-48 overflow-hidden">
                  <img
                    src={locationImages[route.imageKey] || imgBadalabougou}
                    alt={`${route.from} vers ${route.to}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-base font-bold text-card md:text-lg">{route.from}</div>
                    <div className="flex items-center gap-2 text-sm text-card/90">
                      <ArrowRight className="h-4 w-4" /> 
                      <span>{route.to}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> 
                      {route.durationMin} min • {route.distanceKm} km
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">{route.totalPrice} F</span>
                    <span className="rounded-full bg-gradient-mali px-4 py-1.5 text-xs font-bold text-primary-foreground">
                      Réserver
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 text-center md:hidden">
          <Link 
            to="/search" 
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voir tout <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* Available Trips Section */}
      {availableTrips.length > 0 && (
        <Section spacing="lg" id="available-trips">
          <div className="mb-8 flex items-center justify-between">
            <SectionHeader 
              title="🚗 Trajets disponibles" 
              description="Découvrez les trajets publiés par notre communauté"
              align="left"
              className="mb-0"
            />
            <Link 
              to="/search" 
              className="hidden md:flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableTrips.map((trip, i) => (
              <TripCard key={trip.id} trip={trip} index={i} />
            ))}
          </div>
          <div className="mt-6 text-center md:hidden">
            <Link 
              to="/search" 
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Voir tout <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Section>
      )}

      {/* How It Works Section */}
      <Section spacing="lg" id="how-it-works" className="bg-muted/30">
        <SectionHeader 
          title="📋 Comment ça marche ?" 
          description="Quatre étapes simples pour commencer à voyager avec Blasira"
          badge="Simple & Rapide"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative flex flex-col items-center rounded-2xl bg-card p-6 text-center shadow-sm border border-border hover:shadow-md transition-all"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-mali text-lg font-bold text-primary-foreground shadow-md">
                {step.number}
              </div>
              <step.icon className="mb-3 h-6 w-6 text-primary" />
              <h3 className="mb-2 text-base font-bold md:text-lg">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Video Section */}
      <Section spacing="lg" id="video">
        <SectionHeader 
          title="🎬 Découvrez Blasira en vidéo" 
          description="Une présentation rapide de notre plateforme"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative mx-auto aspect-video max-w-4xl overflow-hidden rounded-2xl bg-foreground/5 border border-border shadow-lg"
        >
          {!showVideo ? (
            <button
              onClick={() => setShowVideo(true)}
              className="group flex h-full w-full flex-col items-center justify-center gap-4"
              aria-label="Lire la vidéo de présentation"
            >
              <img 
                src={heroImage} 
                alt="Aperçu vidéo Blasira" 
                className="absolute inset-0 h-full w-full object-cover opacity-60" 
              />
              <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-primary/90 shadow-mali transition-transform group-hover:scale-110">
                <Play className="h-10 w-10 text-primary-foreground ml-1" />
              </div>
              <span className="relative z-10 text-base font-semibold text-card md:text-lg">
                Voir la présentation
              </span>
            </button>
          ) : (
            <div className="flex h-full items-center justify-center bg-foreground/10 p-8 text-center">
              <p className="text-sm text-muted-foreground md:text-base">
                🎥 Vidéo bientôt disponible !<br />
                <span className="text-xs md:text-sm">
                  Une courte vidéo expliquant le fonctionnement de Blasira sera ajoutée ici.
                </span>
              </p>
            </div>
          )}
        </motion.div>
      </Section>

      {/* Testimonials Section */}
      <Section spacing="lg" id="testimonials" className="bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="text-center mb-12 relative">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ce que disent nos utilisateurs
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Découvrez les témoignages de nos utilisateurs satisfaits
          </p>
        </div>

        <div className="mt-8">
          <div className="relative overflow-hidden mask-edges">
            <ul className="flex gap-5 w-[max-content] animate-marquee" aria-label="Témoignages Blasira, défilement horizontal continu">
              {/* Dupliquer les témoignages pour l'effet infini */}
              {[...testimonials, ...testimonials].map((t, i) => (
                <li key={`${t.name}-${i}`}>
                  <div className="w-[360px] md:w-[580px] h-[260px] md:h-[269px] flex-shrink-0">
                    <div className="shadow-sm relative h-full rounded-[40px] border border-border bg-card hover:shadow-md transition-all">
                      <div className="p-6 h-full">
                        <div className="flex h-full">
                          <div className="flex-1 flex flex-col pr-4">
                            <p className="text-muted-foreground leading-relaxed line-clamp-4 md:line-clamp-none">
                              "{t.text}"
                            </p>
                            <div className="mt-auto flex items-center gap-3">
                              {Array.from({ length: 5 }).map((_, j) => (
                                <div key={j} className="inline-flex items-center rounded-full bg-primary/10 text-primary shadow-sm px-2 py-1">
                                  <span className="text-xs font-semibold text-mali-gold">★</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="w-28 md:w-40 flex flex-col items-center justify-center">
                            <div className="rounded-full size-24 md:size-36 border-2 border-primary/30 shadow-md overflow-hidden bg-primary/10">
                              <img 
                                alt={t.name} 
                                loading="lazy" 
                                width="144" 
                                height="144" 
                                className="w-full h-full object-cover" 
                                src={t.avatar}
                              />
                            </div>
                            <div className="mt-3 text-center">
                              <div className="text-foreground font-medium leading-tight">{t.name}</div>
                              <div className="text-muted-foreground text-xs md:text-sm">{t.location}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Mobile App Section */}
      <Section spacing="lg" id="mobile-app" className="bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left Column - App Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                <Smartphone className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold text-primary">Application Mobile</span>
              </div>
              <h2 className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                Téléchargez l'app <span className="text-gradient-mali">Blasira</span>
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed md:text-lg">
                Accédez à Blasira où que vous soyez. Réservez vos trajets, gérez vos voyages et restez connecté avec la communauté étudiante malienne.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              {[
                { icon: MapPin, text: 'Recherche de trajets en temps réel' },
                { icon: Clock, text: 'Notifications instantanées' },
                { icon: Shield, text: 'Profil vérifié et sécurisé' },
                { icon: Users, text: 'Chat avec les conducteurs' },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm text-foreground md:text-base">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Download Buttons */}
            <div className="space-y-4">
              <p className="text-sm font-medium text-foreground">Disponible sur :</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://play.google.com/store/apps/details?id=com.blasira"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-xl border-2 border-border bg-card p-4 shadow-sm transition-all hover:border-primary hover:shadow-md hover:scale-[1.02]"
                  aria-label="Télécharger sur Google Play Store"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#00D9FF] to-[#00A8CC] shadow-lg">
                    <svg className="h-9 w-9 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Disponible sur</div>
                    <div className="text-lg font-bold text-foreground">Google Play</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Télécharger maintenant</div>
                  </div>
                  <Download className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                </a>

                <a
                  href="https://apps.apple.com/app/blasira"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-xl border-2 border-border bg-card p-4 shadow-sm transition-all hover:border-primary hover:shadow-md hover:scale-[1.02]"
                  aria-label="Télécharger sur Apple App Store"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#000000] to-[#1a1a1a] shadow-lg">
                    <svg className="h-9 w-9 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Télécharger sur</div>
                    <div className="text-lg font-bold text-foreground">App Store</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Disponible sur iOS</div>
                  </div>
                  <Download className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Mobile Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-sm">
              {/* 
                Pour utiliser une vraie image de mockup :
                1. Ajoutez votre image dans src/assets/mobile-mockup.png
                2. Importez-la : import mobileMockup from '@/assets/mobile-mockup.png';
                3. Remplacez le contenu ci-dessous par : <img src={mobileMockup} alt="Blasira Mobile App" className="w-full h-auto" />
              */}
              {/* Phone Frame */}
              <div className="relative mx-auto aspect-[9/19] w-full max-w-[280px] rounded-[3rem] border-[14px] border-foreground/30 bg-foreground/20 p-1.5 shadow-2xl">
                <div className="h-full w-full overflow-hidden rounded-[2.5rem] bg-card shadow-inner">
                  {/* Status Bar */}
                  <div className="flex items-center justify-between bg-gradient-mali px-3 py-1.5">
                    <div className="flex items-center gap-0.5">
                      <div className="h-1 w-1 rounded-full bg-primary-foreground/90" />
                      <div className="h-1 w-1 rounded-full bg-primary-foreground/70" />
                      <div className="h-1 w-1 rounded-full bg-primary-foreground/50" />
                    </div>
                    <div className="text-[9px] font-bold text-primary-foreground">9:41</div>
                    <div className="flex items-center gap-0.5">
                      <div className="h-0.5 w-3 rounded-sm bg-primary-foreground/90" />
                      <div className="h-1.5 w-1.5 rounded-full border border-primary-foreground/90" />
                    </div>
                  </div>

                  {/* App Content Preview */}
                  <div className="flex h-[calc(100%-2.5rem)] flex-col bg-background p-3 overflow-y-auto">
                    {/* Header */}
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="h-7 w-7 rounded-lg bg-gradient-mali shadow-sm" />
                        <span className="text-xs font-bold text-foreground">Blasira</span>
                      </div>
                      <div className="h-1.5 w-6 rounded-full bg-muted-foreground/20" />
                    </div>

                    {/* Search Bar */}
                    <div className="mb-3 rounded-lg border border-border bg-card p-2 shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-primary" />
                        <div className="flex-1">
                          <div className="h-1.5 w-16 rounded bg-muted-foreground/30" />
                        </div>
                      </div>
                    </div>

                    {/* Trip Cards Preview */}
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-lg border border-border bg-card p-2.5 shadow-sm">
                          <div className="mb-1.5 flex items-center justify-between">
                            <div className="h-1.5 w-12 rounded bg-muted-foreground/30" />
                            <div className="h-1.5 w-10 rounded bg-primary/30" />
                          </div>
                          <div className="mb-1.5 h-1 w-full rounded bg-muted-foreground/20" />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <div className="h-5 w-5 rounded-full bg-muted-foreground/20" />
                              <div className="h-1 w-8 rounded bg-muted-foreground/20" />
                            </div>
                            <div className="h-1.5 w-10 rounded bg-primary/20" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
              <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-secondary/10 blur-2xl" />
            </div>
          </motion.div>
        </div>
      </Section>

      {/* CTA Security Section */}
      <Section spacing="lg" id="cta-security">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl bg-gradient-mali p-8 md:p-12 text-center shadow-mali">
            <Shield className="mx-auto mb-4 h-12 w-12 text-primary-foreground md:h-16 md:w-16" />
            <h3 className="mb-3 text-xl font-bold text-primary-foreground md:text-2xl">
              Communauté étudiante sécurisée
            </h3>
            <p className="mb-6 text-sm text-primary-foreground/90 md:text-base">
              Chaque membre est vérifié avec sa carte d'étudiant. Voyagez en toute confiance !
            </p>
            <Link 
              to="/auth" 
              className="inline-block rounded-lg bg-card px-6 py-3 text-sm font-bold text-primary shadow-lg transition-transform hover:scale-105 md:text-base"
            >
              Rejoindre Blasira
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Index;
