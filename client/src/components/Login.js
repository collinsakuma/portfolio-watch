import { useState } from 'react';
import Header from './Header';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import { Button } from 'semantic-ui-react';
import TickerHeader from './TickerHeader';

function Login() {
    const [showLogin, setShowLogin] = useState(true);
    return (
        <div>
            <Header />
            <TickerHeader/>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', backgroundColor: '#f2f2f2', border: '1px solid #ddd', borderRadius: '5px', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)'}}>
            {showLogin ? (
                <>
                    <LoginForm/>
                    <p style={{ margin: '10px 0', fontSize: '14px' }}>Don't have an account?</p>
                    <Button onClick={() => setShowLogin(false)} style={{marginBottom:"800px"}}>Sign Up</Button>
                </>
            ) : (
                <>
                    <SignUpForm/>
                    <p style={{ margin: '10px 0', fontSize: '14px' }}>Already have an account?</p>
                    <Button onClick={() => setShowLogin(true)} style={{marginBottom:"800px"}}>Login</Button>
                </>
            )}
            </div>
        </div>
    )
}
export default Login;