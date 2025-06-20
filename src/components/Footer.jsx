
import { Link } from "react-router-dom";

function Footer(){
    return (
    <footer className="text-center text-sm text-gray-500 py-4 border-t">
    © 2025 MiQueja - Un proyecto desarrollado por <Link to="https://igor-m-martins.github.io/" className="text-blue-600 font-semibold" target="_blank">Igor Martins</Link>
    </footer>
    );
}

export default Footer