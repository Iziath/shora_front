import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import {
  ShieldCheck,
  BellDot,
  ClipboardList,
  MessageSquare,
  Menu,
  X,
  Send,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import heroWorker from "../../assets/image/shora1.jpg";
import helmetsImage from "../../assets/image/shora2.jpg";
import logo from "../../assets/image/logo_shora.png";

const navLinks = [
  { href: "#hero", label: "Accueil" },
  { href: "#mission", label: "À propos" },
  { href: "#features", label: "Fonctionnalités" },
  { href: "#process", label: "Comment ça marche ?" },
  { href: "#contact", label: "Contact" },
];

const SectionTitle = ({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) => (
  <motion.div
    className="max-w-2xl"
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.4 }}
    transition={{ duration: 0.7, ease: "easeOut" }}
  >
    <span className="text-sm uppercase tracking-[0.3em] text-steel/80">
      {eyebrow}
    </span>
    <h2 className="mt-4 font-display text-3xl md:text-4xl text-snow leading-tight">
      {title}
    </h2>
    <p className="mt-4 text-lg md:text-xl text-sand/80">
      {description}
    </p>
  </motion.div>
);

const featureVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

const Features = () => {
  const features = useMemo(
    () => [
      {
        icon: ShieldCheck,
        title: "Alerte sans délai",
        description:
          "Notification automatique aux équipes HSE en cas d'anomalie critique détectée sur le terrain.",
      },
      {
        icon: BellDot,
        title: "Prévention renforcée",
        description:
          "Analyse prédictive des risques via les échanges WhatsApp et le dashboard HSE intégré.",
      },
      {
        icon: ClipboardList,
        title: "Reporting simplifié",
        description:
          "Rapports HSE générés et partagés en un clic pour documenter chaque incident ou action corrective.",
      },
      {
        icon: MessageSquare,
        title: "Dialogue humain + IA",
        description:
          "Assistant multilingue disponible 24/7 pour accompagner les responsables sécurité sur site.",
      },
    ],
    []
  );

  return (
    <div className="mt-16 grid gap-8 lg:grid-cols-4">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          className="group relative rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_32px_80px_-40px_rgba(0,0,0,0.65)] backdrop-blur-sm"
          variants={featureVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.08 }}
          whileHover={{ y: -8 }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-safety/20 text-safety transition-colors duration-500 group-hover:bg-safety group-hover:text-petrol">
            <feature.icon className="h-7 w-7" />
          </div>
          <h3 className="mt-6 font-display text-2xl text-snow">
            {feature.title}
          </h3>
          <p className="mt-3 text-base text-sand/80 leading-relaxed">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

const steps = [
  {
    title: "Détection proactive",
    description:
      "SHORA BOT analyse les échanges WhatsApp, les photos et la localisation pour repérer tout risque potentiel.",
    badge: "IA terrain + dashboard",
  },
  {
    title: "Alerte contextualisée",
    description:
      "Les agents HSE reçoivent une alerte priorisée avec toutes les données utiles pour décider rapidement.",
    badge: "Flux sécurisé",
  },
  {
    title: "Action suivie",
    description:
      "Le responsable valide la mesure corrective depuis la plateforme et clôture l'incident avec preuve.",
    badge: "Traçabilité complète",
  },
];

function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler l'envoi (vous pouvez ajouter une vraie API ici)
    setTimeout(() => {
      // Ouvrir le client email avec les données pré-remplies
      const mailtoLink = `mailto:contact@shorabot.com?subject=${encodeURIComponent(contactForm.subject)}&body=${encodeURIComponent(`Nom: ${contactForm.name}\nEmail: ${contactForm.email}\n\nMessage:\n${contactForm.message}`)}`;
      window.location.href = mailtoLink;
      
      // Réinitialiser le formulaire
      setContactForm({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-petrol text-sand overflow-hidden">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(245,233,214,0.12),transparent_60%)]" />
      <div className="pointer-events-none fixed inset-y-0 right-[-40%] w-[70%] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(246,139,31,0.15),rgba(15,61,76,0.1))] blur-3xl" />

      <header className="relative z-20">
        <motion.nav
          className="container flex items-center justify-between py-7"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <a href="#hero" className="flex items-center" aria-label="Retour à l'accueil">
            <motion.div
              className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm"
              animate={{
                boxShadow: [
                  "0 0 0 rgba(246,139,31,0.0)",
                  "0 0 28px rgba(246,139,31,0.35)",
                  "0 0 0 rgba(246,139,31,0.0)",
                ],
              }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src={logo}
                alt="SHORA BOT Logo"
                className="h-16 w-auto"
              />
            </motion.div>
          </a>

          <div className="hidden items-center gap-8 text-sm font-medium text-sand/70 md:flex">
            {navLinks.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-snow">
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex">
            <motion.button
              onClick={() => navigate("/auth")}
              className="inline-flex items-center gap-2 rounded-full border border-safety/40 bg-safety px-6 py-2.5 font-medium text-petrol shadow-[0_18px_40px_-18px_rgba(246,139,31,0.9)] transition hover:bg-[#ffa248] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-safety"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Connexion HSE
            </motion.button>
          </div>

          <motion.button
            type="button"
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-snow"
            onClick={() => setMenuOpen(true)}
            whileTap={{ scale: 0.95 }}
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-6 w-6" />
          </motion.button>
        </motion.nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="fixed inset-0 z-30 bg-petrol/95 backdrop-blur"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="container flex h-full flex-col justify-between py-10"
                initial={{ y: -16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-xl text-snow">Menu</span>
                  <motion.button
                    type="button"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-snow"
                    onClick={() => setMenuOpen(false)}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Fermer le menu"
                  >
                    <X className="h-6 w-6" />
                  </motion.button>
                </div>

                <div className="mt-12 flex flex-col gap-6 text-2xl text-sand/80">
                  {navLinks.map((item) => (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      className="rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-snow"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </motion.a>
                  ))}
                </div>

                <motion.button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/auth");
                  }}
                  className="mt-12 inline-flex items-center justify-center rounded-full bg-safety px-8 py-3 font-display text-lg text-petrol shadow-[0_20px_50px_-20px_rgba(246,139,31,0.9)]"
                  whileTap={{ scale: 0.97 }}
                >
                  Connexion HSE
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="relative z-10">
        <section
          id="hero"
          className="container flex flex-col-reverse items-center gap-16 pb-24 pt-12 lg:flex-row lg:items-end lg:gap-20 lg:pt-10"
        >
          <motion.div
            className="w-full max-w-2xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-sand/70 backdrop-blur-md"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            >
              <span className="h-2 w-2 rounded-full bg-safety" />
              Assistance HSE sur WhatsApp
            </motion.div>

            <h1 className="mt-8 font-display text-4xl leading-tight text-snow md:text-5xl lg:text-6xl">
              Sécurisez chaque chantier avec un assistant HSE qui anticipe et agit.
            </h1>

            <p className="mt-6 text-lg text-sand/80 md:text-xl">
              SHORA BOT connecte les équipes terrain, WhatsApp et votre dashboard HSE pour détecter les incidents avant qu'ils ne deviennent critiques.
            </p>

            <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center">
              <motion.button
                onClick={() => navigate("/auth")}
                className="inline-flex items-center justify-center rounded-full bg-safety px-10 py-4 font-display text-lg text-petrol shadow-[0_20px_50px_-20px_rgba(246,139,31,0.85)] transition hover:bg-[#ffa248] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-safety"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                Connexion HSE
              </motion.button>

              <motion.a
                href="#process"
                className="inline-flex items-center gap-3 text-base font-medium text-safety transition hover:text-safety/70"
                whileHover={{ gap: 9 }}
              >
                Découvrir comment ça marche
                <motion.span
                  aria-hidden="true"
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  →
                </motion.span>
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            className="relative w-full max-w-xl"
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 shadow-glow">
              <motion.img
                src={heroWorker}
                alt="Agent HSE sur chantier avec casque de sécurité"
                className="h-full w-full object-cover"
                initial={{ scale: 1.05 }}
                animate={{ scale: 1 }}
                transition={{ duration: 6, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-petrol/60 via-petrol/10 to-transparent" />
            </div>

            <motion.div
              className="absolute -left-12 -bottom-12 w-[240px] rounded-2xl border border-white/15 bg-white/8 p-5 text-snow shadow-[0_18px_38px_-24px_rgba(0,0,0,0.7)] backdrop-blur-xl md:-left-16 md:-bottom-14"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-sand/70">Nouvelle alerte</p>
                  <p className="text-sm font-semibold text-snow">
                    Glissade signalée zone 3
                  </p>
                </div>
              </div>
              <p className="mt-4 text-xs text-sand/70 leading-relaxed">
                SHORA BOT : "Balise la zone en urgence. Intervention équipe sécurité envoyée."
              </p>
              <motion.div
                className="mt-4 h-1 rounded-full bg-safety/30"
                animate={{ width: ["40%", "85%", "40%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        </section>

        <section id="mission" className="container border-t border-white/10 pt-24">
          <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <SectionTitle
              eyebrow="Mission"
              title="Protéger chaque personne sur site grâce à l'intelligence collective"
              description="SHORA BOT relie le terrain et votre système HSE pour transformer chaque signal en action préventive. L'assistant accélère les décisions tout en gardant un langage clair pour les équipes."
            />

            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-1">
                <motion.img
                  src={helmetsImage}
                  alt="Casques de sécurité alignés dans un espace industriel"
                  className="h-full w-full rounded-[1.8rem] object-cover"
                  initial={{ scale: 1.02 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-petrol/60 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-8 -left-10 hidden h-32 w-32 rounded-full bg-safety/20 blur-3xl md:block" />
            </motion.div>
          </div>
        </section>

        <section id="features" className="container border-t border-white/10 pt-24">
          <SectionTitle
            eyebrow="Fonctionnalités clés"
            title="Une vigilance continue pensée pour les responsables HSE"
            description="Des alertes aux rapports, SHORA BOT fluidifie la chaîne d'information et renforce la prévention sur tous vos sites."
          />

          <Features />
        </section>

        <section
          id="process"
          className="container border-t border-white/10 pt-24"
        >
          <SectionTitle
            eyebrow="Comment ça marche ?"
            title="Un parcours simple en trois temps, du signal à l'action"
            description="Chaque étape est conçue pour garder le contrôle, assurer la traçabilité et apporter un accompagnement constant aux équipes HSE."
          />

          <div className="mt-16 grid gap-10 lg:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                className="relative rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.7)] backdrop-blur-sm"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
              >
                <div className="absolute -top-6 left-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-safety text-petrol font-display text-xl">
                  {index + 1}
                </div>
                <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-safety/90">
                  {step.badge}
                </span>
                <h3 className="mt-6 font-display text-2xl text-snow">
                  {step.title}
                </h3>
                <p className="mt-4 text-base text-sand/80 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section
          id="cta"
          className="container border-t border-white/10 py-24"
        >
          <motion.div
            className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 px-10 py-16 text-center shadow-[0_32px_90px_-40px_rgba(0,0,0,0.75)] backdrop-blur-xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div
              className="absolute -top-16 right-20 h-40 w-40 rounded-full bg-safety/30 blur-3xl"
              animate={{ opacity: [0.35, 0.7, 0.35] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-20 left-24 hidden h-48 w-48 rounded-full bg-[#25D366]/20 blur-3xl md:block"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative mx-auto max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.25em] text-safety/90">
                Réservé aux agents HSE
              </span>
              <h2 className="mt-6 font-display text-3xl text-snow md:text-4xl">
                Prêt à connecter vos équipes HSE à un assistant intelligent ?
              </h2>
              <p className="mt-5 text-lg text-sand/80 md:text-xl">
                Accédez à la plateforme sécurisée SHORA BOT et centralisez chaque signal de vos chantiers en temps réel.
              </p>
              <motion.button
                onClick={() => navigate("/auth")}
                className="mt-10 inline-flex items-center justify-center rounded-full bg-safety px-10 py-4 font-display text-lg text-petrol shadow-[0_20px_50px_-20px_rgba(246,139,31,0.85)] transition hover:bg-[#ffa248] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-safety"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                Connexion HSE
              </motion.button>
              <p className="mt-4 text-sm text-sand/70">
                Vous n'êtes pas encore habilité ? Contactez-nous pour obtenir vos identifiants sécurisés.
              </p>
            </div>
          </motion.div>
        </section>

        <section
          id="contact"
          className="container border-t border-white/10 pt-24 pb-16"
        >
          <SectionTitle
            eyebrow="Contact"
            title="Une question ? Contactez-nous"
            description="Notre équipe est à votre disposition pour répondre à toutes vos questions sur SHORA BOT et vous accompagner dans votre démarche de sécurité."
          />

          <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:items-start">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <h3 className="font-display text-xl text-snow mb-4">Informations de contact</h3>
                <div className="space-y-4 text-sand/80">
                  <div>
                    <p className="text-sm text-steel/80 mb-1">Email</p>
                    <a href="mailto:contact@shorabot.com" className="text-snow hover:text-safety transition">
                      contact@shorabot.com
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-steel/80 mb-1">Téléphone</p>
                    <a href="tel:+33102030405" className="text-snow hover:text-safety transition">
                      +33 1 02 03 04 05
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-steel/80 mb-1">Disponibilité</p>
                    <p className="text-snow">Lundi - Vendredi, 9h - 18h</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.form
              onSubmit={handleContactSubmit}
              className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            >
              <div className="space-y-2">
                <Label htmlFor="contact-name" className="text-sand/90">
                  Nom complet
                </Label>
                <Input
                  id="contact-name"
                  type="text"
                  placeholder="Votre nom"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                  className="bg-white/5 border-white/10 text-snow placeholder:text-sand/50 focus:border-safety"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-email" className="text-sand/90">
                  Email
                </Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="votre@email.com"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                  className="bg-white/5 border-white/10 text-snow placeholder:text-sand/50 focus:border-safety"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-subject" className="text-sand/90">
                  Sujet
                </Label>
                <Input
                  id="contact-subject"
                  type="text"
                  placeholder="Sujet de votre message"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  required
                  className="bg-white/5 border-white/10 text-snow placeholder:text-sand/50 focus:border-safety"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-message" className="text-sand/90">
                  Message
                </Label>
                <Textarea
                  id="contact-message"
                  placeholder="Votre message..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                  rows={6}
                  className="bg-white/5 border-white/10 text-snow placeholder:text-sand/50 focus:border-safety resize-none"
                />
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-safety text-petrol hover:bg-[#ffa248] font-medium shadow-[0_18px_40px_-18px_rgba(246,139,31,0.9)]"
                >
                  {isSubmitting ? (
                    "Envoi en cours..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.form>
          </div>
        </section>
      </main>

      <footer
        className="relative z-10 border-t border-white/10 bg-black/10 py-10"
      >
        <div className="container flex flex-col gap-6 text-sm text-sand/70 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-snow">SHORA BOT</p>
            <p className="mt-2 max-w-sm text-sand/60">
              Solution intelligente de sécurité pour le BTP et l'industrie. Assistance IA dédiée aux responsables HSE.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sand/60">
            <a href="mailto:contact@shorabot.com" className="hover:text-safety">
              contact@shorabot.com
            </a>
            <a href="tel:+33102030405" className="hover:text-safety">
              +33 1 02 03 04 05
            </a>
            <span>Mentions légales • © {new Date().getFullYear()} SHORA BOT</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
