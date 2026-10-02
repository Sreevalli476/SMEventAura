package com.smeventaura.backend.controller;

import com.smeventaura.backend.model.User;
import com.smeventaura.backend.repository.UserRepository;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

  private final UserRepository repo;

  public UserController(UserRepository repo) {
    this.repo = repo;
  }

  // =========================
  // GET ALL CUSTOMERS
  // ADMIN ONLY
  // =========================

  @GetMapping
  public ResponseEntity<?> all(
      HttpSession session) {

    Object id = session.getAttribute("USER_ID");

    if (id == null) {

      return ResponseEntity
          .status(401)
          .body(Map.of(
              "message",
              "Please sign in."));
    }

    User me = repo.findById((Long) id)
        .orElse(null);

    if (me == null
        || me.getRole() != User.Role.ADMIN) {

      return ResponseEntity
          .status(403)
          .body(Map.of(
              "message",
              "Admin access required."));
    }

    return ResponseEntity.ok(
        repo.findAll()
            .stream()
            .filter(user -> user.getRole() == User.Role.CUSTOMER)
            .map(this::mapUser)
            .toList());
  }

  // =========================
  // MAP USER RESPONSE
  // =========================

  private Map<String, Object> mapUser(
      User user) {

    Map<String, Object> result = new LinkedHashMap<>();

    result.put(
        "id",
        user.getId());

    result.put(
        "name",
        user.getName());

    result.put(
        "email",
        user.getEmail());

    result.put(
        "phone",
        user.getPhone());

    result.put(
        "createdAt",
        user.getCreatedAt());

    return result;
  }
}