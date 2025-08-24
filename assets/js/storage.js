import { auth } from './auth.js';

const KEY = 'casino.users';
const SESSION = 'casino.session';

export class Storage {
  static _read() { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  static _write(v){ localStorage.setItem(KEY, JSON.stringify(v)); }

  static seed() {
    const users = Storage._read();
    if (!users.find(u => u.username === 'admin')) {
      users.push({
        username: 'admin',
        passwordHash: 'seed', // overwritten next line
        role: 'admin',
        balance: 0
      });
      localStorage.setItem(KEY, JSON.stringify(users));
    }
    // ensure admin has a hash for 'admin123'
    (async () => {
      const u = Storage.getUser('admin');
      if (u && u.passwordHash === 'seed') {
        u.passwordHash = await auth.hash('admin123');
        Storage.updateUser('admin', u);
      }
    })();
  }

  static listUsers(){ return Storage._read(); }

  static getUser(username){
    return Storage._read().find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
  }

  static async createUser({ username, password, balance=0, role='player' }) {
    if (Storage.getUser(username)) throw new Error('Username already exists.');
    const passwordHash = await auth.hash(password);
    const users = Storage._read();
    users.push({ username, passwordHash, role, balance: Math.floor(balance) });
    Storage._write(users);
    return true;
  }

  static updateUser(username, patch){
    const users = Storage._read();
    const i = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
    if (i === -1) return false;
    users[i] = { ...users[i], ...patch };
    Storage._write(users);
    return true;
  }

  static deleteUser(username){
    const users = Storage._read().filter(u => u.username.toLowerCase() !== username.toLowerCase());
    Storage._write(users);
  }

  static setSession(username){ localStorage.setItem(SESSION, username); }
  static clearSession(){ localStorage.removeItem(SESSION); }
  static getSession(){ return localStorage.getItem(SESSION); }
}
