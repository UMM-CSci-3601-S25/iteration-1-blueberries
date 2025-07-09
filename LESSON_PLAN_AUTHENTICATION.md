# Comprehensive Lesson Plan: Secure Authentication

## Course Information
- **Duration**: 3-4 hours (with hands-on lab time)
- **Level**: Intermediate
- **Prerequisites**: Basic knowledge of web development, HTTP, and databases

---

## Learning Objectives

By the end of this lesson, students will be able to:
1. Understand the importance of secure authentication in web applications
2. Implement local authentication using username/password with bcrypt hashing
3. Implement and manage JWT (JSON Web Tokens) for session management
4. Set up Google OAuth 2.0 authentication
5. Apply security best practices for authentication systems
6. Properly manage secrets and environment variables
7. Create secure frontend and backend authentication components

---

## Table of Contents

1. [Introduction to Authentication](#1-introduction-to-authentication)
2. [Technology Stack Overview](#2-technology-stack-overview)
3. [Authentication Approaches](#3-authentication-approaches)
4. [Google OAuth 2.0 Setup](#4-google-oauth-20-setup)
5. [Secret Management Best Practices](#5-secret-management-best-practices)
6. [Backend Implementation](#6-backend-implementation)
7. [Frontend Implementation](#7-frontend-implementation)
8. [Security Best Practices](#8-security-best-practices)
9. [Testing Authentication](#9-testing-authentication)
10. [Recap and Further Resources](#10-recap-and-further-resources)

---

## 1. Introduction to Authentication

### What is Authentication?
Authentication is the process of verifying the identity of a user, device, or system. It answers the question "Who are you?"

### Why is Authentication Important?
- **Data Protection**: Protects sensitive user data and application resources
- **User Privacy**: Ensures users can only access their own data
- **Compliance**: Many regulations (GDPR, HIPAA, etc.) require proper authentication
- **Trust**: Users trust applications that properly protect their information
- **Business Logic**: Many features depend on knowing who the user is

### Authentication vs. Authorization
- **Authentication**: "Who are you?" (Login process)
- **Authorization**: "What are you allowed to do?" (Permissions/roles)

### Common Authentication Vulnerabilities
- Weak passwords
- Password storage in plain text
- Session hijacking
- Cross-Site Request Forgery (CSRF)
- Insufficient session management
- Brute force attacks

---

## 2. Technology Stack Overview

### Frontend: Angular 20
- **TypeScript-based** framework for building dynamic web applications
- **Component-based** architecture with services for business logic
- **RxJS** for reactive programming and HTTP handling
- **Angular Material** for UI components
- **Route Guards** for protecting routes based on authentication state

### Backend: Javalin with Java 21
- **Javalin**: Lightweight web framework for Java/Kotlin
- **Java 21**: Latest LTS version with modern language features
- **RESTful API** design for authentication endpoints
- **Middleware** for request processing and authentication

### Database: MongoDB
- **NoSQL document database** for flexible data storage
- **User collections** for storing authentication data
- **Indexing** for efficient user lookups
- **GridFS** for storing large files (if needed)

### Build Tool: Gradle
- **Dependency management** for Java libraries
- **Build automation** and testing integration
- **Environment-specific** builds and configurations

---

## 3. Authentication Approaches

### 3.1 Local Authentication (Username/Password)

#### Components:
1. **User Registration**: Create new user accounts
2. **Password Hashing**: Use bcrypt for secure password storage
3. **User Login**: Verify credentials against stored data
4. **Session Management**: Use JWT tokens for maintaining login state

#### Password Security with bcrypt:
```java
// Example bcrypt usage in Java
import org.mindrot.jbcrypt.BCrypt;

public class PasswordUtils {
    // Hash a password
    public static String hashPassword(String plainTextPassword) {
        return BCrypt.hashpw(plainTextPassword, BCrypt.gensalt());
    }
    
    // Verify a password
    public static boolean verifyPassword(String plainTextPassword, String hashedPassword) {
        return BCrypt.checkpw(plainTextPassword, hashedPassword);
    }
}
```

### 3.2 JWT (JSON Web Tokens)

#### What are JWTs?
- Self-contained tokens that carry user information
- Stateless authentication mechanism
- Three parts: Header, Payload, Signature

#### JWT Structure:
```
header.payload.signature
```

#### Benefits:
- **Stateless**: No need to store sessions on the server
- **Scalable**: Works well in distributed systems
- **Cross-domain**: Can be used across different domains
- **Self-contained**: Contains all necessary information

#### JWT Best Practices:
- Use strong secrets for signing
- Set appropriate expiration times
- Include only necessary claims
- Validate tokens on every request

### 3.3 OAuth 2.0 with Google

#### What is OAuth 2.0?
- Authorization framework for third-party authentication
- Allows users to grant access without sharing passwords
- Industry standard for secure delegated access

#### OAuth 2.0 Flow:
1. User clicks "Login with Google"
2. Application redirects to Google's authorization server
3. User logs in with Google credentials
4. Google redirects back with authorization code
5. Application exchanges code for access token
6. Application uses token to get user information

---

## 4. Google OAuth 2.0 Setup

### Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   
2. **Create New Project**
   - Click "Select a project" → "New Project"
   - Enter project name: "YourApp-Auth"
   - Click "Create"

3. **Enable Google's Identity Toolkit API**
   - Go to "APIs & Services" → "Library"
   - Search for "Identity Toolkit API"
   - Click "Enable"

### Step 2: Configure OAuth Consent Screen

1. **Go to OAuth Consent Screen**
   - Navigate to "APIs & Services" → "OAuth consent screen"
   
2. **Choose User Type**
   - Select "External" for public applications
   - Select "Internal" for organization-only apps
   
3. **Fill Required Information**
   - App name: Your application name
   - User support email: Your email
   - Developer contact information: Your email
   
4. **Add Scopes**
   - Add scopes: `email`, `profile`, `openid`

### Step 3: Create OAuth 2.0 Credentials

1. **Go to Credentials**
   - Navigate to "APIs & Services" → "Credentials"
   
2. **Create Credentials**
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   
3. **Configure Application Type**
   - Application type: "Web application"
   - Name: "YourApp Web Client"
   
4. **Set Authorized URIs**
   - **Authorized JavaScript origins**:
     - `http://localhost:4200` (for development)
     - `https://yourdomain.com` (for production)
   
   - **Authorized redirect URIs**:
     - `http://localhost:4200/auth/callback` (for development)
     - `https://yourdomain.com/auth/callback` (for production)

5. **Save and Download**
   - Click "Create"
   - Download the JSON file with your credentials
   - **NEVER commit this file to version control**

### Step 4: Extract Credentials

From the downloaded JSON file, you'll need:
- **Client ID**: Used in frontend code
- **Client Secret**: Used in backend code (keep secure!)

Example structure:
```json
{
  "web": {
    "client_id": "your-client-id.googleusercontent.com",
    "client_secret": "your-client-secret",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token"
  }
}
```

---

## 5. Secret Management Best Practices

### 5.1 Environment Variables

#### Never commit secrets to version control!

#### Backend (Java/Javalin)
Create `server/.env` file:
```env
# Database Configuration
MONGO_DB_URL=mongodb://localhost:27017/yourapp
MONGO_DB_NAME=yourapp

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRATION_TIME=86400000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Server Configuration
PORT=4567
CORS_ORIGIN=http://localhost:4200
```

#### Frontend (Angular)
Create environment files:

`client/src/environments/environment.ts` (development):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4567/api/',
  googleClientId: 'your-google-client-id'
};
```

`client/src/environments/environment.prod.ts` (production):
```typescript
export const environment = {
  production: true,
  apiUrl: '/api/',
  googleClientId: 'your-google-client-id'
};
```

### 5.2 .gitignore Configuration

Ensure your `.gitignore` includes:
```gitignore
# Environment files
.env
.env.local
.env.production

# Google OAuth credentials
google-oauth-credentials.json
client-secret.json

# IDE files
.vscode/settings.json
.idea/

# Dependency directories
node_modules/
.gradle/
build/
```

### 5.3 Production Secret Management

#### For Production Deployment:
1. **Use Environment Variables**: Set secrets as environment variables on your server
2. **Use Secret Management Services**: AWS Secrets Manager, Azure Key Vault, etc.
3. **Use Docker Secrets**: For containerized applications
4. **Use CI/CD Pipeline Secrets**: GitHub Secrets, GitLab CI Variables

#### Example Docker Compose:
```yaml
version: '3.8'
services:
  app:
    build: .
    environment:
      - JWT_SECRET=${JWT_SECRET}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
    env_file:
      - .env
```

---

## 6. Backend Implementation

### 6.1 Dependencies (build.gradle)

Add required dependencies:
```gradle
dependencies {
    // Existing dependencies...
    
    // Authentication
    implementation 'io.jsonwebtoken:jjwt-api:0.12.5'
    implementation 'io.jsonwebtoken:jjwt-impl:0.12.5'
    implementation 'io.jsonwebtoken:jjwt-jackson:0.12.5'
    
    // Password hashing
    implementation 'org.mindrot:jbcrypt:0.4'
    
    // HTTP client for OAuth
    implementation 'com.squareup.okhttp3:okhttp:4.12.0'
    
    // Environment variables
    implementation 'io.github.cdimascio:dotenv-java:3.0.0'
}
```

### 6.2 User Model

```java
// User.java
public class User {
    @MongoId
    public String _id;
    
    public String username;
    public String email;
    public String passwordHash;
    public String firstName;
    public String lastName;
    public String googleId; // For OAuth users
    public Date createdAt;
    public Date lastLogin;
    public boolean isActive;
    
    // Constructors, getters, setters...
}
```

### 6.3 Authentication Service

```java
// AuthService.java
import io.jsonwebtoken.*;
import org.mindrot.jbcrypt.BCrypt;

public class AuthService {
    private final MongoCollection<User> userCollection;
    private final String jwtSecret;
    private final long jwtExpiration;
    
    public AuthService(MongoDatabase database) {
        this.userCollection = JacksonMongoCollection.builder()
            .build(database, "users", User.class, UuidRepresentation.STANDARD);
        this.jwtSecret = System.getenv("JWT_SECRET");
        this.jwtExpiration = Long.parseLong(System.getenv("JWT_EXPIRATION_TIME"));
    }
    
    // Register new user
    public User registerUser(String username, String email, String password) {
        // Check if user already exists
        if (findUserByEmail(email) != null) {
            throw new IllegalArgumentException("User already exists");
        }
        
        // Hash password
        String passwordHash = BCrypt.hashpw(password, BCrypt.gensalt());
        
        // Create user
        User user = new User();
        user.username = username;
        user.email = email;
        user.passwordHash = passwordHash;
        user.createdAt = new Date();
        user.isActive = true;
        
        userCollection.insertOne(user);
        return user;
    }
    
    // Authenticate user
    public User authenticateUser(String email, String password) {
        User user = findUserByEmail(email);
        if (user == null || !BCrypt.checkpw(password, user.passwordHash)) {
            return null;
        }
        
        // Update last login
        user.lastLogin = new Date();
        userCollection.replaceOne(eq("_id", user._id), user);
        
        return user;
    }
    
    // Generate JWT token
    public String generateToken(User user) {
        return Jwts.builder()
            .setSubject(user._id)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
            .claim("email", user.email)
            .claim("username", user.username)
            .signWith(SignatureAlgorithm.HS256, jwtSecret)
            .compact();
    }
    
    // Validate JWT token
    public User validateToken(String token) {
        try {
            Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody();
                
            String userId = claims.getSubject();
            return findUserById(userId);
        } catch (JwtException e) {
            return null;
        }
    }
    
    private User findUserByEmail(String email) {
        return userCollection.find(eq("email", email)).first();
    }
    
    private User findUserById(String id) {
        return userCollection.find(eq("_id", id)).first();
    }
}
```

### 6.4 Authentication Controller

```java
// AuthController.java
public class AuthController implements Controller {
    private final AuthService authService;
    private final GoogleOAuthService googleOAuthService;
    
    public AuthController(MongoDatabase database) {
        this.authService = new AuthService(database);
        this.googleOAuthService = new GoogleOAuthService();
    }
    
    // POST /api/auth/register
    public void register(Context ctx) {
        try {
            RegisterRequest request = ctx.bodyAsClass(RegisterRequest.class);
            
            // Validate input
            if (request.email == null || !isValidEmail(request.email)) {
                ctx.status(400).json(Map.of("error", "Invalid email"));
                return;
            }
            
            if (request.password == null || request.password.length() < 8) {
                ctx.status(400).json(Map.of("error", "Password must be at least 8 characters"));
                return;
            }
            
            User user = authService.registerUser(request.username, request.email, request.password);
            String token = authService.generateToken(user);
            
            ctx.json(Map.of(
                "token", token,
                "user", sanitizeUser(user)
            ));
            
        } catch (IllegalArgumentException e) {
            ctx.status(409).json(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            ctx.status(500).json(Map.of("error", "Internal server error"));
        }
    }
    
    // POST /api/auth/login
    public void login(Context ctx) {
        try {
            LoginRequest request = ctx.bodyAsClass(LoginRequest.class);
            
            User user = authService.authenticateUser(request.email, request.password);
            if (user == null) {
                ctx.status(401).json(Map.of("error", "Invalid credentials"));
                return;
            }
            
            String token = authService.generateToken(user);
            
            ctx.json(Map.of(
                "token", token,
                "user", sanitizeUser(user)
            ));
            
        } catch (Exception e) {
            ctx.status(500).json(Map.of("error", "Internal server error"));
        }
    }
    
    // POST /api/auth/google
    public void googleAuth(Context ctx) {
        try {
            GoogleAuthRequest request = ctx.bodyAsClass(GoogleAuthRequest.class);
            
            // Exchange authorization code for access token
            GoogleUserInfo userInfo = googleOAuthService.getUserInfo(request.authorizationCode);
            
            // Find or create user
            User user = authService.findOrCreateGoogleUser(userInfo);
            String token = authService.generateToken(user);
            
            ctx.json(Map.of(
                "token", token,
                "user", sanitizeUser(user)
            ));
            
        } catch (Exception e) {
            ctx.status(500).json(Map.of("error", "Google authentication failed"));
        }
    }
    
    // GET /api/auth/me
    public void getCurrentUser(Context ctx) {
        User user = (User) ctx.attribute("user");
        ctx.json(sanitizeUser(user));
    }
    
    @Override
    public void addRoutes(Javalin server) {
        server.post("/api/auth/register", this::register);
        server.post("/api/auth/login", this::login);
        server.post("/api/auth/google", this::googleAuth);
        server.get("/api/auth/me", this::getCurrentUser);
    }
    
    private Map<String, Object> sanitizeUser(User user) {
        // Remove sensitive information
        return Map.of(
            "_id", user._id,
            "username", user.username,
            "email", user.email,
            "firstName", user.firstName != null ? user.firstName : "",
            "lastName", user.lastName != null ? user.lastName : ""
        );
    }
    
    private boolean isValidEmail(String email) {
        return email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
    }
}
```

### 6.5 JWT Middleware

```java
// JWTMiddleware.java
public class JWTMiddleware {
    private final AuthService authService;
    
    public JWTMiddleware(AuthService authService) {
        this.authService = authService;
    }
    
    public void authenticate(Context ctx) throws Exception {
        String authHeader = ctx.header("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            ctx.status(401).json(Map.of("error", "Missing or invalid authorization header"));
            return;
        }
        
        String token = authHeader.substring(7); // Remove "Bearer " prefix
        User user = authService.validateToken(token);
        
        if (user == null) {
            ctx.status(401).json(Map.of("error", "Invalid or expired token"));
            return;
        }
        
        // Set user in context for use in route handlers
        ctx.attribute("user", user);
    }
}
```

### 6.6 Google OAuth Service

```java
// GoogleOAuthService.java
import okhttp3.*;
import com.fasterxml.jackson.databind.ObjectMapper;

public class GoogleOAuthService {
    private final OkHttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final String clientId;
    private final String clientSecret;
    
    public GoogleOAuthService() {
        this.httpClient = new OkHttpClient();
        this.objectMapper = new ObjectMapper();
        this.clientId = System.getenv("GOOGLE_CLIENT_ID");
        this.clientSecret = System.getenv("GOOGLE_CLIENT_SECRET");
    }
    
    public GoogleUserInfo getUserInfo(String authorizationCode) throws Exception {
        // Exchange authorization code for access token
        String accessToken = exchangeCodeForToken(authorizationCode);
        
        // Use access token to get user info
        return fetchUserInfo(accessToken);
    }
    
    private String exchangeCodeForToken(String authorizationCode) throws Exception {
        RequestBody formBody = new FormBody.Builder()
            .add("code", authorizationCode)
            .add("client_id", clientId)
            .add("client_secret", clientSecret)
            .add("redirect_uri", "http://localhost:4200/auth/callback")
            .add("grant_type", "authorization_code")
            .build();
            
        Request request = new Request.Builder()
            .url("https://oauth2.googleapis.com/token")
            .post(formBody)
            .build();
            
        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new Exception("Failed to exchange authorization code");
            }
            
            String responseBody = response.body().string();
            Map<String, Object> tokenResponse = objectMapper.readValue(responseBody, Map.class);
            return (String) tokenResponse.get("access_token");
        }
    }
    
    private GoogleUserInfo fetchUserInfo(String accessToken) throws Exception {
        Request request = new Request.Builder()
            .url("https://www.googleapis.com/oauth2/v2/userinfo")
            .addHeader("Authorization", "Bearer " + accessToken)
            .build();
            
        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new Exception("Failed to fetch user info");
            }
            
            String responseBody = response.body().string();
            return objectMapper.readValue(responseBody, GoogleUserInfo.class);
        }
    }
}

// GoogleUserInfo.java
public class GoogleUserInfo {
    public String id;
    public String email;
    public String name;
    public String given_name;
    public String family_name;
    public String picture;
}
```

---

## 7. Frontend Implementation

### 7.1 Authentication Service (Angular)

```typescript
// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check for existing token on service initialization
    this.checkAuthState();
  }

  // Register new user
  register(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}auth/register`, {
      username,
      email,
      password
    }).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  // Login user
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}auth/login`, {
      email,
      password
    }).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  // Google OAuth login
  googleLogin(authorizationCode: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}auth/google`, {
      authorizationCode
    }).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  // Logout user
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
  }

  // Get current user
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}auth/me`);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.getToken() !== null && this.currentUserSubject.value !== null;
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Get current user value
  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    this.currentUserSubject.next(response.user);
  }

  private checkAuthState(): void {
    const token = this.getToken();
    if (token) {
      // Validate token with server
      this.getCurrentUser().pipe(
        catchError(() => {
          this.logout();
          return of(null);
        })
      ).subscribe(user => {
        if (user) {
          this.currentUserSubject.next(user);
        }
      });
    }
  }
}
```

### 7.2 HTTP Interceptor for JWT

```typescript
// auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    
    if (token) {
      // Clone the request and add authorization header
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(authReq);
    }
    
    return next.handle(req);
  }
}

// Register in main.ts
import { HTTP_INTERCEPTORS } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    // ... other providers
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
});
```

### 7.3 Login Component

```typescript
// login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
        },
        error: (error) => {
          this.loading = false;
          this.snackBar.open(error.error?.error || 'Login failed', 'Close', { duration: 5000 });
        }
      });
    }
  }

  loginWithGoogle(): void {
    // Initialize Google OAuth
    this.initializeGoogleAuth();
  }

  private initializeGoogleAuth(): void {
    // Load Google APIs
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api:client.js';
    script.onload = () => {
      gapi.load('auth2', () => {
        gapi.auth2.init({
          client_id: environment.googleClientId
        }).then(() => {
          const authInstance = gapi.auth2.getAuthInstance();
          authInstance.signIn().then((googleUser: any) => {
            const authCode = googleUser.getAuthResponse().code;
            this.authService.googleLogin(authCode).subscribe({
              next: () => {
                this.router.navigate(['/dashboard']);
                this.snackBar.open('Google login successful!', 'Close', { duration: 3000 });
              },
              error: (error) => {
                this.snackBar.open('Google login failed', 'Close', { duration: 5000 });
              }
            });
          });
        });
      });
    };
    document.head.appendChild(script);
  }
}
```

```html
<!-- login.component.html -->
<div class="login-container">
  <mat-card class="login-card">
    <mat-card-header>
      <mat-card-title>Login</mat-card-title>
    </mat-card-header>
    
    <mat-card-content>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <mat-form-field class="full-width">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" required>
          <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
            Email is required
          </mat-error>
          <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
            Please enter a valid email
          </mat-error>
        </mat-form-field>

        <mat-form-field class="full-width">
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password" required>
          <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
            Password is required
          </mat-error>
          <mat-error *ngIf="loginForm.get('password')?.hasError('minlength')">
            Password must be at least 8 characters
          </mat-error>
        </mat-form-field>

        <div class="button-container">
          <button mat-raised-button color="primary" type="submit" 
                  [disabled]="!loginForm.valid || loading">
            <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
            Login
          </button>
          
          <button mat-button type="button" (click)="loginWithGoogle()" 
                  [disabled]="loading">
            <mat-icon>account_circle</mat-icon>
            Login with Google
          </button>
        </div>
      </form>
    </mat-card-content>
    
    <mat-card-actions>
      <p>Don't have an account? <a routerLink="/register">Register here</a></p>
    </mat-card-actions>
  </mat-card>
</div>
```

### 7.4 Route Guards

```typescript
// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

// guest.guard.ts (redirect logged-in users away from login/register)
@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}
```

### 7.5 Route Configuration

```typescript
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { GuestGuard } from './auth/guest.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [GuestGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

---

## 8. Security Best Practices

### 8.1 HTTPS Configuration

#### Production Deployment
```java
// Server.java - Configure HTTPS
public class Server {
    private Javalin configureJavalin() {
        return Javalin.create(config -> {
            // Enable HTTPS in production
            if (isProduction()) {
                config.useVirtualThreads = true;
                config.showJavalinBanner = false;
            }
            
            // Configure CORS
            config.bundledPlugins.enableCors(cors -> {
                cors.addRule(it -> {
                    it.allowHost("yourdomain.com", "www.yourdomain.com");
                    it.allowCredentials = true;
                    it.allowedMethods.addAll(Arrays.asList(
                        HandlerType.GET, HandlerType.POST, 
                        HandlerType.PUT, HandlerType.DELETE, 
                        HandlerType.OPTIONS
                    ));
                });
            });
        });
    }
}
```

#### Nginx Configuration for HTTPS
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    location / {
        proxy_pass http://localhost:4567;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 8.2 Input Validation

#### Backend Validation
```java
// InputValidator.java
public class InputValidator {
    private static final Pattern EMAIL_PATTERN = 
        Pattern.compile("^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$");
    
    private static final Pattern USERNAME_PATTERN = 
        Pattern.compile("^[a-zA-Z0-9_-]{3,20}$");
    
    public static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }
    
    public static boolean isValidUsername(String username) {
        return username != null && USERNAME_PATTERN.matcher(username).matches();
    }
    
    public static boolean isValidPassword(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }
        
        // Check for at least one uppercase, lowercase, digit, and special character
        return password.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$");
    }
    
    public static String sanitizeInput(String input) {
        if (input == null) return null;
        
        // Remove potentially dangerous characters
        return input.replaceAll("[<>\"'%;()&+]", "").trim();
    }
}
```

#### Frontend Validation
```typescript
// Custom validators
export class CustomValidators {
  static strongPassword(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const hasNumber = /[0-9]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[#?!@$%^&*-]/.test(value);
    
    const valid = hasNumber && hasUpper && hasLower && hasSpecial && value.length >= 8;
    
    if (!valid) {
      return {
        strongPassword: {
          hasNumber,
          hasUpper,
          hasLower,
          hasSpecial,
          minLength: value.length >= 8
        }
      };
    }
    
    return null;
  }
}
```

### 8.3 Secure Cookie Configuration

```java
// Configure secure cookies for session management
public void configureCookies(Context ctx) {
    Cookie cookie = new Cookie("sessionId", sessionId);
    cookie.setHttpOnly(true);  // Prevent XSS
    cookie.setSecure(true);    // HTTPS only
    cookie.setSameSite("Strict"); // CSRF protection
    cookie.setMaxAge(3600);    // 1 hour
    cookie.setPath("/");
    
    ctx.cookie(cookie);
}
```

### 8.4 Rate Limiting

```java
// RateLimitingMiddleware.java
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

public class RateLimitingMiddleware {
    private final ConcurrentHashMap<String, AtomicInteger> requests = new ConcurrentHashMap<>();
    private final int maxRequests;
    private final long windowMs;
    
    public RateLimitingMiddleware(int maxRequests, long windowMs) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        
        // Clean up old entries periodically
        scheduleCleanup();
    }
    
    public void rateLimit(Context ctx) throws Exception {
        String clientIp = getClientIp(ctx);
        String key = clientIp + ":" + (System.currentTimeMillis() / windowMs);
        
        AtomicInteger count = requests.computeIfAbsent(key, k -> new AtomicInteger(0));
        
        if (count.incrementAndGet() > maxRequests) {
            ctx.status(429).json(Map.of("error", "Too many requests"));
            return;
        }
    }
    
    private String getClientIp(Context ctx) {
        String xForwardedFor = ctx.header("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return ctx.ip();
    }
}
```

### 8.5 Database Security

#### MongoDB Security Configuration
```javascript
// MongoDB security best practices

// 1. Enable authentication
use admin
db.createUser({
  user: "admin",
  pwd: "securePassword",
  roles: [ { role: "root", db: "admin" } ]
})

// 2. Create application-specific user
use yourapp
db.createUser({
  user: "appuser",
  pwd: "appPassword",
  roles: [ { role: "readWrite", db: "yourapp" } ]
})

// 3. Create indexes for performance and uniqueness
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "username": 1 }, { unique: true })
```

#### Connection Security
```java
// Secure MongoDB connection
public class DatabaseConfig {
    public static MongoDatabase getDatabase() {
        String connectionString = System.getenv("MONGO_DB_URL");
        
        // Configure SSL and authentication
        MongoClientSettings settings = MongoClientSettings.builder()
            .applyConnectionString(new ConnectionString(connectionString))
            .applyToSslSettings(builder -> builder.enabled(true))
            .applyToConnectionPoolSettings(builder -> 
                builder.maxSize(20).minSize(5))
            .build();
            
        MongoClient mongoClient = MongoClients.create(settings);
        return mongoClient.getDatabase(System.getenv("MONGO_DB_NAME"));
    }
}
```

---

## 9. Testing Authentication

### 9.1 Backend Testing

```java
// AuthServiceTest.java
@Test
class AuthServiceTest {
    private AuthService authService;
    private MongoDatabase testDatabase;
    
    @BeforeEach
    void setUp() {
        // Set up test database
        testDatabase = MongoClients.create().getDatabase("test_auth");
        authService = new AuthService(testDatabase);
    }
    
    @Test
    void testUserRegistration() {
        String username = "testuser";
        String email = "test@example.com";
        String password = "SecurePass123!";
        
        User user = authService.registerUser(username, email, password);
        
        assertNotNull(user);
        assertEquals(email, user.email);
        assertTrue(BCrypt.checkpw(password, user.passwordHash));
    }
    
    @Test
    void testUserAuthentication() {
        // Register user first
        String email = "test@example.com";
        String password = "SecurePass123!";
        authService.registerUser("testuser", email, password);
        
        // Test authentication
        User authenticatedUser = authService.authenticateUser(email, password);
        assertNotNull(authenticatedUser);
        assertEquals(email, authenticatedUser.email);
        
        // Test wrong password
        User invalidAuth = authService.authenticateUser(email, "wrongpassword");
        assertNull(invalidAuth);
    }
    
    @Test
    void testJWTGeneration() {
        User user = new User();
        user._id = "test123";
        user.email = "test@example.com";
        user.username = "testuser";
        
        String token = authService.generateToken(user);
        assertNotNull(token);
        assertTrue(token.contains("."));
        
        // Validate token
        User validatedUser = authService.validateToken(token);
        assertEquals(user._id, validatedUser._id);
    }
}
```

### 9.2 Frontend Testing

```typescript
// auth.service.spec.ts
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should login user successfully', () => {
    const mockResponse: AuthResponse = {
      token: 'fake-jwt-token',
      user: {
        _id: '1',
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User'
      }
    };

    service.login('test@example.com', 'password').subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(service.getToken()).toBe('fake-jwt-token');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: 'test@example.com',
      password: 'password'
    });
    req.flush(mockResponse);
  });

  it('should handle login error', () => {
    service.login('test@example.com', 'wrongpassword').subscribe({
      next: () => fail('Should have failed'),
      error: (error) => {
        expect(error.status).toBe(401);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}auth/login`);
    req.flush({ error: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
  });
});
```

### 9.3 End-to-End Testing

```typescript
// auth.e2e.spec.ts
describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login with valid credentials', () => {
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('SecurePass123!');
    cy.get('[data-testid="login-button"]').click();
    
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="user-menu"]').should('be.visible');
  });

  it('should show error with invalid credentials', () => {
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    cy.get('[data-testid="login-button"]').click();
    
    cy.get('[data-testid="error-message"]')
      .should('be.visible')
      .and('contain', 'Invalid credentials');
  });

  it('should register new user', () => {
    cy.get('[data-testid="register-link"]').click();
    
    cy.get('[data-testid="username-input"]').type('newuser');
    cy.get('[data-testid="email-input"]').type('newuser@example.com');
    cy.get('[data-testid="password-input"]').type('SecurePass123!');
    cy.get('[data-testid="register-button"]').click();
    
    cy.url().should('include', '/dashboard');
  });

  it('should logout successfully', () => {
    // Login first
    cy.login('test@example.com', 'SecurePass123!');
    
    cy.get('[data-testid="user-menu"]').click();
    cy.get('[data-testid="logout-button"]').click();
    
    cy.url().should('include', '/login');
    cy.get('[data-testid="login-form"]').should('be.visible');
  });
});
```

---

## 10. Recap and Further Resources

### 10.1 Key Takeaways

1. **Authentication is Critical**: Never compromise on security for convenience
2. **Multiple Layers**: Use defense in depth (hashing, JWTs, HTTPS, etc.)
3. **Secret Management**: Never commit secrets to version control
4. **Input Validation**: Always validate and sanitize user inputs
5. **Error Handling**: Don't expose sensitive information in error messages
6. **Testing**: Test all authentication flows thoroughly
7. **Updates**: Keep dependencies and security libraries up to date

### 10.2 Security Checklist

#### Before Going to Production:
- [ ] All passwords are hashed with bcrypt (or stronger)
- [ ] JWT secrets are cryptographically secure and stored safely
- [ ] HTTPS is enforced everywhere
- [ ] Input validation is implemented on both frontend and backend
- [ ] Rate limiting is in place for authentication endpoints
- [ ] Error messages don't leak sensitive information
- [ ] Session management is secure (proper expiration, secure cookies)
- [ ] Database connections are secured and authenticated
- [ ] Dependencies are up to date and vulnerability-free
- [ ] Logging doesn't include sensitive data
- [ ] CORS is properly configured
- [ ] Security headers are set appropriately

### 10.3 Common Pitfalls to Avoid

1. **Storing passwords in plain text**
2. **Using weak JWT secrets**
3. **Not validating tokens properly**
4. **Exposing sensitive information in error messages**
5. **Not implementing rate limiting**
6. **Trusting client-side validation only**
7. **Not setting secure cookie flags**
8. **Not implementing proper session expiration**
9. **Using outdated dependencies with known vulnerabilities**
10. **Not testing authentication flows thoroughly**

### 10.4 Further Resources

#### Documentation
- [OWASP Authentication Guide](https://owasp.org/www-project-top-ten/2017/A2_2017-Broken_Authentication)
- [JWT.io](https://jwt.io/) - JWT debugger and information
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Angular Security Guide](https://angular.dev/best-practices/security)
- [Javalin Security](https://javalin.io/documentation#security)

#### Libraries and Tools
- **bcrypt**: Password hashing
- **jsonwebtoken**: JWT implementation
- **Passport.js**: Authentication middleware (Node.js alternative)
- **Auth0**: Authentication as a Service
- **Firebase Auth**: Google's authentication service
- **Spring Security**: Comprehensive security framework for Java

#### Security Testing Tools
- **OWASP ZAP**: Web application security testing
- **Burp Suite**: Web vulnerability scanner
- **SonarQube**: Code quality and security analysis
- **npm audit**: Dependency vulnerability scanning
- **Snyk**: Vulnerability monitoring

#### MongoDB Security
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)
- [MongoDB Authentication](https://docs.mongodb.com/manual/tutorial/enable-authentication/)

#### JWT Security
- [JWT Security Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [JWT Attack Scenarios](https://owasp.org/www-chapter-vancouver/assets/presentations/2020-01_Attacking_and_Securing_JWT.pdf)

### 10.5 Next Steps

After completing this lesson, students should:

1. **Practice Implementation**: Build the authentication system step by step
2. **Security Testing**: Use security testing tools to find vulnerabilities
3. **Code Review**: Have peers review authentication code
4. **Stay Updated**: Follow security advisories for used libraries
5. **Learn Advanced Topics**: Study OAuth 2.1, WebAuthn, and other modern authentication methods

### 10.6 Q&A Discussion Points

1. **When should you use OAuth vs. local authentication?**
2. **How do you handle password reset flows securely?**
3. **What are the trade-offs between stateless (JWT) and stateful sessions?**
4. **How do you implement multi-factor authentication?**
5. **What are the security implications of "Remember Me" functionality?**
6. **How do you handle authentication in microservices architectures?**
7. **What are the latest trends in authentication (WebAuthn, passwordless, etc.)?**

---

## Assignment and Lab Exercises

### Lab Exercise 1: Basic Authentication
Implement username/password authentication with bcrypt hashing and JWT tokens.

### Lab Exercise 2: Google OAuth Integration
Add Google OAuth 2.0 login to your application.

### Lab Exercise 3: Security Hardening
Implement rate limiting, input validation, and security headers.

### Lab Exercise 4: Testing
Write comprehensive tests for all authentication flows.

---

*This lesson plan provides a comprehensive foundation for secure authentication in modern web applications. Remember that security is an ongoing process, not a one-time implementation.*