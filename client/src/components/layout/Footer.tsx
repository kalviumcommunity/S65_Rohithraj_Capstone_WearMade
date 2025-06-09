import { Link } from 'react-router-dom';
import logo from '@/assets/logo.svg';
import { Github, Twitter, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          {/* Logo section - MADE BIGGER */}
          <Link to="/" className="flex items-center mb-6 md:mb-0">
            <img 
              src={logo} 
              alt="WearMade Logo" 
              className="h-14 w-auto" 
            />
            <span className="sr-only">Back to home page</span>
          </Link>

          {/* Main footer links - CHANGED TO SINGLE LINE - MADE THICKER */}
          <ul className="flex flex-wrap justify-center md:justify-end gap-y-4 text-sm text-black-500">
            <li className="px-4"><Link to="/for-designers" className="font-medium">For designers</Link></li>
            <li className="px-4"><Link to="/hiring" className="font-medium">Hire talent</Link></li>
            <li className="px-4"><Link to="/inspiration" className="font-medium">Inspiration</Link></li>
            <li className="px-4"><Link to="/advertise" className="font-medium">Advertising</Link></li>
            <li className="px-4"><Link to="/blog" className="font-medium">Blog</Link></li>
            <li className="px-4"><Link to="/about" className="font-medium">About</Link></li>
            <li className="px-4"><Link to="/careers" className="font-medium">Careers</Link></li>
            <li className="px-4"><Link to="/support" className="font-medium">Support</Link></li>
          </ul>

          {/* Social links */}
          <div className="flex space-x-4 mt-6 md:mt-0 text-black-500">
            <a href="https://twitter.com/wearmade" target="_blank" rel="noopener noreferrer">
              <Twitter size={20} />
              <span className="sr-only">Twitter</span>
            </a>
            <a href="https://facebook.com/wearmade" target="_blank" rel="noopener noreferrer">
              <Facebook size={20} />
              <span className="sr-only">Facebook</span>
            </a>
            <a href="https://instagram.com/wearmade" target="_blank" rel="noopener noreferrer">
              <Instagram size={20} />
              <span className="sr-only">Instagram</span>
            </a>
            <a href="https://github.com/wearmade" target="_blank" rel="noopener noreferrer">
              <Github size={20} />
              <span className="sr-only">GitHub</span>
            </a>
          </div>
        </div>

        {/* Bottom section with copyright and additional links - REDUCED GAP */}
        <div className="pt-6">
          <div className="flex flex-col md:flex-row justify-between text-sm text-gray-500">
            <ul className="flex flex-wrap justify-center md:justify-start gap-y-3 mb-4 md:mb-0">
              <li className="px-4 md:pl-0 md:pr-6">© {new Date().getFullYear()} WearMade</li>
              <li className="px-4 md:px-6"><Link to="/terms" className="hover:text-black transition-colors duration-200">Terms</Link></li>
              <li className="px-4 md:px-6"><Link to="/privacy" className="hover:text-black transition-colors duration-200">Privacy</Link></li>
              <li className="px-4 md:px-6"><Link to="/cookies" className="hover:text-black transition-colors duration-200">Cookies</Link></li>
            </ul>

            <ul className="flex flex-wrap justify-center md:justify-end gap-y-3">
              <li className="px-4 md:px-6"><Link to="/jobs" className="hover:text-black transition-colors duration-200">Jobs</Link></li>
              <li className="px-4 md:px-6"><Link to="/designers" className="hover:text-black transition-colors duration-200">Designers</Link></li>
              <li className="px-4 md:px-6"><Link to="/freelancers" className="hover:text-black transition-colors duration-200">Freelancers</Link></li>
              <li className="px-4 md:px-6"><Link to="/tags" className="hover:text-black transition-colors duration-200">Tags</Link></li>
              <li className="px-4 md:pr-0 md:pl-6"><Link to="/resources" className="hover:text-black transition-colors duration-200">Resources</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;