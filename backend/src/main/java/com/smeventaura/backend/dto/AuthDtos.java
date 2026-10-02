package com.smeventaura.backend.dto;

public final class AuthDtos {

    private AuthDtos() {
    }

    public record Signup(
            String name,
            String email,
            String phone,
            String password,
            String confirmPassword) {
    }

    public record AdminSignup(
            String name,
            String email,
            String phone,
            String password,
            String confirmPassword,
            String registrationCode) {
    }

    public record Login(
            String email,
            String password) {
    }

    public record UserView(
            Long id,
            String name,
            String email,
            String phone,
            String role,
            java.time.LocalDateTime createdAt) {
    }

    public record Message(
            String message) {
    }
}