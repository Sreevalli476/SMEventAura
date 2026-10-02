package com.smeventaura.backend.controller;

import com.smeventaura.backend.dto.BookingDtos.*;
import com.smeventaura.backend.model.Booking;
import com.smeventaura.backend.model.User;
import com.smeventaura.backend.repository.BookingRepository;
import com.smeventaura.backend.repository.UserRepository;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

  private final BookingRepository repo;
  private final UserRepository users;

  public BookingController(
      BookingRepository repo,
      UserRepository users) {

    this.repo = repo;
    this.users = users;
  }

  private User current(HttpSession session) {

    Object id = session.getAttribute("USER_ID");

    if (id == null) {
      return null;
    }

    return users.findById((Long) id).orElse(null);
  }

  private boolean isAdmin(User user) {

    return user != null
        && user.getRole() == User.Role.ADMIN;
  }

  // =========================
  // CREATE BOOKING
  // =========================

  @PostMapping
  public ResponseEntity<?> create(
      @RequestBody Create data,
      HttpSession session) {

    User user = current(session);

    if (user == null) {

      return ResponseEntity
          .status(HttpStatus.UNAUTHORIZED)
          .body(Map.of(
              "message",
              "Please sign in first."));
    }

    if (data.name() == null
        || data.phone() == null
        || data.eventType() == null
        || data.eventDate() == null
        || data.venue() == null
        || data.budget() == null) {

      return ResponseEntity
          .badRequest()
          .body(Map.of(
              "message",
              "Please complete all required fields."));
    }

    if (data.eventDate().isBefore(LocalDate.now())) {

      return ResponseEntity
          .badRequest()
          .body(Map.of(
              "message",
              "Event date must be in the future."));
    }

    Booking booking = new Booking();

    booking.setCustomer(user);
    booking.setCustomerName(data.name().trim());
    booking.setCustomerEmail(user.getEmail());
    booking.setPhone(data.phone().trim());
    booking.setEventType(data.eventType());
    booking.setEventDate(data.eventDate());
    booking.setVenue(data.venue().trim());
    booking.setBudget(data.budget());
    booking.setMessage(data.message());

    repo.save(booking);

    Map<String, Object> response = new LinkedHashMap<>();

    response.put(
        "message",
        "Booking request created.");

    response.put(
        "id",
        booking.getId());

    return ResponseEntity.ok(response);
  }

  // =========================
  // MY BOOKINGS
  // =========================

  @GetMapping("/my")
  public ResponseEntity<?> mine(
      HttpSession session) {

    User user = current(session);

    if (user == null) {

      return ResponseEntity
          .status(HttpStatus.UNAUTHORIZED)
          .body(Map.of(
              "message",
              "Please sign in first."));
    }

    return ResponseEntity.ok(
        repo.findByCustomerIdOrderByCreatedAtDesc(
            user.getId())
            .stream()
            .map(this::map)
            .toList());
  }

  // =========================
  // ALL BOOKINGS - ADMIN
  // =========================

  @GetMapping
  public ResponseEntity<?> all(
      HttpSession session) {

    if (!isAdmin(current(session))) {

      return ResponseEntity
          .status(HttpStatus.FORBIDDEN)
          .body(Map.of(
              "message",
              "Admin access required."));
    }

    return ResponseEntity.ok(
        repo.findAllByOrderByCreatedAtDesc()
            .stream()
            .map(this::map)
            .toList());
  }

  // =========================
  // UPDATE BOOKING STATUS
  // =========================

  @PatchMapping("/{id}/status")
  public ResponseEntity<?> status(
      @PathVariable Long id,
      @RequestBody Status data,
      HttpSession session) {

    if (!isAdmin(current(session))) {

      return ResponseEntity
          .status(HttpStatus.FORBIDDEN)
          .body(Map.of(
              "message",
              "Admin access required."));
    }

    Booking booking = repo.findById(id).orElse(null);

    if (booking == null) {
      return ResponseEntity
          .notFound()
          .build();
    }

    try {

      booking.setStatus(
          Booking.Status.valueOf(
              data.status()));

    } catch (Exception exception) {

      return ResponseEntity
          .badRequest()
          .body(Map.of(
              "message",
              "Invalid booking status."));
    }

    repo.save(booking);

    return ResponseEntity.ok(
        map(booking));
  }

  // =========================
  // MAP BOOKING RESPONSE
  // =========================

  private Map<String, Object> map(
      Booking booking) {

    Map<String, Object> result = new LinkedHashMap<>();

    result.put(
        "id",
        booking.getId());

    result.put(
        "customerName",
        booking.getCustomerName());

    result.put(
        "customerEmail",
        booking.getCustomerEmail());

    result.put(
        "phone",
        booking.getPhone());

    result.put(
        "eventType",
        booking.getEventType());

    result.put(
        "eventDate",
        booking.getEventDate());

    result.put(
        "venue",
        booking.getVenue());

    result.put(
        "budget",
        booking.getBudget());

    result.put(
        "message",
        booking.getMessage() == null
            ? ""
            : booking.getMessage());

    result.put(
        "status",
        booking.getStatus().name());

    result.put(
        "createdAt",
        booking.getCreatedAt());

    return result;
  }
}