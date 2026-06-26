import React, { useRef } from 'react';
import './Hero.css';
import Navbar from './Navbar';
import Butterflies from './Butterflies';
import { useInView , motion } from 'framer-motion';

const Hero = () => {
  const section2Ref = useRef(null);
const isInView = useInView(section2Ref, { amount: 0.9, once: true });
const section1RightRef = useRef(null);
const isInViewRight = useInView(section1RightRef, { amount: 0.7, once: true });
  return (
   <>
         <Butterflies /> 

    <div className="hero">
      <Navbar />
      <div className="hero-content">
        <h1>Welcome to the Botanical Garden</h1>
        <p>Explore a world of blooming serenity and vibrant nature.</p>
        <button>Start Exploring</button>
      </div>
    </div>
   <div className="section1">
  <div className="section1-left">
    <img src="/images/section1.png" alt="Colorful Flower Bundle" />
  </div>
<motion.div
  ref={section1RightRef}
  className="section1-right"
  initial="hidden"
  animate={isInViewRight ? "visible" : "hidden"}
  variants={{
    visible: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  }}
>
  <motion.h1
    variants={{
      hidden: { opacity: 0, x: 60 },
      visible: { opacity: 1, x: 0 },
    }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    Step Into the Garden
  </motion.h1>

  {[
    "Let the colors of nature bloom around you.",
    "Each flower here tells a story — soft, wild, and full of life.",
    "From the tender sway of petals to the quiet strength of their stems,",
    "this garden is a canvas of calm and wonder.",
    "Breathe in the serenity, feel the sunlight in every hue,",
    "and wander through a world where growth never stops."
  ].map((line, index) => (
    <motion.p
      key={index}
      variants={{
        hidden: { opacity: 0, x: 60 },
        visible: { opacity: 1, x: 0 },
      }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {line}
    </motion.p>
  ))}
</motion.div>
</div>
<div className="section2">
<motion.div
  ref={section2Ref}
  className="section2-content"
  initial="hidden"
  animate={isInView ? "visible" : "hidden"}
  variants={{
    visible: {
      transition: {
        staggerChildren: 0.3,
      }
    },
  }}
>
  <motion.h2
    variants={{
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0 },
    }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    A Walk Through the Grass
  </motion.h2>

  <motion.p
   variants={{
    hidden : {opacity:0, y:40},
    visible : {opacity:1 , y:0}
   }}
   transition={{duration:0.8 , ease:"easeOut"}}
  >
    As you move forward, feel the breeze rustle through the tall grass and hear
    the whispers of nature. This is the path where the garden begins to unfold.
    Let your footsteps sink softly into the earth as butterflies dance beside you.
    The sky stretches wide above, a canvas of soft blue and drifting clouds.
    Every blade of grass bends in welcome, each moment a quiet invitation to slow down.
    Take a breath — fresh, green, and full of promise.
    This is where wonder starts.
  </motion.p>
</motion.div>


</div>

   </>
  );
};

export default Hero;
