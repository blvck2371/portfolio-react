declare module "firebase/app" {
  export function initializeApp(options: object): unknown;
}

declare module "firebase/storage" {
  export function getStorage(app?: unknown): unknown;
  export function ref(storage: unknown, path: string): unknown;
  export function uploadBytes(ref: unknown, data: Blob | Uint8Array): Promise<unknown>;
  export function getDownloadURL(ref: unknown): Promise<string>;
}

declare module "firebase/auth" {
  export function getAuth(app?: unknown): unknown;
  export function signInWithEmailAndPassword(
    auth: unknown,
    email: string,
    password: string
  ): Promise<{ user: unknown }>;
  export function signOut(auth: unknown): Promise<void>;
  export function onAuthStateChanged(
    auth: unknown,
    cb: (user: unknown) => void
  ): () => void;
}

declare module "firebase/firestore" {
  export type DocumentSnapshot = {
    exists(): boolean;
    data(): Record<string, unknown> | undefined;
  };
  export type Transaction = {
    get(ref: unknown): Promise<DocumentSnapshot>;
    set(ref: unknown, data: object): void;
  };
  export function getFirestore(app?: unknown): unknown;
  export function getDoc(ref: unknown): Promise<DocumentSnapshot>;
  export function runTransaction(db: unknown, update: (tx: Transaction) => Promise<void>): Promise<void>;
  export function onSnapshot(
    ref: unknown,
    onNext: (snap: DocumentSnapshot) => void,
    onError?: (err: Error) => void
  ): () => void;
  export type Unsubscribe = () => void;
  export function collection(db: unknown, path: string): unknown;
  export function doc(db: unknown, path: string, ...pathSegments: string[]): unknown;
  export function getDocs(ref: unknown): Promise<{ docs: { id: string; data(): Record<string, unknown> }[] }>;
  export function addDoc(ref: unknown, data: object): Promise<{ id: string }>;
  export function setDoc(ref: unknown, data: object): Promise<void>;
  export function updateDoc(ref: unknown, data: object): Promise<void>;
  export function deleteDoc(ref: unknown): Promise<void>;
  export function serverTimestamp(): unknown;
  export function orderBy(field: string, direction?: string): unknown;
  export function query(ref: unknown, ...constraints: unknown[]): unknown;
}
