# TechnoDay API Documentation

## Public Endpoints

### 1. Register Participant
**POST** `/api/register`

Register a new participant and their anonymous comment.

**Request Body:**
```json
{
  "name": "John Doe",
  "npk": "12345678",
  "section": "IT Department",
  "attendance": "Hadir",
  "comment": "Semoga acara sukses!"
}
```

**Validation Rules:**
- `npk`: Only alphanumeric characters (a-z, A-Z, 0-9), maximum 8 characters
- `npk`: Must be unique (no duplicates allowed)
- All fields are required

**Response (Success):**
```json
{
  "success": true,
  "id": 1
}
```

**Response (Error - Missing Fields):**
```json
{
  "error": "Semua field harus diisi!"
}
```

**Response (Error - Invalid NPK):**
```json
{
  "error": "NPK harus berisi huruf/angka saja, maksimal 8 karakter!"
}
```

**Response (Error - Duplicate NPK):**
```json
{
  "error": "NPK sudah terdaftar! Gunakan NPK yang berbeda."
}
```

---

### 2. Get Participants List
**GET** `/api/participants`

Get list of all registered participants (without comments).

**Response:**
```json
{
  "total": 10,
  "participants": [
    {
      "id": 1,
      "name": "John Doe",
      "npk": "12345678",
      "section": "IT Department",
      "attendance": "Hadir",
      "createdAt": "2026-02-06T07:36:15.843Z"
    }
  ]
}
```

---

### 3. Get Shuffled Comments
**GET** `/api/comments/shuffle`

Get all anonymous comments in random shuffled order (for shuffle card feature).

**Response:**
```json
[
  {
    "id": 5,
    "content": "Semoga acara sukses!",
    "createdAt": "2026-02-06T07:36:15.843Z"
  },
  {
    "id": 2,
    "content": "Ramadhan penuh berkah!",
    "createdAt": "2026-02-06T07:35:10.123Z"
  }
]
```

---

## Admin Endpoints (Requires Authentication)

### 4. Admin Login
**POST** `/api/auth`

Login as admin.

**Request Body:**
```json
{
  "password": "technoday-ramadhan"
}
```

**Response (Success):**
```json
{
  "success": true
}
```

**Response (Error):**
```json
{
  "error": "Password salah!"
}
```

---

### 5. Admin Logout
**DELETE** `/api/auth`

Logout from admin session.

**Response:**
```json
{
  "success": true
}
```

---

### 6. Get Admin Data
**GET** `/api/admin/data`

Get all participants data (admin only).

**Headers:**
- Cookie: `admin_token=authorized`

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "npk": "12345678",
    "section": "IT Department",
    "attendance": "Hadir",
    "createdAt": "2026-02-06T07:36:15.843Z"
  }
]
```

**Response (Unauthorized):**
```json
{
  "error": "Unauthorized"
}
```

---

## Database Seeding

### Seed Database
```bash
npx prisma db seed
```

Creates default admin user:
- Username: `admin`
- Password: `technoday-ramadhan` (hashed with bcrypt)

---

## Notes

- All comments are **completely anonymous** - no link to registration records
- Comments are shuffled server-side for the shuffle card feature
- Admin authentication uses HttpOnly cookies for security
- Passwords are hashed using bcrypt (salt rounds: 10)
