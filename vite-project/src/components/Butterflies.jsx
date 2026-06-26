import React from 'react';
import Lottie from 'lottie-react'
import { motion, useScroll, useTransform } from 'framer-motion';
import butterfly1 from '../assets/butterfly1.json';
import butterfly2 from '../assets/butterfly2.json';
import butterfly3 from '../assets/butterfly3.json';
import './Butterflies.css';

const Butterflies = () => {
  const { scrollY } = useScroll();
const scale2 = useTransform(scrollY, [500, 1000], [1, 3]);

  
  const x1 = useTransform(scrollY, [0, 500], [0, 440]);
  const y1 = useTransform(scrollY, [0, 500], [0, 720]);
  const r1 = useTransform(scrollY, [0, 500], [0, -20]);


const x2 = useTransform(scrollY, [0, 500, 1000], [0, -550, -20]); 
const y2 = useTransform(scrollY, [0, 1000], [0, 1460]);

  const r2 = useTransform(scrollY, [0, 500], [0, -360]);


  const x3 = useTransform(scrollY, [0, 500], [0, 40]);
  const y3 = useTransform(scrollY, [0, 500], [0, 860]);
  const r3 = useTransform(scrollY, [0, 500], [0, 360]);

  return (
    <div className="butterfly-container">
      <motion.div className="scroll-butterfly b1-1" style={{ x: x1, y: y1, rotate: r1 }}>
        <Lottie animationData={butterfly1} className="butterfly" loop />
      </motion.div>

    <motion.div
  className="scroll-butterfly b2-1"
  style={{ x: x2, y: y2, rotate: r2, scale: scale2 }}
>
  <Lottie animationData={butterfly2} className="butterfly" loop />
</motion.div>


      <motion.div className="scroll-butterfly b3-1" style={{ x: x3, y: y3, rotate: r3 }}>
        <Lottie animationData={butterfly3} className="butterfly" loop />
      </motion.div>

      <Lottie animationData={butterfly1} className="butterfly b1-2" loop />
      <Lottie animationData={butterfly1} className="butterfly b1-3" loop />
      <Lottie animationData={butterfly2} className="butterfly b2-2" loop />
      <Lottie animationData={butterfly2} className="butterfly b2-3" loop />
      <Lottie animationData={butterfly3} className="butterfly b3-2" loop />
      <Lottie animationData={butterfly3} className="butterfly b3-3" loop />
    </div>
  );
};

export default Butterflies;
