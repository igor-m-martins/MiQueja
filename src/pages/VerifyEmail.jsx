import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { buildUrl } from '../utils/api';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        if (token) {
                // Redirect the browser fully to the backend to process the verification HTML
                window.location.href = buildUrl(`verify-email?token=${token}`);
        }
    }, [token]);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
            <p>Redirecionando e verificando seu e-mail, por favor aguarde...</p>
        </div>
    );
}