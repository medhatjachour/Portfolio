import React, { useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import * as THREE from 'three';
import Input from '../atoms/Input';
import Textarea from '../atoms/Textarea';
import Button from '../atoms/Button';
import { useFormStore } from '../../store/formStore';
import { 
  FaEnvelope, FaLinkedin, FaGithub, FaTwitter, 
  FaMapMarkerAlt, FaPhone, FaPaperPlane 
} from 'react-icons/fa';

/**
 * Flowing communication particles - representing messages and connections
 */
const CommunicationParticles = () => {
  const particlesRef = useRef();
  const particleCount = 1000;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const cols = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount;
      const angle = t * Math.PI * 4;
      const radius = 3 + t * 5;
      
      pos[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 2;
      pos[i * 3 + 1] = (t - 0.5) * 10 + (Math.random() - 0.5) * 3;
      pos[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 2;
      
      // Gradient from blue to purple to pink
      if (t < 0.33) {
        cols[i * 3] = 0.4;
        cols[i * 3 + 1] = 0.6;
        cols[i * 3 + 2] = 1.0;
      } else if (t < 0.66) {
        cols[i * 3] = 0.7;
        cols[i * 3 + 1] = 0.4;
        cols[i * 3 + 2] = 0.9;
      } else {
        cols[i * 3] = 0.9;
        cols[i * 3 + 1] = 0.3;
        cols[i * 3 + 2] = 0.7;
      }
    }
    return { positions: pos, colors: cols };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.08;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

/**
 * Floating message orbs
 */
const MessageOrb = ({ position, color, scale = 1 }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <Float speed={3} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <octahedronGeometry args={[0.6, 0]} />
        <MeshDistortMaterial
          color={color}
          distort={0.5}
          speed={2.5}
          roughness={0.1}
          metalness={0.9}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
    </Float>
  );
};

// Validation schema using Yup
const contactSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name is too short')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  message: Yup.string()
    .min(10, 'Message is too short')
    .required('Message is required')
});

/**
 * Contact Organism
 * Contact form and information section
 * @param {object} contactInfo - Contact information object
 * @param {object} socialLinks - Social media links object
 */
const Contact = ({ 
  contactInfo = {
    email: 'medhatashour19@gmail.com',
    phone: '+201015683986',
    location: 'Kafr El-Shaikh, Egypt'
  },
  socialLinks = {
    linkedin: 'https://linkedin.com/in/medhatjachour',
    github: 'https://github.com/medhatjachour',
    twitter: 'https://twitter.com/medhatjachour'
  }
}) => {
  const { isSubmitting, submitSuccess, submitError, setSubmitting, setSuccess, setError, reset } = useFormStore();
  
  const handleSubmit = async (values, { resetForm }) => {
    setSubmitting(true);
    
    try {
      // Simulate API call - Replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Form submitted:', values);
      setSuccess(true);
      resetForm();
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        reset();
      }, 5000);
    } catch (error) {
      setError('Failed to send message. Please try again.');
      setTimeout(() => {
        reset();
      }, 5000);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <section 
      id="contact"
      className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%)' }}
    >
      {/* 3D Background */}
      <div className="absolute inset-0 z-0" style={{ opacity: 0.4 }}>
        <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#6366F1" />
          <pointLight position={[-10, -10, -10]} intensity={0.8} color="#EC4899" />
          <CommunicationParticles />
          <MessageOrb position={[-4, 2, 0]} color="#6366F1" scale={0.8} />
          <MessageOrb position={[4, -2, 1]} color="#EC4899" scale={1} />
          <MessageOrb position={[0, 3, -2]} color="#8B5CF6" scale={0.6} />
        </Canvas>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-[#0f172a]/60 pointer-events-none" />
      </div>
      
      <div className="relative z-10 container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-6 py-2 mb-6 backdrop-blur-md bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-300 font-semibold rounded-full text-sm"
          >
            💬 Let's Connect
          </motion.span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Get In <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Have a project in mind or want to collaborate? Let's create something amazing together!
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-white/20 transition-all"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FaPaperPlane className="text-2xl text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white">
                Send a Message
              </h3>
            </div>
            
            <Formik
              initialValues={{ name: '', email: '', message: '' }}
              validationSchema={contactSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, values, handleChange }) => (
                <Form className="space-y-6">
                  <Input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={values.name}
                    onChange={handleChange}
                    error={touched.name && errors.name}
                    required
                  />
                  
                  <Input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={values.email}
                    onChange={handleChange}
                    error={touched.email && errors.email}
                    required
                  />
                  
                  <Textarea
                    name="message"
                    placeholder="Your Message"
                    rows={6}
                    value={values.message}
                    onChange={handleChange}
                    error={touched.message && errors.message}
                    required
                  />
                  
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        Send Message
                      </>
                    )}
                  </motion.button>
                  
                  {/* Success/Error Messages */}
                  {submitSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-emerald-500/10 border border-emerald-500 text-emerald-400 rounded-lg flex items-center gap-3"
                    >
                      <span className="text-xl">✓</span>
                      <span>Message sent successfully! I'll get back to you soon.</span>
                    </motion.div>
                  )}
                  
                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-500/10 border border-red-500 text-red-400 rounded-lg flex items-center gap-3"
                    >
                      <span className="text-xl">✗</span>
                      <span>{submitError}</span>
                    </motion.div>
                  )}
                </Form>
              )}
            </Formik>
          </motion.div>
          
          {/* Right: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Contact Information Cards */}
            <div className="space-y-4">
              <motion.a
                href={`mailto:${contactInfo.email}`}
                className="block backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-xl hover:border-blue-500/50 transition-all group"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FaEnvelope size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Email</p>
                    <p className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {contactInfo.email}
                    </p>
                  </div>
                </div>
              </motion.a>
              
              <motion.a
                href={`tel:${contactInfo.phone}`}
                className="block backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-xl hover:border-emerald-500/50 transition-all group"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FaPhone size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Phone</p>
                    <p className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {contactInfo.phone}
                    </p>
                  </div>
                </div>
              </motion.a>
              
              <motion.div
                className="backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-xl hover:border-purple-500/50 transition-all group"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FaMapMarkerAlt size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Location</p>
                    <p className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                      {contactInfo.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Social Links */}
            <div className="backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded-2xl">
              <h4 className="text-2xl font-bold text-white mb-6">
                Connect With <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Me</span>
              </h4>
              <div className="flex gap-4">
                <motion.a 
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 h-16 bg-[#0077B5]/10 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-[#0077B5] transition-all border border-[#0077B5]/30 group"
                  aria-label="LinkedIn"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaLinkedin size={32} className="text-[#0077B5] group-hover:text-white transition-colors" />
                </motion.a>
                <motion.a 
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 h-16 backdrop-blur-md bg-white/5 rounded-xl flex items-center justify-center hover:bg-white transition-all border border-white/10 group"
                  aria-label="GitHub"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaGithub size={32} className="text-white group-hover:text-black transition-colors" />
                </motion.a>
                <motion.a 
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 h-16 bg-[#1DA1F2]/10 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-[#1DA1F2] transition-all border border-[#1DA1F2]/30 group"
                  aria-label="Twitter"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTwitter size={32} className="text-[#1DA1F2] group-hover:text-white transition-colors" />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
