"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroSection from "./components/sections/HeroSection";
import { Navigation } from "./components/ui/Navigation";
import Button from "./components/ui/Button";
import { ContainerScroll } from "./components/ui/container-scroll-animation";
import { StaggerTestimonials } from "./components/ui/stagger-testimonials";

// Toast notification component
function Toast({ message, isVisible }: { message: string; isVisible: boolean }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50 px-6 py-3 bg-neon-blue text-black rounded-lg shadow-lg shadow-neon-blue/50"
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            <span className="font-medium">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Modal component
function Modal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({ name: "", email: "", city: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="w-full max-w-md mx-4 glass rounded-2xl border border-white/20 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Schedule Demo</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-transparent"
                  placeholder="New York, USA"
                />
              </div>
              
              <Button type="submit" variant="primary" size="lg" className="w-full">
                Schedule Demo
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: "🏙️",
      title: "Real-time Monitoring",
      description: "Track city metrics and infrastructure performance with live data streams and AI-powered analytics",
      color: "neon-blue"
    },
    {
      icon: "🤖",
      title: "AI-Powered Insights",
      description: "Leverage machine learning algorithms to predict traffic patterns and optimize city operations",
      color: "neon-green"
    },
    {
      icon: "📊",
      title: "Predictive Analytics",
      description: "Forecast urban trends and make data-driven decisions for sustainable city planning",
      color: "neon-purple"
    },
    {
      icon: "🌐",
      title: "Smart Integration",
      description: "Seamlessly connect existing infrastructure with our unified management platform",
      color: "neon-pink"
    },
    {
      icon: "🛡️",
      title: "Advanced Security",
      description: "Protect critical infrastructure with enterprise-grade security and threat detection",
      color: "neon-yellow"
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Process millions of data points in real-time for instant decision making",
      color: "neon-blue"
    }
  ];

  return (
    <section id="features" className="scroll-mt-20 pt-24 pb-16 bg-background-primary">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: "true", amount: 0.2 }}
          className="text-center mb-4"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive smart city management tools designed for modern urban challenges
          </p>
        </motion.div>
        
        {/* Container Scroll Animation */}
        <ContainerScroll
          titleComponent={
            <>
              <h2 className="text-4xl font-semibold text-white mb-4">
                Experience Our <br />
                <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                  Smart Features
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mt-4">
                Scroll to see our powerful features in action
              </p>
            </>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass rounded-2xl border border-white/10 p-8 hover:border-neon-blue/30 transition-all duration-300 group"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className={`text-4xl mb-4 ${feature.color === "neon-blue" ? "text-neon-blue" : feature.color === "neon-green" ? "text-neon-green" : feature.color === "neon-purple" ? "text-neon-purple" : feature.color === "neon-pink" ? "text-neon-pink" : "text-neon-yellow"}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </ContainerScroll>
      </div>
    </section>
  );
}

// Impact Section
function ImpactSection() {
  const metrics = [
    { value: "35%", label: "Traffic Reduction", color: "neon-blue" },
    { value: "25%", label: "Air Quality Improvement", color: "neon-green" },
    { value: "$2M+", label: "Annual Savings", color: "neon-purple" },
    { value: "50+", label: "Cities Served", color: "neon-pink" }
  ];

  return (
    <section id="impact" className="scroll-mt-20 py-24 bg-background-secondary">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: "true", amount: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Proven Impact</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real results from cities already using SmartCity AI technology
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`text-5xl font-bold mb-2 ${
                metric.color === "neon-blue" ? "text-neon-blue" :
                metric.color === "neon-green" ? "text-neon-green" :
                metric.color === "neon-purple" ? "text-neon-purple" :
                "text-neon-pink"
              }`}>
                {metric.value}
              </div>
              <div className="text-gray-300 text-lg">{metric.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Pricing Section Component
function PricingSection() {
  return (
    <section id="pricing" className="scroll-mt-20 py-24 bg-background-secondary relative overflow-hidden">
      {/* Corner fade effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-neon-blue/10 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-neon-purple/10 to-transparent pointer-events-none"></div>
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: "true", amount: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="font-heading font-semibold text-4xl md:text-5xl uppercase tracking-widest mb-4"
              style={{ textShadow: '0 0 20px rgba(0, 217, 255, 0.3)' }}>
            <span className="text-neon-blue">PRICING</span> PLANS
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Choose the perfect plan for your smart city infrastructure
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: "true" }}
            whileHover={{ scale: 1.05, y: -10 }}
            className="glass rounded-2xl border border-white/10 p-8 backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,217,255,0.3)] min-h-[500px] flex flex-col justify-between"
          >
            <div className="flex flex-col h-full">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                <div className="text-4xl font-bold text-neon-blue mb-4">$0<span className="text-lg text-gray-400">/mo</span></div>
              </div>
              <ul className="space-y-3 mb-8 text-left flex-grow">
                <li className="flex items-center text-gray-300">
                  <span className="text-neon-green mr-2">✓</span>
                  1 City Node
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-neon-green mr-2">✓</span>
                  Basic Analytics
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-neon-green mr-2">✓</span>
                  24h Data History
                </li>
              </ul>
              <motion.button 
                className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-neon-blue to-neon-cyan text-white font-semibold uppercase tracking-widest transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,217,255,0.7)] transform hover:scale-105 border-2 border-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>

          {/* Basic Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: "true" }}
            whileHover={{ scale: 1.08, y: -15 }}
            className="glass rounded-2xl border-2 border-neon-blue/50 p-8 backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_50px_rgba(0,217,255,0.6)] relative min-h-[520px] flex flex-col justify-between transform lg:scale-105 lg:origin-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-transparent rounded-2xl pointer-events-none"></div>
            <div className="flex flex-col h-full relative z-10">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-4 tracking-wide">Basic</h3>
                <div className="relative inline-block">
                  <div className="text-5xl font-bold text-neon-green mb-2 relative z-10">$49<span className="text-lg text-gray-400">/mo</span></div>
                  <div className="absolute inset-0 bg-neon-green/20 blur-xl -z-10"></div>
                </div>
              </div>
              <ul className="space-y-4 mb-8 text-left flex-grow">
                <li className="flex items-center text-gray-200 text-lg">
                  <span className="text-neon-green mr-3 text-xl">✓</span>
                  <span className="font-medium">5 City Nodes</span>
                </li>
                <li className="flex items-center text-gray-200 text-lg">
                  <span className="text-neon-green mr-3 text-xl">✓</span>
                  <span className="font-medium">Real-time AI Insights</span>
                </li>
                <li className="flex items-center text-gray-200 text-lg">
                  <span className="text-neon-green mr-3 text-xl">✓</span>
                  <span className="font-medium">30-day History</span>
                </li>
                <li className="flex items-center text-gray-200 text-lg">
                  <span className="text-neon-green mr-3 text-xl">✓</span>
                  <span className="font-medium">Email Support</span>
                </li>
              </ul>
              <motion.button 
                className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-neon-blue to-neon-cyan text-white font-semibold uppercase tracking-widest transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,217,255,0.7)] transform hover:scale-105 border-2 border-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: "true" }}
            whileHover={{ scale: 1.05, y: -10 }}
            className="glass rounded-2xl border border-white/10 p-8 backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,217,255,0.3)] min-h-[500px] flex flex-col justify-between"
          >
            <div className="flex flex-col h-full">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
                <div className="text-4xl font-bold text-neon-purple mb-4">$199<span className="text-lg text-gray-400">/mo</span></div>
              </div>
              <ul className="space-y-3 mb-8 text-left flex-grow">
                <li className="flex items-center text-gray-300">
                  <span className="text-neon-green mr-2">✓</span>
                  Unlimited Nodes
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-neon-green mr-2">✓</span>
                  Predictive Maintenance AI
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-neon-green mr-2">✓</span>
                  Full API Access
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="text-neon-green mr-2">✓</span>
                  24/7 Priority Support
                </li>
              </ul>
              <motion.button 
                onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-neon-blue to-neon-cyan text-white font-semibold uppercase tracking-widest transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,217,255,0.7)] transform hover:scale-105 border-2 border-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Testimonials Section Component
function TestimonialsSection() {
  const testimonialsData = [
    {
      className:
        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/60 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-500 hover:grayscale-0 before:left-0 before:top-0",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      username: "Maria Rodriguez",
      handle: "@mariatech",
      content: "SmartCity AI has revolutionized our urban planning! The real-time analytics and predictive maintenance features have reduced our operational costs by 40%. Game changer! 🏙️",
      date: "Jan 15, 2026",
      verified: true,
      likes: 284,
      retweets: 67,
      tweetUrl: "https://x.com",
    },
    {
      className:
        "[grid-area:stack] translate-x-2 sm:translate-x-4 translate-y-1 sm:translate-y-3 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-2xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/60 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-500 hover:grayscale-0 before:left-0 before:top-0",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      username: "James Chen",
      handle: "@jamescity",
      content: "The 3D visualization and AI-powered insights are incredible. We can now monitor traffic patterns and optimize routes in real-time. Our citizens love the improved efficiency! 🚗",
      date: "Jan 12, 2026",
      verified: true,
      likes: 156,
      retweets: 34,
      tweetUrl: "https://x.com",
    },
    {
      className: "[grid-area:stack] translate-x-4 sm:translate-x-8 translate-y-2 sm:translate-y-6 hover:translate-y-2 sm:hover:translate-y-4",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha",
      username: "Aisha Patel",
      handle: "@aishasmart",
      content: "From energy management to waste optimization, SmartCity AI does it all. The integration was seamless and the ROI was immediate. Best decision for our smart city initiative! ⚡",
      date: "Jan 10, 2026",
      verified: true,
      likes: 342,
      retweets: 89,
      tweetUrl: "https://x.com",
    },
  ];

  return (
    <section id="testimonials" className="scroll-mt-20 py-24 bg-background-primary">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: "true", amount: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold text-white mb-4">What City Leaders Say</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Hear from urban planners and city managers who are transforming their communities with SmartCity AI
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: "true", amount: 0.2 }}
          className="flex justify-center items-center min-h-[600px] mt-4"
        >
          <StaggerTestimonials />
        </motion.div>
      </div>
    </section>
  );
}

// Contact Section Component
function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    
    // Show success toast
    const successToast = document.createElement('div');
    successToast.className = 'fixed top-4 right-4 z-50 px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg transition-all duration-300';
    successToast.textContent = 'Signal Transmitted Successfully!';
    document.body.appendChild(successToast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
      successToast.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(successToast);
      }, 300);
    }, 3000);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', organization: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="scroll-mt-20 py-24 bg-background-primary relative overflow-hidden">
      {/* Corner fade effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-black/20 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-neon-cyan/10 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-neon-green/10 to-transparent pointer-events-none"></div>
  <div className="container mx-auto px-6 max-w-7xl relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: "true", amount: 0.2 }}
      className="text-center mb-8"
    >
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="font-heading font-semibold text-4xl md:text-5xl uppercase tracking-widest mb-4"
        style={{ textShadow: '0 0 20px rgba(0, 217, 255, 0.3)' }}
      >
        <span className="text-neon-blue">GET IN</span> TOUCH
      </motion.h2>
      <p className="text-slate-400 text-lg max-w-2xl mx-auto">
        Ready to transform your city? Send us a signal and our agents will reach out shortly.
      </p>
    </motion.div>
        
        {!isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: "true" }}
            className="glass rounded-2xl border border-white/10 p-8 backdrop-blur-md"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue focus:shadow-[0_0_10px_rgba(0,217,255,0.3)] transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Work Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue focus:shadow-[0_0_10px_rgba(0,217,255,0.3)] transition-all"
                    placeholder="john@city.gov"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-gray-300 mb-2">
                  City/Organization
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue focus:shadow-[0_0_10px_rgba(0,217,255,0.3)] transition-all"
                  placeholder="Smart City Department"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue focus:shadow-[0_0_10px_rgba(0,217,255,0.3)] transition-all resize-none"
                  placeholder="Tell us about your smart city needs..."
                />
              </div>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(0, 217, 255, 0.7)",
                    "0 0 0 10px rgba(0, 217, 255, 0)",
                    "0 0 0 0 rgba(0, 217, 255, 0)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
                className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-neon-blue to-neon-cyan text-white font-semibold uppercase tracking-widest transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,217,255,0.7)] border-2 border-white/20"
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-2xl border border-neon-green/50 p-12 backdrop-blur-md text-center"
          >
            <div className="text-6xl mb-6">📡</div>
            <h3 className="text-2xl font-bold text-neon-green mb-4">
              Signal Received
            </h3>
            <p className="text-gray-300 text-lg">
              Our agents will reach out shortly.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// Technology Section
function TechnologySection() {
  const technologies = [
    {
      title: "AI-Powered Analytics",
      description: "Machine learning algorithms analyze city data patterns and provide actionable insights.",
      icon: "🤖"
    },
    {
      title: "IoT Integration",
      description: "Seamless integration with thousands of sensors and smart devices.",
      icon: "📡"
    },
    {
      title: "Cloud Infrastructure",
      description: "Scalable cloud platform for real-time data processing and storage.",
      icon: "☁️"
    },
    {
      title: "Blockchain Security",
      description: "Secure, transparent data management with blockchain technology.",
      icon: "🔗"
    }
  ];

  return (
    <section id="technology" className="scroll-mt-20 py-24 bg-background-secondary">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: "true", amount: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Cutting-Edge Technology</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Built with latest technologies for maximum performance and reliability
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass rounded-2xl border border-white/10 p-8 hover:border-neon-blue/30 transition-all duration-300"
            >
              <div className="text-4xl mb-4 text-neon-blue">{tech.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{tech.title}</h3>
              <p className="text-gray-300 leading-relaxed">{tech.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Live Stats Component (responsive)
function LiveStats() {
  console.log('LiveStats component rendered');
  const [stats, setStats] = useState({
    traffic: 87.5,
    energy: 92.3,
    pollution: 78.9,
    waste: 65.2
  });

  useEffect(() => {
    console.log('LiveStats useEffect triggered');
    const interval = setInterval(() => {
      setStats(prev => ({
        traffic: Math.max(0, Math.min(100, prev.traffic + (Math.random() - 0.5) * 1)),
        energy: Math.max(0, Math.min(100, prev.energy + (Math.random() - 0.5) * 1)),
        pollution: Math.max(0, Math.min(100, prev.pollution + (Math.random() - 0.5) * 1)),
        waste: Math.max(0, Math.min(100, prev.waste + (Math.random() - 0.5) * 1))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed left-0 top-20 h-full w-64 sm:w-80 lg:w-80 bg-black/80 backdrop-blur-md border-r border-white/10 p-4 sm:p-6 transform -translate-x-full transition-transform duration-300 z-40">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white">Live City Stats</h3>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('toggleStats'))}
          className="text-gray-400 hover:text-white transition-colors"
          title="Close stats"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Responsive grid layout */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <div className="glass rounded-lg p-3 sm:p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm text-gray-300">Traffic Flow</span>
            <span className="text-sm sm:text-base lg:text-lg font-bold text-neon-blue">{stats.traffic.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5 sm:h-2">
            <div 
              className="bg-neon-blue h-1.5 sm:h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats.traffic}%` }}
            ></div>
          </div>
        </div>
        
        <div className="glass rounded-lg p-3 sm:p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm text-gray-300">Energy</span>
            <span className="text-sm sm:text-base lg:text-lg font-bold text-neon-green">{stats.energy.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5 sm:h-2">
            <div 
              className="bg-neon-green h-1.5 sm:h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats.energy}%` }}
            ></div>
          </div>
        </div>
        
        <div className="glass rounded-lg p-3 sm:p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm text-gray-300">Air Quality</span>
            <span className="text-sm sm:text-base lg:text-lg font-bold text-neon-purple">{stats.pollution.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5 sm:h-2">
            <div 
              className="bg-neon-purple h-1.5 sm:h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats.pollution}%` }}
            ></div>
          </div>
        </div>
        
        <div className="glass rounded-lg p-3 sm:p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm text-gray-300">Waste Mgmt</span>
            <span className="text-sm sm:text-base lg:text-lg font-bold text-neon-pink">{stats.waste.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5 sm:h-2">
            <div 
              className="bg-neon-pink h-1.5 sm:h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats.waste}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleOpenModal = () => setIsModalOpen(true);
    const handleShowToast = () => setShowToast(true);

    window.addEventListener('openDemoModal', handleOpenModal);
    window.addEventListener('showDashboardToast', handleShowToast);

    // Handle scroll for back to top button
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('openDemoModal', handleOpenModal);
      window.removeEventListener('showDashboardToast', handleShowToast);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScheduleDemo = () => {
    setIsModalOpen(true);
  };

  const handleDashboardClick = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <ImpactSection />
      <TechnologySection />
      <PricingSection />
      <TestimonialsSection />
      <ContactSection />
      
      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 p-4 bg-neon-blue text-black rounded-full shadow-lg transition-all duration-300 hover:bg-neon-cyan hover:shadow-[0_0_20px_rgba(0,217,255,0.5)] ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Back to top"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Toast message="Connecting to City Neural Network..." isVisible={showToast} />
    </>
  );
}
