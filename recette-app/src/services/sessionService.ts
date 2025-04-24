import Cookies from 'js-cookie';

const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes en millisecondes
const COOKIE_NAME = 'auth_session';

interface User {
  id: string;
  email: string;
  name: string;
}

interface Session {
  user: User;
  expiresAt: number;
}

export const saveSession = (user: User) => {
  const session: Session = {
    user,
    expiresAt: Date.now() + SESSION_TIMEOUT,
  };
  
  // Définir le cookie avec une date d'expiration plus longue (1 jour)
  Cookies.set(COOKIE_NAME, JSON.stringify(session), {
    expires: 1, // 1 jour
    secure: true,
    sameSite: 'strict',
    path: '/',
  });
};

export const getSession = async (): Promise<User | null> => {
  try {
    const sessionStr = Cookies.get(COOKIE_NAME);
    if (!sessionStr) return null;

    const session: Session = JSON.parse(sessionStr);
    
    // Vérifier si la session a expiré
    if (Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }

    // Renouveler la session si elle est encore valide
    saveSession(session.user);
    return session.user;
  } catch (error) {
    clearSession();
    return null;
  }
};

export const clearSession = () => {
  Cookies.remove(COOKIE_NAME, { path: '/' });
}; 