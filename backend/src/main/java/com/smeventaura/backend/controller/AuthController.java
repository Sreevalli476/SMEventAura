package com.smeventaura.backend.controller;

import com.smeventaura.backend.dto.AuthDtos.*;
import com.smeventaura.backend.model.User;
import com.smeventaura.backend.repository.UserRepository;

import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final UserRepository repo;
  private final BCryptPasswordEncoder enc = new BCryptPasswordEncoder();

  @Value("${app.admin.registration-code}")
  private String adminRegistrationCode;

  public AuthController(UserRepository repo) {
    this.repo = repo;
  }

  // ---------------------------------------------------------
  // Convert User entity to response object
  // ---------------------------------------------------------
  private UserView view(User u) {

    return new UserView(
        u.getId(),
        u.getName(),
        u.getEmail(),
        u.getPhone(),
        u.getRole().name(),
        u.getCreatedAt());
  }

  // ---------------------------------------------------------
  // NORMAL SIGNUP
  // Every normal signup is CUSTOMER
  // ---------------------------------------------------------
  @PostMapping("/signup")
  public ResponseEntity<?> signup(
      @RequestBody Signup d,
      HttpSession session) {

    if (d.name() == null ||
        d.name().trim().length() < 2 ||
        d.email() == null ||
        d.password() == null) {

      return ResponseEntity.badRequest()
          .body(new Message("Please fill all required fields."));
    }

    if (!d.password().equals(d.confirmPassword())) {

      return ResponseEntity.badRequest()
          .body(new Message("Passwords do not match."));
    }

    if (d.password().length() < 8) {

      return ResponseEntity.badRequest()
          .body(new Message(
              "Password must contain at least 8 characters."));
    }

    String email = d.email().trim().toLowerCase();

    if (repo.findByEmailIgnoreCase(email).isPresent()) {

      return ResponseEntity.status(HttpStatus.CONFLICT)
          .body(new Message(
              "An account with this email already exists."));
    }

    User u = new User();

    u.setName(d.name().trim());
    u.setEmail(email);
    u.setPhone(
        d.phone() == null
            ? ""
            : d.phone().trim());

    u.setPasswordHash(enc.encode(d.password()));

    // IMPORTANT:
    // Normal signup can NEVER create an admin.
    u.setRole(User.Role.CUSTOMER);

    repo.save(u);

    session.setAttribute("USER_ID", u.getId());

    return ResponseEntity.ok(view(u));
  }

  // ---------------------------------------------------------
  // ADMIN REGISTRATION
  //
  // Only ONE ADMIN can exist.
  // ---------------------------------------------------------
  @PostMapping("/admin-register")
  public ResponseEntity<?> adminRegister(
      @RequestBody AdminSignup d) {

    // Validate required fields
    if (d.name() == null ||
        d.name().trim().length() < 2 ||
        d.email() == null ||
        d.password() == null ||
        d.registrationCode() == null) {

      return ResponseEntity.badRequest()
          .body(new Message(
              "Please fill all required fields."));
    }

    // Validate password confirmation
    if (!d.password().equals(d.confirmPassword())) {

      return ResponseEntity.badRequest()
          .body(new Message(
              "Passwords do not match."));
    }

    // Minimum password length
    if (d.password().length() < 8) {

      return ResponseEntity.badRequest()
          .body(new Message(
              "Password must contain at least 8 characters."));
    }

    // Check admin registration code
    if (!adminRegistrationCode.equals(d.registrationCode())) {

      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(new Message(
              "Invalid admin registration code."));
    }

    String email = d.email().trim().toLowerCase();

    // Check whether email already exists
    if (repo.findByEmailIgnoreCase(email).isPresent()) {

      return ResponseEntity.status(HttpStatus.CONFLICT)
          .body(new Message(
              "An account with this email already exists."));
    }

    // -----------------------------------------------------
    // CRITICAL ONE-ADMIN CHECK
    // -----------------------------------------------------
    if (repo.existsByRole(User.Role.ADMIN)) {

      return ResponseEntity.status(HttpStatus.CONFLICT)
          .body(new Message(
              "An administrator already exists. "
                  + "Only one administrator is allowed."));
    }

    // Create the ONE admin
    User u = new User();

    u.setName(d.name().trim());
    u.setEmail(email);
    u.setPhone(
        d.phone() == null
            ? ""
            : d.phone().trim());

    u.setPasswordHash(enc.encode(d.password()));

    // This account is the single administrator.
    u.setRole(User.Role.ADMIN);

    repo.save(u);

    return ResponseEntity.ok(view(u));
  }

  // ---------------------------------------------------------
  // LOGIN
  // Both CUSTOMER and ADMIN use this endpoint.
  // ---------------------------------------------------------
  @PostMapping("/login")
  public ResponseEntity<?> login(
      @RequestBody Login d,
      HttpSession session) {

    String email = d.email() == null
        ? ""
        : d.email().trim();

    String password = d.password() == null
        ? ""
        : d.password();

    User u = repo.findByEmailIgnoreCase(email)
        .orElse(null);

    if (u == null ||
        u.getPasswordHash() == null ||
        !enc.matches(password, u.getPasswordHash())) {

      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(new Message(
              "Invalid email or password."));
    }

    session.setAttribute("USER_ID", u.getId());

    return ResponseEntity.ok(view(u));
  }

  // ---------------------------------------------------------
  // CURRENT USER
  // ---------------------------------------------------------
  @GetMapping("/me")
  public ResponseEntity<?> me(HttpSession session) {

    Object id = session.getAttribute("USER_ID");

    if (id == null) {

      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(new Message("Not signed in."));
    }

    User user = repo.findById((Long) id)
        .orElse(null);

    if (user == null) {

      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(new Message("Session expired."));
    }

    return ResponseEntity.ok(view(user));
  }

  // ---------------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------------
  @PostMapping("/logout")
  public Message logout(HttpSession session) {

    session.invalidate();

    return new Message("Logged out.");
  }
}