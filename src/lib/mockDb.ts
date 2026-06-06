import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src/lib/mock-db.json');

const initialData = {
  users: [] as any[],
  sessions: [] as any[],
  tasks: [] as any[],
  pomodoro_sessions: [] as any[]
};

function readDb() {
  try {
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
      return initialData;
    }
    const content = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    return initialData;
  }
}

function writeDb(data: typeof initialData) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to write mock db:', err);
  }
}

export const isMockEnabled = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-supabase-project') || 
  process.env.NEXT_PUBLIC_SUPABASE_URL === '';

export const mockDb = {
  findUserByEmail: async (email: string) => {
    const db = readDb();
    return db.users.find((u: any) => u.email === email) || null;
  },
  findUserById: async (id: number) => {
    const db = readDb();
    return db.users.find((u: any) => u.id === id) || null;
  },
  insertUser: async (userData: any) => {
    const db = readDb();
    const newUser = {
      ...userData,
      id: db.users.length > 0 ? Math.max(...db.users.map((u: any) => u.id)) + 1 : 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    db.users.push(newUser);
    writeDb(db);
    return newUser;
  },

  insertSession: async (sessionData: { token: string; user_id: number }) => {
    const db = readDb();
    const newSession = {
      id: db.sessions.length > 0 ? Math.max(...db.sessions.map((s: any) => s.id)) + 1 : 1,
      token: sessionData.token,
      user_id: Number(sessionData.user_id),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    db.sessions.push(newSession);
    writeDb(db);
    return newSession;
  },
  findSessionByToken: async (token: string) => {
    const db = readDb();
    return db.sessions.find((s: any) => s.token === token) || null;
  },
  deleteSessionByToken: async (token: string) => {
    const db = readDb();
    const session = db.sessions.find((s: any) => s.token === token);
    if (session) {
      db.sessions = db.sessions.filter((s: any) => s.token !== token);
      writeDb(db);
    }
    return session || null;
  },

  findTasksByUserId: async (userId: number) => {
    const db = readDb();
    return db.tasks.filter((t: any) => Number(t.user_id) === Number(userId))
      .sort((a: any, b: any) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  },
  findTaskByIdAndUserId: async (id: number, userId: number) => {
    const db = readDb();
    return db.tasks.find((t: any) => Number(t.id) === Number(id) && Number(t.user_id) === Number(userId)) || null;
  },
  insertTask: async (taskData: any) => {
    const db = readDb();
    const newTask = {
      ...taskData,
      id: db.tasks.length > 0 ? Math.max(...db.tasks.map((t: any) => t.id)) + 1 : 1,
      user_id: Number(taskData.user_id),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    db.tasks.push(newTask);
    writeDb(db);
    return newTask;
  },
  updateTask: async (id: number, userId: number, taskData: any) => {
    const db = readDb();
    const idx = db.tasks.findIndex((t: any) => Number(t.id) === Number(id) && Number(t.user_id) === Number(userId));
    if (idx === -1) throw new Error('Task not found');
    db.tasks[idx] = {
      ...db.tasks[idx],
      ...taskData,
      updated_at: new Date().toISOString()
    };
    writeDb(db);
    return db.tasks[idx];
  },
  deleteTask: async (id: number, userId: number) => {
    const db = readDb();
    const task = db.tasks.find((t: any) => Number(t.id) === Number(id) && Number(t.user_id) === Number(userId));
    if (task) {
      db.tasks = db.tasks.filter((t: any) => !(Number(t.id) === Number(id) && Number(t.user_id) === Number(userId)));
      writeDb(db);
    }
    return task || null;
  },

  insertPomodoroSession: async (sessionData: any) => {
    const db = readDb();
    const newSession = {
      ...sessionData,
      id: db.pomodoro_sessions.length > 0 ? Math.max(...db.pomodoro_sessions.map((s: any) => s.id)) + 1 : 1,
      user_id: Number(sessionData.user_id),
      task_id: sessionData.task_id ? Number(sessionData.task_id) : null,
      duration_minutes: Number(sessionData.duration_minutes),
      created_at: new Date().toISOString()
    };
    db.pomodoro_sessions.push(newSession);
    writeDb(db);
    return newSession;
  },
  findPomodoroSessionsByUserId: async (userId: number) => {
    const db = readDb();
    return db.pomodoro_sessions.filter((s: any) => Number(s.user_id) === Number(userId));
  }
};
