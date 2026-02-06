# NPK Validation Implementation

## 📋 Overview
Implementasi validasi NPK untuk memastikan input hanya berisi karakter alfanumerik dengan maksimal 8 digit.

## ✅ Validation Rules

### NPK Requirements:
- ✅ **Only alphanumeric**: Huruf (a-z, A-Z) dan angka (0-9) saja
- ✅ **Maximum length**: 8 karakter
- ✅ **Minimum length**: 1 karakter (required field)
- ✅ **Unique**: Tidak boleh duplikat (setiap NPK hanya bisa digunakan sekali)
- ❌ **No special characters**: Tidak boleh simbol, spasi, atau karakter khusus

### Valid Examples:
- ✅ `12345678`
- ✅ `ABC123`
- ✅ `A1B2C3D4`
- ✅ `TEST123`

### Invalid Examples:
- ❌ `123456789` (lebih dari 8 karakter)
- ❌ `ABC-123` (mengandung dash)
- ❌ `TEST 123` (mengandung spasi)
- ❌ `ABC@123` (mengandung simbol)

## 🎨 Frontend Validation

### File: `src/components/RegistrationForm.tsx`

**Implementation:**
```typescript
<input
  required
  type="text"
  value={formData.npk}
  onChange={(e) => {
    // Only allow alphanumeric, max 8 characters
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
    setFormData({ ...formData, npk: value });
  }}
  maxLength={8}
  pattern="[a-zA-Z0-9]{1,8}"
  placeholder="Max 8 karakter (huruf/angka)"
/>
```

**Features:**
- ✅ **Real-time filtering**: Karakter non-alfanumerik langsung dihapus saat user mengetik
- ✅ **Auto-truncate**: Input otomatis dipotong jika lebih dari 8 karakter
- ✅ **HTML5 pattern**: Browser validation sebagai fallback
- ✅ **Visual feedback**: Helper text menjelaskan aturan validasi

**User Experience:**
```
User types: "ABC-123@456789"
Auto-filtered to: "ABC123456" (8 chars max, no special chars)
```

## 🔒 Backend Validation

### File: `src/app/api/register/route.ts`

**Implementation:**
```typescript
// NPK Validation: only alphanumeric, max 8 characters
const npkRegex = /^[a-zA-Z0-9]{1,8}$/;
if (!npkRegex.test(npk)) {
    return NextResponse.json(
        { error: "NPK harus berisi huruf/angka saja, maksimal 8 karakter!" },
        { status: 400 }
    );
}
```

**Features:**
- ✅ **Regex validation**: Strict pattern matching
- ✅ **Error message**: Clear Indonesian error message
- ✅ **400 status code**: Proper HTTP error response
- ✅ **Security**: Prevents invalid data from reaching database

## 🚫 Duplicate NPK Prevention

### Database Level

**Schema: `prisma/schema.prisma`**
```prisma
model trn_register {
  id         Int      @id @default(autoincrement())
  name       String
  npk        String   @unique  // ← Unique constraint
  section    String
  attendance String
  createdAt  DateTime @default(now())
}
```

**Features:**
- ✅ **Unique constraint**: Database-level enforcement
- ✅ **Index created**: Automatic index for fast lookups
- ✅ **Guaranteed uniqueness**: Even if API check fails, database will reject

### API Level

**File: `src/app/api/register/route.ts`**

**Implementation:**
```typescript
// Check for duplicate NPK
const existingNPK = await prisma.trn_register.findUnique({
    where: { npk }
});

if (existingNPK) {
    return NextResponse.json(
        { error: "NPK sudah terdaftar! Gunakan NPK yang berbeda." },
        { status: 409 }
    );
}
```

**Error Handling:**
```typescript
catch (error: any) {
    // Handle Prisma unique constraint violation
    if (error.code === 'P2002') {
        return NextResponse.json(
            { error: "NPK sudah terdaftar! Gunakan NPK yang berbeda." },
            { status: 409 }
        );
    }
}
```

**Features:**
- ✅ **Pre-check**: Validate before attempting insert
- ✅ **409 Conflict**: Proper HTTP status for duplicates
- ✅ **Prisma error handling**: Catch P2002 (unique constraint violation)
- ✅ **User-friendly message**: Clear error in Indonesian
- ✅ **Double protection**: API check + database constraint

## 🧪 Test Cases

### Frontend Tests:
```javascript
// Test Case 1: Valid alphanumeric
Input: "ABC123"
Expected: "ABC123" ✅

// Test Case 2: Auto-filter special chars
Input: "ABC-123"
Expected: "ABC123" ✅

// Test Case 3: Max length enforcement
Input: "123456789"
Expected: "12345678" ✅

// Test Case 4: Mixed case
Input: "AbC123"
Expected: "AbC123" ✅

// Test Case 5: Only numbers
Input: "12345678"
Expected: "12345678" ✅

// Test Case 6: Only letters
Input: "ABCDEFGH"
Expected: "ABCDEFGH" ✅
```

### Backend Tests:
```javascript
// Test Case 1: Valid NPK
POST /api/register { npk: "ABC123" }
Expected: 200 OK ✅

// Test Case 2: Too long
POST /api/register { npk: "123456789" }
Expected: 400 Bad Request ✅

// Test Case 3: Special characters
POST /api/register { npk: "ABC-123" }
Expected: 400 Bad Request ✅

// Test Case 4: Empty
POST /api/register { npk: "" }
Expected: 400 Bad Request ✅
```

## 📊 Validation Flow

```
User Input → Frontend Filter → HTML5 Validation → API Request
                ↓                      ↓               ↓
        Remove non-alphanumeric   Pattern check   Regex validation
        Truncate to 8 chars       [a-zA-Z0-9]{1,8}  /^[a-zA-Z0-9]{1,8}$/
                ↓                      ↓               ↓
            Clean input           Browser check    Server check
                                                        ↓
                                                  Database Insert
```

## 🎯 Benefits

### User Experience:
- ✅ **Instant feedback**: User langsung tahu jika input salah
- ✅ **Auto-correction**: Tidak perlu manual delete karakter invalid
- ✅ **Clear guidance**: Helper text menjelaskan aturan
- ✅ **No frustration**: Tidak bisa submit form dengan NPK invalid

### Security:
- ✅ **Double validation**: Frontend + Backend
- ✅ **SQL injection prevention**: Hanya alfanumerik
- ✅ **Data consistency**: Semua NPK di database pasti valid
- ✅ **XSS prevention**: No special characters

### Data Quality:
- ✅ **Standardized format**: Semua NPK konsisten
- ✅ **Easy searching**: Alphanumeric only = simple queries
- ✅ **No edge cases**: Tidak ada spasi, dash, atau karakter aneh
- ✅ **Database optimization**: Fixed max length = better indexing

## 📝 Error Messages

### Frontend:
- Helper text: `*Hanya huruf dan angka, maksimal 8 karakter`
- Placeholder: `Max 8 karakter (huruf/angka)`

### Backend:
- Missing field: `Semua field harus diisi!`
- Invalid NPK: `NPK harus berisi huruf/angka saja, maksimal 8 karakter!`

## 🚀 Implementation Summary

| Layer | Method | Validation |
|-------|--------|------------|
| **Frontend** | Real-time filter | `replace(/[^a-zA-Z0-9]/g, '').slice(0, 8)` |
| **HTML5** | Pattern attribute | `pattern="[a-zA-Z0-9]{1,8}"` |
| **Backend** | Regex test | `/^[a-zA-Z0-9]{1,8}$/` |

## ✅ Checklist

- [x] Frontend real-time validation
- [x] HTML5 pattern validation
- [x] Backend regex validation
- [x] Error messages (ID)
- [x] Helper text for users
- [x] API documentation updated
- [x] Build successful
- [x] Production ready

## 🎉 Result

NPK validation sekarang **fully implemented** dengan:
- ✅ Real-time filtering di frontend
- ✅ Double validation (client + server)
- ✅ Clear user feedback
- ✅ Security & data quality guaranteed
