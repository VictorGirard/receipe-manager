import axios from 'axios';
import { MD5 } from 'crypto-js';
import Cookies from 'js-cookie';

const BASE_URL = `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}`;
const USERS_TABLE_ID = import.meta.env.VITE_AIRTABLE_USERS_TABLE_ID;
const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes en millisecondes
const COOKIE_NAME = 'auth_session';

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

interface Session {
  user: User;
  expiresAt: number;
}

const hashPassword = (password: string): string => {
  return MD5(password).toString();
};

export const login = async (email: string, password: string): Promise<User | null> => {
  try {
    const hashedPassword = hashPassword(password);
    const response = await axios.get(`${BASE_URL}/${USERS_TABLE_ID}`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_TOKEN}`,
      },
      params: {
        filterByFormula: `AND({email} = '${email}', {password} = '${hashedPassword}')`,
      },
    });

    if (response.data.records.length > 0) {
      const user = response.data.records[0].fields;
      return {
        id: response.data.records[0].id,
        email: user.email,
        password: user.password,
        name: user.name,
      };
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return null;
  }
};

export const register = async (email: string, password: string, name: string): Promise<User | null> => {
  try {
    const hashedPassword = hashPassword(password);
    const response = await axios.post(
      `${BASE_URL}/${USERS_TABLE_ID}`,
      {
        fields: {
          email,
          password: hashedPassword,
          name,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const user = response.data.fields;
    return {
      id: response.data.id,
      email: user.email,
      password: user.password,
      name: user.name,
    };
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return null;
  }
};

export const saveSession = (user: User) => {
  const session: Session = {
    user,
    expiresAt: Date.now() + SESSION_TIMEOUT,
  };
  Cookies.set(COOKIE_NAME, JSON.stringify(session), {
    expires: new Date(Date.now() + SESSION_TIMEOUT),
    secure: true,
    sameSite: 'strict',
  });
};

export const getSession = (): User | null => {
  const sessionStr = Cookies.get(COOKIE_NAME);
  if (!sessionStr) return null;

  try {
    const session: Session = JSON.parse(sessionStr);
    if (Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }
    return session.user;
  } catch (error) {
    clearSession();
    return null;
  }
};

export const clearSession = () => {
  Cookies.remove(COOKIE_NAME);
}; 