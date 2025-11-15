import React, { useState } from 'react';
import { useApp } from '../App';

const LoginPage: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nickname && !phone) {
      setError('Please enter nickname or phone number.');
      return;
    }

    // Sanitize phone number to allow for formats like '+86 123-4567-8901'
    const sanitizedPhone = phone.trim().replace(/[\s-]/g, '').replace(/^\+86/, '');

    if (login(nickname, sanitizedPhone)) {
      // Login successful
      return;
    }
    
    // Attempt registration
    const phoneRegex = /^1\d{10}$/;
    if (!nickname) {
        setError('Nickname is required to register.');
        return;
    }
    if (!phoneRegex.test(sanitizedPhone)) {
        setError('A valid 11-digit mobile number is required to register.');
        return;
    }

    if (register(nickname, sanitizedPhone)) {
      // Registration successful
    } else {
      setError('This nickname or phone number is already taken.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900/50">
      <div className="w-full max-w-md p-8 space-y-8 bg-surface rounded-xl shadow-lg border border-gray-700">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-on-surface">
            疑问与探讨点这里
          </h2>
          <p className="mt-2 text-center text-sm text-on-surface-secondary">
            为了让提出的问题有连续性，请首次登录时进行注册。只需要填写昵称和手机号即可。再次登录时，只需要填写昵称或手机号即可。
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="nickname" className="sr-only">Nickname</label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-600 bg-background placeholder-gray-500 text-on-surface rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Nickname"
              />
            </div>
            <div>
              <label htmlFor="phone" className="sr-only">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-600 bg-background placeholder-gray-500 text-on-surface rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Phone Number"
              />
            </div>
          </div>

          {error && <p className="text-sm text-danger text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-150 ease-in-out"
            >
              Enter Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;