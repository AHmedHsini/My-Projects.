import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import './styles.css'; // Import the CSS file where the font is defined

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 text-center md:text-left mb-4 md:mb-0">
            <h2 className="text-2xl font-bold font-montserrat">3alemni</h2>
            <p className="mt-2">Empower Your Future with Our Courses!</p>
          </div>
          <div className="w-full md:w-1/3 text-center mb-4 md:mb-0">
            <ul className="list-none">
              <li className="inline-block mx-2"><a href="#home" className="text-white hover:text-gray-400">Home</a></li>
              <li className="inline-block mx-2"><a href="#about" className="text-white hover:text-gray-400">About</a></li>
              <li className="inline-block mx-2"><a href="#contact" className="text-white hover:text-gray-400">Contact</a></li>
            </ul>
          </div>
          <div className="w-full md:w-1/3 text-center md:text-right">
            <div className="flex justify-center md:justify-end">
              <a href="#facebook" className="text-white hover:text-gray-400 mx-2"><FaFacebook /></a>
              <a href="#twitter" className="text-white hover:text-gray-400 mx-2"><FaTwitter /></a>
              <a href="#instagram" className="text-white hover:text-gray-400 mx-2"><FaInstagram /></a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-400">
          &copy; 2024 3aLemni Site. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
