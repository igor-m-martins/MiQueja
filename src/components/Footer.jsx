import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="w-full bg-gray-50 text-gray-600 py-8 border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Copyright and credits */}
        <div className="text-center md:text-left text-sm tracking-wide"> 
          Un proyecto desarrollado por{" "}
          <a 
            href="https://igor-m-martins.github.io/" 
            className="text-blue-600 font-semibold hover:text-blue-800 hover:underline transition-colors duration-200" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Igor Martins
          </a>
          <br/>
          © 2025 MiQueja
        </div>

        {/* Secondary navigation links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
          <Link 
            to="/terms" 
            className="hover:text-gray-900 hover:underline transition-colors duration-200"
          >
            Términos y Condiciones
          </Link> 
          <Link 
            to="/about" 
            className="hover:text-gray-900 hover:underline transition-colors duration-200"
          >
            Sobre Nosotros
          </Link>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
